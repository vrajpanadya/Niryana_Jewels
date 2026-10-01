'use client'
import Image from'next/image';import{useEffect,useMemo,useRef,useState}from'react';import{Check,ChevronLeft,ChevronRight,Heart,Minus,Plus,ShoppingBag,Star,Truck,ShieldCheck,RefreshCcw}from'lucide-react';import{Product,formatINR}from'@/data/products';import{useCartStore}from'@/store/cartStore';import{useWishlistStore}from'@/store/wishlistStore';import{FLY_TO_CART_MS,flyImageToCart,prefersReducedMotion}from'@/lib/flyToCart';

type Media={type:'image'|'video';src:string}

/**
 * Exactly one layout at every breakpoint: a snap-scrolling swipe carousel that shows
 * a single slide at a time on the phone *and* on the desktop, so the desktop gallery
 * reads like the mobile experience (one image, counter, arrows, dots). Rendering the
 * media once keeps a single `next/image` per asset — one preload, one `sizes` hint.
 */
function Gallery({product}:{product:Product}){
  const media=useMemo<Media[]>(()=>[
    ...product.images.map(src=>({type:'image' as const,src})),
    ...(product.video?[{type:'video' as const,src:product.video}]:[])
  ],[product])
  const trackRef=useRef<HTMLDivElement>(null)
  const[active,setActive]=useState(0)
  const count=media.length

  function onScroll(){
    const el=trackRef.current
    if(!el||!el.clientWidth)return
    setActive(Math.max(0,Math.min(count-1,Math.round(el.scrollLeft/el.clientWidth))))
  }
  function goTo(i:number){
    const el=trackRef.current
    if(!el||!count)return
    const index=Math.max(0,Math.min(count-1,i))
    setActive(index) // respond immediately; the smooth scroll keeps the slide in sync
    el.scrollTo({left:index*el.clientWidth,behavior:prefersReducedMotion()?'auto':'smooth'})
  }
  // Only the slide on screen keeps playing: swiping away pauses that slide's video.
  useEffect(()=>{
    const el=trackRef.current
    if(!el)return
    el.querySelectorAll('video').forEach(video=>{
      const slide=video.closest<HTMLElement>('[data-slide]')
      if(!slide||Number(slide.dataset.slide)!==active)video.pause()
    })
  },[active])

  return <div className="relative mx-auto w-full max-w-[600px]">
    <div className="relative overflow-hidden bg-cream">
      <div ref={trackRef} onScroll={onScroll} tabIndex={0} role="group" aria-roledescription="carousel"
        aria-label={`${product.name} gallery`}
        onKeyDown={e=>{
          if(e.key==='ArrowLeft'){e.preventDefault();goTo(active-1)}
          if(e.key==='ArrowRight'){e.preventDefault();goTo(active+1)}
        }}
        className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
        {media.map((m,i)=><div key={`${m.src}-${i}`} data-slide={i} data-active={active===i}
          className={`relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden ${m.type==='video'?'bg-black':'bg-cream'}`}>
          {m.type==='image'
            ?<Image src={m.src} alt={`${product.name} view ${i+1}`} fill priority={i===0} className="object-cover" sizes="(min-width:1024px) 600px, 100vw"/>
            :<video controls playsInline preload="metadata" poster={product.image} className="h-full w-full object-cover"><source src={m.src} type="video/mp4"/></video>}
        </div>)}
      </div>
      {count>1&&<>
        <button type="button" onClick={()=>goTo(active-1)} aria-label="Previous image"
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-forest shadow-[0_6px_18px_rgba(23,59,44,.14)] backdrop-blur hover:bg-forest hover:text-white sm:left-4"><ChevronLeft size={19}/></button>
        <button type="button" onClick={()=>goTo(active+1)} aria-label="Next image"
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-forest shadow-[0_6px_18px_rgba(23,59,44,.14)] backdrop-blur hover:bg-forest hover:text-white sm:right-4"><ChevronRight size={19}/></button>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white">{active+1}/{count}</span>
      </>}
    </div>
    {count>1&&<div className="mt-3 flex items-center justify-center gap-2">
      {media.map((m,i)=><button key={`dot-${i}`} type="button" onClick={()=>goTo(i)} aria-current={active===i}
        aria-label={m.type==='video'?'Show product video':`Show image ${i+1}`}
        className={`h-1.5 rounded-full transition-all ${active===i?'w-6 bg-forest':'w-1.5 bg-black/20'}`}/>)}
    </div>}
  </div>
}

