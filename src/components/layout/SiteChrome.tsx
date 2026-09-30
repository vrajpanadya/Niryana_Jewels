'use client'
import{usePathname}from'next/navigation';import Header from'./Header';import Footer from'./Footer';import CartDrawer from'@/components/cart/CartDrawer';import WhatsAppButton from'@/components/shared/WhatsAppButton';
export default function SiteChrome({children}:{children:React.ReactNode}){const pathname=usePathname();const isAdmin=pathname.startsWith('/admin');if(isAdmin)return <main>{children}</main>;return <><Header/><main>{children}</main><Footer/><CartDrawer/><WhatsAppButton/></>}
