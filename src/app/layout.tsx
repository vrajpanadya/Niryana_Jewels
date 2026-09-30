import type{Metadata,Viewport}from'next';import'./globals.css';import SiteChrome from'@/components/layout/SiteChrome';
export const viewport:Viewport={width:'device-width',initialScale:1,maximumScale:5,themeColor:'#173b2c'};
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://niryanajewels.com'),title:{default:'Niryana Jewels — Heart & Heritage',template:'%s | Niryana Jewels'},description:'Premium fine jewellery, handcrafted in Surat with heart and heritage.',openGraph:{title:'Niryana Jewels',description:'Fine Jewellery with Heart & Heritage',type:'website'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>}
