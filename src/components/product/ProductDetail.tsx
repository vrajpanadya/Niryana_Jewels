'use client'
import Image from'next/image';import{useMemo,useRef,useState}from'react';import{Heart,Minus,Plus,Star,Truck,ShieldCheck,RefreshCcw}from'lucide-react';import{Product,formatINR}from'@/data/products';import{useCartStore}from'@/store/cartStore';import{useWishlistStore}from'@/store/wishlistStore';

type Media={type:'image'|'video';src:string}

/**
 * One DOM tree, two layouts: a snap-scrolling swipe carousel below `lg`, and the
 * editorial grid from `lg` up. Rendering the media once keeps a single `next/image`
 * per asset, so there is exactly one preload and one correct `sizes` hint.
 */
function Gallery({product}:{product:Product}){
  const media=useMemo<Media[]>(()=>[
    ...product.images.map(src=>({type:'image' as const,src})),
    ...(product.video?[{type:'video' as const,src:product.video}]:[])
  ],[product])
  const trackRef=useRef<HTMLDivElement>(null)
  const[active,setActive]=useState(0)
  // These coincide numerically but mean different things: the index of the final
  // image, and how many images sit below the hero (i.e. fill the two-column rows).
  const lastImage=product.images.length-1
  const secondaryImages=product.images.length-1

  function onScroll(){
    const el=trackRef.current
    if(!el||!el.clientWidth)return
    setActive(Math.max(0,Math.min(media.length-1,Math.round(el.scrollLeft/el.clientWidth))))
  }
  function goTo(i:number){
    const el=trackRef.current
    if(!el)return
    el.scrollTo({left:i*el.clientWidth,behavior:'smooth'})
  }

  return <div className="relative">
    <div ref={trackRef} onScroll={onScroll} role="group" aria-label={`${product.name} gallery`}
      className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible">
      {media.map((m,i)=>{
        // Video always spans the row. A lone trailing image does too, so the desktop
        // grid never leaves an orphaned empty half column.
        const wide=i===0||m.type==='video'||(i===lastImage&&secondaryImages%2===1)
        const tall=wide&&m.type==='image'
        return <div key={`${m.src}-${i}`}
          className={`relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden ${m.type==='video'?'bg-black lg:max-h-[720px]':'bg-cream'} ${wide?'lg:col-span-2':''} ${tall?'lg:aspect-[4/3]':''}`}>
          {m.type==='image'
            ?<Image src={m.src} alt={`${product.name} view ${i+1}`} fill priority={i===0} className="object-cover"
              sizes={wide?'(min-width:1024px) 55vw, 100vw':'(min-width:1024px) 28vw, 100vw'}/>
            :<video controls playsInline preload="metadata" poster={product.image} className="h-full w-full object-cover"><source src={m.src} type="video/mp4"/></video>}
        </div>
      })}
    </div>
    {media.length>1&&<>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white lg:hidden">{active+1}/{media.length}</span>
      <div className="mt-3 flex items-center justify-center gap-2 lg:hidden">
        {media.map((m,i)=><button key={`dot-${i}`} type="button" onClick={()=>goTo(i)} aria-current={active===i}
          aria-label={m.type==='video'?'Show product video':`Show image ${i+1}`}
          className={`h-1.5 rounded-full transition-all ${active===i?'w-6 bg-forest':'w-1.5 bg-black/20'}`}/>)}
      </div>
    </>}
  </div>
}

export default function ProductDetail({product}:{product:Product}){const[size,setSize]=useState(product.sizes[0]);const[q,setQ]=useState(1);const add=useCartStore(s=>s.addItem);const liked=useWishlistStore(s=>s.ids.includes(product.id));const toggle=useWishlistStore(s=>s.toggle);return <div className="container-lux py-8 md:py-14"><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16"><Gallery product={product}/><div className="lg:sticky lg:top-28 lg:h-fit"><p className="eyebrow">{product.category} · {product.purity} {product.metal}</p><h1 className="display mt-4 text-5xl md:text-6xl">{product.name}</h1><div className="mt-4 flex items-center gap-3"><div className="flex text-gold">{[1,2,3,4,5].map(i=><Star key={i} size={13} fill="currentColor"/>)}</div><span className="text-xs text-black/45">{product.rating} · {product.reviews} reviews</span></div><p className="mt-7 text-xl">{formatINR(product.price)} {product.compareAt&&<del className="ml-2 text-base text-black/30">{formatINR(product.compareAt)}</del>}</p><p className="mt-2 text-[10px] text-black/45">Inclusive of all taxes</p><p className="mt-7 leading-7 text-black/55">{product.description}</p><div className="mt-8 border-t pt-7"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.14em]">Select size</span><button className="text-[10px] underline">Size guide</button></div><div className="flex flex-wrap gap-2">{product.sizes.map(s=><button onClick={()=>setSize(s)} key={s} className={`min-w-12 border px-4 py-3 text-xs ${size===s?'border-forest bg-forest text-white':'border-black/15 hover:border-black'}`}>{s}</button>)}</div></div><div className="mt-7 flex flex-wrap gap-3"><div className="flex items-center border border-black/15"><button onClick={()=>setQ(Math.max(1,q-1))} className="p-4"><Minus size={14}/></button><span className="w-7 text-center text-sm">{q}</span><button onClick={()=>setQ(Math.min(product.stock,q+1))} className="p-4"><Plus size={14}/></button></div><button onClick={()=>add({productId:product.id,slug:product.slug,name:product.name,image:product.image,price:product.price,size,quantity:q,maxStock:product.stock})} className="btn-primary order-3 w-full sm:order-none sm:w-auto sm:flex-1">Add to bag</button><button onClick={()=>toggle(product.id)} className="flex w-14 items-center justify-center border border-black/15" aria-label="Wishlist"><Heart size={19} fill={liked?'#173b2c':'none'}/></button></div><button onClick={()=>{add({productId:product.id,slug:product.slug,name:product.name,image:product.image,price:product.price,size,quantity:q,maxStock:product.stock});location.href='/checkout'}} className="btn-outline mt-3 w-full">Buy it now</button><div className="mt-8 grid grid-cols-3 border-y py-5">{[[ShieldCheck,'Hallmarked'],[Truck,'Insured delivery'],[RefreshCcw,'7-day support']].map(([Icon,t]:any)=><div key={t} className="flex flex-col items-center gap-2 text-center text-[9px] uppercase tracking-[.1em] text-black/55"><Icon size={19} strokeWidth={1.3} className="text-gold"/>{t}</div>)}</div><details className="border-b py-5"><summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[.14em]">Materials &amp; craftsmanship</summary><p className="pt-4 text-sm leading-6 text-black/55">Hand-finished in Surat using responsibly sourced precious metal. Each piece is quality checked and hallmarked before dispatch.</p></details><details className="border-b py-5"><summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[.14em]">Shipping &amp; returns</summary><p className="pt-4 text-sm leading-6 text-black/55">Complimentary insured shipping above ₹5,000. Contact client care within 7 days for return assistance.</p></details></div></div></div>}
