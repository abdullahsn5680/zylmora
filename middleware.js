import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export async function middleware(request) {
  const token = await getToken({ req: request })
  const currentUrl = new URL(request.url);
  const UrlPage = currentUrl.origin
  const apiUrl =`${UrlPage}/api/User`
  let User;
  if(token){
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({Id: token?.id}), 
    });

     User= await response.json(); 
  }
  if (!token)  {
    return NextResponse.redirect(new URL('/Authentication', request.url)); }

    if (User&&User?.data?.isactive==0)  {
      return NextResponse.redirect(new URL('/FrontEnd/Suspended', request.url)); }
      if (User&&User?.data?.admin==0&&request.url.includes('/Admin'))  {
        return NextResponse.redirect(new URL('/FrontEnd/NotBack', request.url)); }
      if (( request.url.includes('/FrontEnd/Suspended'))&&!(User&&User?.data?.isactive==1)) {
        return NextResponse.redirect(new URL('/', request.url));}
        
  return NextResponse.next();
}
export const config = {
  matcher: [
    
    '/Profile/:path*',
    '/Admin/:path*'
  ],
};