export default function ProductDetail({product}:{product:Product}){
const[size,setSize]=useState(product.sizes[0]);const[q,setQ]=useState(1);
const add=useCartStore(s=>s.addItem);const openCart=useCartStore(s=>s.openCart);
const liked=useWishlistStore(s=>s.ids.includes(product.id));const toggle=useWishlistStore(s=>s.toggle);

// --- Add-to-bag micro-interaction state ---
// `added` drives the "Added ✓" button state; `addingRef` is the synchronous
// guard that swallows rapid double clicks (a second click within the window is
// ignored entirely, so the item is never added twice).
const galleryRef=useRef<HTMLDivElement>(null)
const addingRef=useRef(false)
const timers=useRef<number[]>([])
const[added,setAdded]=useState(false)
const later=(fn:()=>void,ms:number)=>{timers.current.push(window.setTimeout(fn,ms))}
// Never fire the delayed drawer-open / button reset after navigating away.
useEffect(()=>()=>{timers.current.forEach(t=>window.clearTimeout(t))},[])

function activeImageEl():HTMLImageElement|null{
  const root=galleryRef.current
  if(!root)return null
  // The swipeable gallery marks the visible slide with [data-active]; fall back
  // to the hero image when the active slide is a video (no <img> inside).
  const active=root.querySelector<HTMLElement>('[data-active="true"]')
  const img=(active&&active.querySelector('img'))||root.querySelector('img')
  return img instanceof HTMLImageElement?img:null
}

function onAddToBag(){
  if(addingRef.current)return
  addingRef.current=true
  setAdded(true)
  // Cart logic itself is untouched: size + quantity flow through the store as before.
  add({productId:product.id,slug:product.slug,name:product.name,image:product.image,price:product.price,size,quantity:q,maxStock:product.stock},{openCart:false})
  const reduced=prefersReducedMotion()
  const img=activeImageEl()
  const target=document.querySelector<HTMLElement>('[data-cart-button]')
  if(!reduced&&img&&target){
    flyImageToCart({sourceEl:img,imageUrl:img.currentSrc||img.src,targetEl:target})
    later(openCart,FLY_TO_CART_MS+40) // drawer slides in just after the thumbnail lands
  }else{
    later(openCart,0) // reduced motion (or missing anchors): open immediately, no flight
  }
  later(()=>{setAdded(false);addingRef.current=false},reduced?900:1700)
}

return <div className="container-lux py-8 md:py-14"><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16"><div ref={galleryRef}><Gallery product={product}/></div><div className="lg:sticky lg:top-28 lg:h-fit"><p className="eyebrow">{product.category} · {product.purity} {product.metal}</p><h1 className="display mt-4 text-5xl md:text-6xl">{product.name}</h1><div className="mt-4 flex items-center gap-3"><div className="flex text-gold">{[1,2,3,4,5].map(i=><Star key={i} size={13} fill="currentColor"/>)}</div><span className="text-xs text-black/45">{product.rating} · {product.reviews} reviews</span></div><p className="mt-7 text-xl">{formatINR(product.price)} {product.compareAt&&<del className="ml-2 text-base text-black/30">{formatINR(product.compareAt)}</del>}</p><p className="mt-2 text-[10px] text-black/45">Inclusive of all taxes</p><p className="mt-7 leading-7 text-black/55">{product.description}</p><div className="mt-8 border-t pt-7"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.14em]">Select size</span><button className="text-[10px] underline">Size guide</button></div><div className="flex flex-wrap gap-2">{product.sizes.map(s=><button onClick={()=>setSize(s)} key={s} className={`min-w-12 border px-4 py-3 text-xs ${size===s?'border-forest bg-forest text-white':'border-black/15 hover:border-black'}`}>{s}</button>)}</div></div><div className="mt-7 flex flex-wrap gap-3"><div className="flex items-center border border-black/15"><button onClick={()=>setQ(Math.max(1,q-1))} className="p-4"><Minus size={14}/></button><span className="w-7 text-center text-sm">{q}</span><button onClick={()=>setQ(Math.min(product.stock,q+1))} className="p-4"><Plus size={14}/></button></div><button onClick={onAddToBag} disabled={added} aria-label={added?`${product.name} added to bag`:'Add to bag'} className={`btn-primary order-3 w-full sm:order-none sm:w-auto sm:flex-1 ${added?'added':''}`}>{added?<><Check size={15} className="animate-pop-in"/>Added</>:<><ShoppingBag size={15}/>Add to bag</>}</button><span role="status" aria-live="polite" className="sr-only">{added?'Added to bag':""}</span><button onClick={()=>toggle(product.id)} className="flex w-14 items-center justify-center border border-black/15" aria-label="Wishlist"><Heart size={19} fill={liked?'#173b2c':'none'}/></button></div><button onClick={()=>{add({productId:product.id,slug:product.slug,name:product.name,image:product.image,price:product.price,size,quantity:q,maxStock:product.stock});location.href='/checkout'}} className="btn-outline mt-3 w-full">Buy it now</button><div className="mt-8 grid grid-cols-3 border-y py-5">{[[ShieldCheck,'Hallmarked'],[Truck,'Insured delivery'],[RefreshCcw,'7-day support']].map(([Icon,t]:any)=><div key={t} className="flex flex-col items-center gap-2 text-center text-[9px] uppercase tracking-[.1em] text-black/55"><Icon size={19} strokeWidth={1.3} className="text-gold"/>{t}</div>)}</div><details className="border-b py-5"><summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[.14em]">Materials &amp; craftsmanship</summary><p className="pt-4 text-sm leading-6 text-black/55">Hand-finished in Surat using responsibly sourced precious metal. Each piece is quality checked and hallmarked before dispatch.</p></details><details className="border-b py-5"><summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[.14em]">Shipping &amp; returns</summary><p className="pt-4 text-sm leading-6 text-black/55">Complimentary insured shipping above ₹5,000. Contact client care within 7 days for return assistance.</p></details></div></div></div>}
