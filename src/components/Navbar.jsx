import React, { useContext, useState, useEffect, useRef } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible,setVisible] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    const {setShowSearch , getCartCount , navigate, token, setToken, setCartItems} = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      
      <Link to='/'><img src={assets.logo} className='w-36' alt='Tibet417 — Tibetan and Himalayan fashion' /></Link>

      {/* The primary nav is the strongest internal-link signal Google has for
          which pages matter. The category links are here so the crawlable
          category URLs are reachable from every page, not just the footer. */}
      <nav aria-label='Primary'>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

        <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection/men' className='flex flex-col items-center gap-1'>
            <p>MEN</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection/women' className='flex flex-col items-center gap-1'>
            <p>WOMEN</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

      </ul>
      </nav>

      <div className='flex items-center gap-6'>
            <img onClick={()=> { setShowSearch(true); navigate('/collection') }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
            
            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            
            {/* Profile Menu Icon (3 lines) - Hidden on mobile */}
            <div className='relative hidden sm:block' ref={profileMenuRef}>
                <div 
                    onClick={()=> token ? setShowProfileMenu(!showProfileMenu) : navigate('/login')} 
                    className='flex flex-col gap-1 cursor-pointer'
                >
                    <div className='w-5 h-0.5 bg-gray-700'></div>
                    <div className='w-5 h-0.5 bg-gray-700'></div>
                    <div className='w-5 h-0.5 bg-gray-700'></div>
                </div>
                
                {/* Dropdown Menu */}
                {token && showProfileMenu && 
                <div className='absolute dropdown-menu right-0 pt-4 z-10'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
                        <p onClick={()=>{navigate('/profile'); setShowProfileMenu(false)}} className='cursor-pointer hover:text-black'>My Profile</p>
                        <p onClick={()=>{navigate('/orders'); setShowProfileMenu(false)}} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={()=>{logout(); setShowProfileMenu(false)}} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>}
            </div>
            
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" /> 
      </div>

        {/* Sidebar menu for small screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection/men'>MEN</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection/women'>WOMEN</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection/kids'>KIDS</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                    
                    {/* Profile menu items for mobile */}
                    {token ? (
                        <>
                            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/profile'>MY PROFILE</NavLink>
                            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/orders'>ORDERS</NavLink>
                            <p onClick={()=>{logout(); setVisible(false)}} className='py-2 pl-6 border cursor-pointer'>LOGOUT</p>
                        </>
                    ) : (
                        <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/login'>LOGIN</NavLink>
                    )}
                </div>
        </div>

    </div>
  )
}

export default Navbar
