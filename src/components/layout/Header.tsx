'use client'
import Link from 'next/link';import Image from 'next/image';import{usePathname}from'next/navigation';import{useEffect,useState}from'react';import{Menu,X,Search,UserRound,Heart,ShoppingBag,ChevronDown}from'lucide-react';import{useCartStore}from'@/store/cartStore';import{useWishlistStore}from'@/store/wishlistStore';
const links=[['Rings','/shop/rings'],['Earrings','/shop/earrings'],['Pendants','/shop/spiritual'],['Bracelets','/shop/bracelets'],['Collections','/collections']]
function Logo({light=false}:{light?:boolean}){return <Link href="/" className="relative block h-[62px] w-[110px] shrink-0 sm:w-[122px]" aria-label="Niryana Jewels home"><Image src={light?'/media/brand/logo-light.png':'/media/brand/logo-full.png'} alt="Niryana Jewels" fill priority className="object-contain" sizes="122px"/></Link>}

export default function Header(){
  const[menu,setMenu]=useState(false)
  // Cart and wishlist are persisted in localStorage, so their counts only exist on the
  // client. Render zero until mounted to keep the server and client markup identical.
  const[mounted,setMounted]=useState(false)
  const pathname=usePathname()
  const home=pathname==='/'
  const items=useCartStore(s=>s.items)
  const open=useCartStore(s=>s.openCart)
  const wishIds=useWishlistStore(s=>s.ids.length)
  const wish=mounted?wishIds:0
  const count=mounted?items.reduce((n,i)=>n+i.quantity,0):0

  useEffect(()=>setMounted(true),[])
  useEffect(()=>setMenu(false),[pathname])
  useEffect(()=>{
    if(!menu)return
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false)}
    window.addEventListener('keydown',onKey)
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)}
  },[menu])

  return <>
    <header className={`${home?'absolute inset-x-0 top-0 text-white':'relative text-forest'} z-40 bg-transparent`}>
      <div className="container-lux grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/shop" className="text-[11px] font-semibold uppercase tracking-[.12em]">Shop all</Link>
          {links.slice(0,4).map(([l,h])=><Link key={l} href={h} className={`text-[11px] uppercase tracking-[.1em] hover:text-gold ${home?'text-white/80':'text-black/65'}`}>{l}</Link>)}
        </nav>
        <button onClick={()=>setMenu(true)} className="justify-self-start lg:hidden" aria-label="Open menu" aria-expanded={menu}><Menu size={22}/></button>
        <Logo light={home}/>
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <Link href="/search" aria-label="Search"><Search size={19}/></Link>
          <Link href="/login" className="hidden sm:block" aria-label="Account"><UserRound size={19}/></Link>
          <Link href="/wishlist" className="relative" aria-label={wish>0?`Wishlist, ${wish} saved`:'Wishlist'}><Heart size={19}/>{wish>0&&<span className="absolute -right-2 -top-2 h-4 min-w-4 rounded-full bg-gold px-1 text-center text-[9px] leading-4 text-forest">{wish}</span>}</Link>
          <button onClick={open} className="relative" aria-label={count>0?`Open cart, ${count} items`:'Open cart'}><ShoppingBag size={20}/>{count>0&&<span className="absolute -right-2 -top-2 h-4 min-w-4 rounded-full bg-forest px-1 text-center text-[9px] leading-4 text-white">{count}</span>}</button>
        </div>
      </div>
    </header>
    {menu&&<div className="fixed inset-0 z-50 overflow-y-auto bg-cream p-5 pb-28 animate-rise sm:p-6" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex items-center justify-between"><Logo/><button onClick={()=>setMenu(false)} aria-label="Close menu"><X/></button></div>
      <nav className="mt-12 flex flex-col">
        {[['Shop all','/shop'],...links,['Our story','/about'],['Contact','/contact']].map(([l,h])=><Link onClick={()=>setMenu(false)} key={l} href={h} className="flex items-center justify-between border-b border-forest/10 py-5 font-serif text-3xl">{l}<ChevronDown className="-rotate-90" size={18}/></Link>)}
      </nav>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link onClick={()=>setMenu(false)} href="/wishlist" className="flex items-center justify-center gap-2 border border-forest/20 py-4 text-[11px] font-semibold uppercase tracking-[.12em]"><Heart size={16}/>Wishlist{wish>0&&<span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] text-forest">{wish}</span>}</Link>
        <Link onClick={()=>setMenu(false)} href="/login" className="flex items-center justify-center gap-2 border border-forest/20 py-4 text-[11px] font-semibold uppercase tracking-[.12em]"><UserRound size={16}/>Account</Link>
      </div>
      <div className="mt-8 text-xs leading-6 text-black/50">Surat, Gujarat<br/>+91 99251 79067</div>
    </div>}
  </>
}
