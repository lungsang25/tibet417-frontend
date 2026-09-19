// Anchor ids for the homepage sections. The hero slider scrolls to these, so
// Home.jsx (which places them) and Hero.jsx (which targets them) import the
// same constants rather than repeating the strings. Listed in the order the
// sections appear on the page (SALE comes first but has no anchor: nothing
// scrolls to it, it sits right under the hero).
export const HOME_SECTION_IDS = {
  style: 'dive-into-style',
  seasons: 'shop-by-season',
  bestSellers: 'best-sellers',
  latest: 'latest-collections',
  underThirty: 'under-30',
}
