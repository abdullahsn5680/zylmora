"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSpring, animated, a } from "@react-spring/web";
import Login from "@/app/Components/Login/Login";
import SignUp from "@/app/Components/Login/SignUp";
import Welcome from "@/app/Components/Login/Welcome";
import WelcomeBack from "@/app/Components/Login/WelcomeBack";
import Loader from "@/app/Components/Loader/loader";
import { useContext } from "react";
import { AuthAnimationContext } from "@/app/Context/contextProvider";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
function page() {
  const {data:session}=useSession();
  const router =useRouter();
  useEffect(()=>{
    if(session){
      router.push('./Profile')
    }
    
  },[session])
 useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };


  handleResize();

  window.addEventListener('resize', handleResize); 
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const [isMobile, setIsMobile] = useState(false);
  const [rendered,setRendered]=useState(false)
  const [authAnimation, setAuthAnimation] = useContext(AuthAnimationContext);
  const [delay, setDelay] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelay(authAnimation ? true : false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [authAnimation]);

  const animationForm = useSpring({
    from: { transform: "translateX(0%)" }, // Initial state
    to: { transform: authAnimation ? "translateX(0%)" : "translateX(110%)" },
    config: { duration: 1000 },
  });
const animationForm2= useSpring({
    from: { transform: "translateY(0%)" }, // Initial state
    to: { transform: authAnimation ? "translateY(0%)" : "translateY(40%)" },
    config: { duration: 1000 },
  });

  const welcomeBack = useSpring({
    from: { transform: "translateX(30px)" }, 
    to: { transform: authAnimation ? "translateX(30px)" : "translateX(380px)" },
    config: { duration: 1200 },
  });
const welcomeBack2 = useSpring({
    from: { transform: "translateY(30px)" }, 
    to: { transform: authAnimation ? "translateY(30px)" : "translateY(380px)" },
    config: { duration: 1200 },
  });
  const welcome = useSpring({
    from: { transform: "translateX(-9px)" },
    to: { transform: authAnimation ? "translateX(-9px)" : "translateX(400px)" },
    config: { duration: 1200 },
  });
   const welcome2 = useSpring({
    from: { transform: "translateY(-9px)" },
    to: { transform: authAnimation ? "translateY(-9px)" : "translateY(400px)" },
    config: { duration: 1200 },
  });
  const slider = useSpring({
    from: { transform: "translateX(0px)" },
    to: {
      transform: authAnimation ? "translateX(0px)" : "translateX(-1000px)",
    },
    config: { duration: 2400 },
  });
   const slider2 = useSpring({
    from: { transform: "translateY(440px)" },
    to: {
      transform: authAnimation ? "translateY(440px)" : "translateY(-820px)",
    },
    config: { duration: 2400 },
  });
  const cross = useSpring({
    from: { val: 0 },
    to: { val:!delay ? 1 : 0 },
    config: { duration: 1200 },
  });
 
 useEffect(() => {
  setTimeout(() => {
    setRendered(true)
  }, 2000);
 }, [])
if(!rendered){
  return(
<Loader/>
  )
}else return (
    <div className="w-screen h-screen flex border-0  justify-center items-center bg-[#f443361c] ">
      <div className="relative flex flex-col md:flex-row w-full h-full md:w-[750px] md:h-[520px]  md:rounded-3xl bg-white shadow-2xl shadow-[#afabab] overflow-hidden">
        <animated.div style={isMobile?welcome2:welcome} className="absolute bottom-[-55px] md:bottom-[56px] md:left-[370px] z-1">
          <Welcome />
        </animated.div>
        <animated.div style={isMobile?animationForm2:animationForm} className="absolute left-0 ">
          {delay ? <Login /> : <SignUp />}
        </animated.div>
        <animated.div
          style={isMobile?welcomeBack2:welcomeBack}
          className="absolute md:left-[-400px] md:top-0 top-[-520px] z-1"
        >
          <WelcomeBack />
        </animated.div>
        <animated.div
      style={isMobile ? slider2 : slider}
          className="slider absolute md:h-full w-full h-[1000px] md:w-[1000px]   md:left-[360px] rounded-[50px] md:rounded-[150px] bg-[#f44336]"
        ></animated.div>
        <animated.div onClick={()=>router.push('./')}  style={{
        color: cross.val.to({
          range: [0, 1],
          output: ['#ff1a1a', '#ffff'], 
        }),
      }} className=" absolute top-2 left-2 w-2 h-2 cursor-pointer z-1 "><Ban/></animated.div>
      </div>
    </div>
  );
}

export default page;
