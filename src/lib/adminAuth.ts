import {createHmac,timingSafeEqual} from 'crypto'

export const ADMIN_COOKIE='niryana_admin_session'
const maxAge=60*60*8

function secret(){return process.env.ADMIN_SESSION_SECRET||process.env.NEXTAUTH_SECRET||'niryana-local-preview-secret-change-in-production'}

export function createAdminToken(email:string){
  const payload=Buffer.from(JSON.stringify({email,role:'SUPER_ADMIN',exp:Math.floor(Date.now()/1000)+maxAge})).toString('base64url')
  const signature=createHmac('sha256',secret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyAdminToken(token?:string|null){
  if(!token)return null
  try{
    const[payload,signature]=token.split('.')
    if(!payload||!signature)return null
    const expected=createHmac('sha256',secret()).update(payload).digest('base64url')
    const a=Buffer.from(signature),b=Buffer.from(expected)
    if(a.length!==b.length||!timingSafeEqual(a,b))return null
    const session=JSON.parse(Buffer.from(payload,'base64url').toString()) as {email:string;role:string;exp:number}
    if(session.exp<Math.floor(Date.now()/1000)||session.role!=='SUPER_ADMIN')return null
    return session
  }catch{return null}
}

export const adminCookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge}
