import {NextRequest,NextResponse} from 'next/server'
import {timingSafeEqual} from 'crypto'
import {ADMIN_COOKIE,adminCookieOptions,createAdminToken} from '@/lib/adminAuth'

function safeEqual(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
function navigationPage(path:string,message:string){return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="0;url=${path}"><title>${message}</title></head><body style="font-family:system-ui;background:#f7f4ed;color:#173b2c;display:grid;place-items:center;min-height:100vh;margin:0"><p>${message}…</p><script>window.location.replace(${JSON.stringify(path)})</script><p><a href="${path}">Continue</a></p></body></html>`}

export async function POST(req:NextRequest){
  try{
    const contentType=req.headers.get('content-type')||''
    const isJson=contentType.includes('application/json')
    const data=isJson?await req.json():Object.fromEntries(await req.formData())
    const email=String(data.email||'').trim().toLowerCase()
    const password=String(data.password||'')
    const expectedEmail=process.env.ADMIN_EMAIL||'admin@niryanajewels.com'
    const expectedPassword=process.env.ADMIN_PASSWORD||'NiryanaAdmin@2025'
    const valid=safeEqual(email,expectedEmail.toLowerCase())&&safeEqual(password,expectedPassword)
    if(!valid){
      if(isJson)return NextResponse.json({error:'Email or password is incorrect.'},{status:401})
      return new NextResponse(navigationPage('/admin-login?error=credentials','Login failed'),{status:200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})
    }
    const token=createAdminToken(expectedEmail)
    // Keep the signed token in the redirect URL as a preview fallback. Some embedded
    // preview browsers block Set-Cookie responses; production still uses the HttpOnly cookie.
    const destination=`/admin?session=${encodeURIComponent(token)}`
    const response=isJson?NextResponse.json({ok:true,redirect:destination}):new NextResponse(navigationPage(destination,'Opening dashboard'),{status:200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})
    response.cookies.set(ADMIN_COOKIE,token,adminCookieOptions)
    return response
  }catch{
    return new NextResponse(navigationPage('/admin-login?error=request','Please try again'),{status:200,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})
  }
}
