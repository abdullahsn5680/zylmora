
import "./globals.css";
import Navbar from "./Components/UI/Navbar";
import Announcemnt from "./Components/alerts/announcemnt";
import Footer from "./Components/UI/Footer";
import AuthSessionProvider from "./Provider/Auth/AuthSessionProvider";
import NavbarM from "./Components/UI/MObile/NavbarM";
import SlideBar from "./Components/UI/MObile/SlideBar";
import ContextProvider from "./Context/contextProvider";
export const metadata = {
  title: "StyleNest – Cozy, Stylish, and Everyday Wear for All",
  description: "Build your nest of comfort and fashion. StyleNest offers modern, affordable, and casual clothing designed for daily wear and seasonal flair.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` overflow-x-hidden  relative  `}>
          <AuthSessionProvider>
          <ContextProvider className='absolute top-0 left-0 right-0 bottom-0'>
            <AuthSessionProvider>
        
        <div className="flex md:hidden fixed top-0 left-0 right-0 z-10">   <NavbarM/></div>
        <div className="hidden md:flex fixed top-0 left-0 right-0 z-10">  <Navbar/></div>
        {/* <div className="fixed top-[9vh] left-0 right-0 z-5"><Announcemnt/></div> */}
        <div className="absolute top-[14vh] w-full">
          
          {children}
        
            <div className=""><Footer/></div>
            
        </div>
        <div className="top-0 fixed z-20 md:hidden"> <SlideBar/></div>
    </AuthSessionProvider>
     </ContextProvider>
       </AuthSessionProvider>
      </body>
    </html>
  );
}
