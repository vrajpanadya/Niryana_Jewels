export const GITHUB_BASE=process.env.NEXT_PUBLIC_GITHUB_ASSETS_BASE||'https://raw.githubusercontent.com/AksharGabani/Niryana-Jewels-assets/main'
// The repository currently ships the supplied campaign media locally for a reliable preview.
// Set NEXT_PUBLIC_GITHUB_ASSETS_BASE and replace paths here when the separate asset repository is published.
export const ASSETS={
 logo:{full:'/media/brand/logo-full.png',light:'/media/brand/logo-light.png'},
 images:{store:'/media/images/store-1.jpg',store2:'/media/images/store-2.jpg',store3:'/media/images/store-3.jpg',necklace:'/media/images/necklace.jpg',earrings:'/media/images/earrings.jpg',heartRing:'/media/images/heart-ring.jpg',diamondRing:'/media/images/diamond-ring.jpg',roseRing:'/media/images/rose-ring.jpg',ramPendant:'/media/images/ram-pendant.jpg',bracelet:'/media/images/bracelet.jpg',goldRing:'/media/images/gold-ring.jpg',collection:'/media/images/collection.jpg',detail:'/media/images/detail.jpg',lifestyle:'/media/images/lifestyle.jpg'},
 videos:{hero:'/media/video/rings.mp4',pendant:'/media/video/pendant.mp4',spiritual:'/media/video/spiritual.mp4',bracelets:'/media/video/bracelets.mp4',gems:'/media/video/gems.mp4'}
} as const
export const githubAsset=(path:string)=>`${GITHUB_BASE}/${path.replace(/^\//,'')}`
