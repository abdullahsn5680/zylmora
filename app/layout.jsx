import './globals.css';
import Navbar from './Components/UI/Navbar';
import MobileNavbar from './Components/UI/MObile/bottomNav';
import NavbarM from './Components/UI/MObile/NavbarM';
import SlideBar from './Components/UI/MObile/SlideBar';
import AuthSessionProvider from './Provider/Auth/AuthSessionProvider';
import ContextProvider from './Context/contextProvider';
import LoaderProvider from './Provider/loader/loaderProvider';
export const metadata = {
  title: 'Zylmora – Cozy, Stylish, and Everyday Wear for All',
  description: 'Build your nest of comfort and fashion.',
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
       <link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

      </head>
      <body className="overflow-x-hidden relative">
        <AuthSessionProvider>
          <ContextProvider>
            <div className="flex lg:hidden fixed top-0 left-0 right-0 z-10">
              <NavbarM />
            </div>
            <div className="hidden lg:flex fixed top-0 left-0 right-0 z-10">
              <Navbar />
            </div>
           
            <div className="absolute top-[14vh]  bottom-8  w-full">
          
              {children}
          
            </div>
          <div className="fixed bottom-18 z-50 right-5">
  <a 
    href="https://wa.me/923243040120?text=Hello%20I%20am%20interested%20in%20Zylmora%20products" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 cursor-pointer"
  >
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  </a>
</div>
   
            <div className="top-0 fixed z-20 md:hidden">
              <SlideBar />
            </div>
            <div className="w-full "><MobileNavbar/></div>
          </ContextProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
