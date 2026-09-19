import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { getMediumImage } from '../utils/imageUtils'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigation'
import { isPrerenderBrowser } from '../pwa/env'
import { getEffectivePrice, serverNow } from '../utils/sale'

export const ShopContext = createContext();

/**
 * scripts/prerender.mjs inlines the product list into each prerendered page as
 * window.__TIBET417_PRODUCTS__.
 *
 * Without it the first client render has an empty catalogue while the
 * prerendered HTML already shows six products, so hydration fails on every page
 * that lists products and React throws the markup away and repaints. Seeding
 * initial state from the inlined data makes the first render identical — and
 * skips a round-trip to the API before anything can appear.
 */
const normalizeProducts = (list) => [...list].reverse();

const preloadedProducts = () => {
    if (typeof window === 'undefined' || !Array.isArray(window.__TIBET417_PRODUCTS__)) return null;
    return normalizeProducts(window.__TIBET417_PRODUCTS__);
};

// The backend's description of the sale (see GET /api/sale/current) in the
// shape the storefront wants: a Set for cheap "is this product on sale" checks,
// and the gap between the server's clock and this device's so countdowns run on
// server time.
const toSaleState = (sale) => ({
    active: sale.active,
    percentOff: sale.percentOff,
    stageIndex: sale.stageIndex,
    stageCount: sale.stageCount,
    nextChangeAt: sale.nextChangeAt,
    nextPercentOff: sale.nextPercentOff,
    productIds: new Set(sale.productIds),
    clockOffset: sale.serverNow - Date.now(),
});

const ShopContextProvider = (props) => {

    // The checkout has always billed CHF (orderController.js -> Payrexx,
    // currency: 'CHF') and the GTC state prices are "strictly net and in Swiss
    // francs". The storefront rendered a '$' against those same numbers, so a
    // customer saw "$50" and was charged "CHF 50".
    const currency = 'CHF';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState(() => preloadedProducts() ?? []);
    const [productsLoaded, setProductsLoaded] = useState(() => preloadedProducts() !== null);
    const [sale, setSale] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [token, setToken] = useState('')
    const [authChecked, setAuthChecked] = useState(false)
    const navigate = useLocalizedNavigate();


    // Server-side /api/cart/add (cartController.js) always increments by
    // exactly 1 and ignores any other field in the body — it isn't a
    // quantity-aware endpoint. addToCart mirrors that here so local state
    // never drifts from what the server actually persists for a logged-in
    // user. Adding more than one at once (e.g. from the PDP quantity
    // selector) goes through updateQuantity instead, which the server does
    // treat as an absolute value.
    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        // cartItems is a snapshot from this render's context value. A caller
        // that just awaited addToCart for the same itemId (Product.jsx's
        // quantity selector does this) can reach here before that state
        // update has flowed back through context, so cartData[itemId] may
        // still look empty even though the item was just added — guard
        // rather than crash on cartData[itemId][size] = ...
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    // What a product costs right now — its sale price while it is in a running
    // sale, otherwise its regular price. `basePrice` is optional when the
    // caller only has an id.
    const getPriceInfo = (productId, basePrice) => {
        const price = basePrice ?? products.find((product) => product._id === productId)?.price;
        return getEffectivePrice(productId, price, sale);
    }

    const getCartAmount = () => {
        let totalCents = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        const { price } = getPriceInfo(itemInfo._id, itemInfo.price);
                        // Whole cents, so sale prices like 14.93 don't
                        // accumulate floating-point noise across lines.
                        totalCents += Math.round(price * 100) * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCents / 100;
    }

    const preloadImages = (products) => {
        const first10 = products.slice(0, 10);
        first10.forEach((product) => {
            if (product.image && product.image[0]) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = getMediumImage(product.image[0]);
                document.head.appendChild(link);
            }
        });
    };

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                // Same transform as the preload path, so a refresh after
                // hydration cannot reorder what is already on screen.
                const reversedProducts = normalizeProducts(response.data.products);
                setProducts(reversedProducts);
                preloadImages(reversedProducts);
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setProductsLoaded(true)
        }
    }

    // A failed sale fetch is deliberately silent: the sale is an extra, and
    // falling back to regular prices is correct (the server prices the order
    // itself in any case), so there is nothing useful to toast about.
    const getSaleData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/sale/current')
            if (response.data.success) {
                setSale(toSaleState(response.data.sale))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const fetchWishlist = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } });
            if (response.data.success) {
                setWishlist(response.data.wishlist.map(item => item._id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addToWishlist = async (productId) => {
        if (!token) {
            toast.error('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        try {
            setWishlist(prev => [...prev, productId]);
            const response = await axios.post(backendUrl + '/api/wishlist/add', { productId }, { headers: { token } });
            if (response.data.success) {
                toast.success('Added to wishlist');
            } else {
                setWishlist(prev => prev.filter(id => id !== productId));
                toast.error(response.data.message);
            }
        } catch (error) {
            setWishlist(prev => prev.filter(id => id !== productId));
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setWishlist(prev => prev.filter(id => id !== productId));
            const response = await axios.post(backendUrl + '/api/wishlist/remove', { productId }, { headers: { token } });
            if (response.data.success) {
                toast.success('Removed from wishlist');
            } else {
                setWishlist(prev => [...prev, productId]);
                toast.error(response.data.message);
            }
        } catch (error) {
            setWishlist(prev => [...prev, productId]);
            console.log(error);
            toast.error(error.message);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const getWishlistCount = () => {
        return wishlist.length;
    };

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        // Prerendered snapshots are taken once, at build time, and served for
        // days. A discount that steps up every 24h must never be baked into
        // them, so the prerender browser doesn't ask for the sale at all.
        if (isPrerenderBrowser()) return
        getSaleData()
        // A background tab or a sleeping laptop misses the timer below, and an
        // admin can end the sale at any moment — re-check when the tab is back.
        const onVisible = () => {
            if (document.visibilityState === 'visible') getSaleData()
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => document.removeEventListener('visibilitychange', onVisible)
    }, [])

    // Re-fetch just after the next discount step so prices and the countdown
    // move on by themselves. Keyed on the whole `sale` object, not just the
    // timestamp: if the response was a few seconds stale and still describes
    // the old step, this schedules another attempt instead of giving up.
    useEffect(() => {
        if (!sale?.nextChangeAt) return
        const wait = sale.nextChangeAt - serverNow(sale) + 2000
        const timer = setTimeout(getSaleData, Math.max(wait, 2000))
        return () => clearTimeout(timer)
    }, [sale])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            fetchWishlist(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
            fetchWishlist(token)
        }
        // `token` starts as '' and is only filled in here, one tick after the
        // first render. Without this flag an auth-guarded page cannot tell
        // "logged out" from "not read localStorage yet", so it redirects every
        // logged-in visitor to /login on first paint — which is exactly what a
        // customer following the tracking link in a shipping email does.
        setAuthChecked(true)
    }, [token])

    const value = {
        products, productsLoaded, currency, delivery_fee,
        sale, refreshSale: getSaleData, getPriceInfo,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, authChecked,
        wishlist, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;