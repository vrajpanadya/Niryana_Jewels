import{cookies}from'next/headers';import{redirect}from'next/navigation';import{ADMIN_COOKIE,verifyAdminToken}from'./adminAuth';
export function requireAdmin(queryToken?:string){const session=verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value)||verifyAdminToken(queryToken);if(!session)redirect('/admin-login?error=session');return session}
