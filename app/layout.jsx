import './globals.css';
import Navbar from './Components/UI/Navbar';
import Footer from './Components/UI/Footer';
import NavbarM from './Components/UI/MObile/NavbarM';
import SlideBar from './Components/UI/MObile/SlideBar';
import AuthSessionProvider from './Provider/Auth/AuthSessionProvider';
import ContextProvider from './Context/contextProvider';


export const metadata = {
  title: 'StyleNest – Cozy, Stylish, and Everyday Wear for All',
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
            <div className="flex md:hidden fixed top-0 left-0 right-0 z-10">
              <NavbarM />
            </div>
            <div className="hidden md:flex fixed top-0 left-0 right-0 z-10">
              <Navbar />
            </div>
            <div className="absolute top-[14vh] w-full">
              {children}
           
            </div>
            <div className="top-0 fixed z-20 md:hidden">
              <SlideBar />
            </div>
          </ContextProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
