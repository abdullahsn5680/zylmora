import "./globals.css";
import MobileNavbar from "./Components/UI/MObile/bottomNav";
import { LoaderProvider } from "./Provider/loader/loaderProvider";
import { AlertProvider } from "./Provider/Alert/AlertProvider";
import AuthSessionProvider from "./Provider/Auth/AuthSessionProvider";
import Footer from "./Components/UI/Footer";
import ContextProvider from "./Context/contextProvider";
import NavbarProvider from "./Provider/NavBAr/NavbarProivder";
import SlideBarWrapper from "./Provider/SlideBarPorvider/SlideBarProvider";

import localFont from "next/font/local"; 


const inter = localFont({
  src: [
    {
      path: "../public/fonts/inter/Inter.woff2",
      weight: "100 900", 
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata = {
  title: "Zylmora – Cozy, Stylish, and Everyday Wear for All",
  description: "Build your nest of comfort and fashion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden relative">
        <LoaderProvider>
          <AlertProvider>
            <AuthSessionProvider>
              <ContextProvider>
                <NavbarProvider />
                <main className="pt-[14vh] pb-32 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 w-full">
                  {children}
                  <Footer />
                </main>

               
               
                <div className="fixed bottom-[88px] z-50 right-3">
                  <a
                    href="https://wa.me/923243040120?text=Hello%20I%20am%20interested%20in%20Zylmora%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 cursor-pointer"
                  ></a>
                </div>

               
                <div className="top-0 fixed z-20 md:hidden">
                  <SlideBarWrapper />
                </div>

               
                <div className="w-full">
                  <MobileNavbar />
                </div>
              </ContextProvider>
            </AuthSessionProvider>
          </AlertProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
