import { useEffect,useState } from "react";
import Navbarcomp from "@/components/Navbarcomponent/Navbarcomp";
import Navbarcomp2 from "@/components/Navbarcomponent/Navbarcomp2";
import Navbarcom3 from "@/components/Navbarcomponent/Navbarcom3";
import ResponsiveNavbar from "@/components/Navbarcomponent/ResponsiveNavbar";
const Navbar = () => {
    const [isMobile, setisMobile] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 920) {
                setisMobile(true);
            } else {
                setisMobile(false);
            }
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);
    return (
        <div className="fixed w-full h-[80px] bg-[#031f39] z-50">
            <img className="absolute" src="/images/topleft.svg" alt="" />
            {
                isMobile ? <ResponsiveNavbar /> :
                    <div className="hidden md:block">
                        <Navbarcom3 />
                        <Navbarcomp2 />
                        <Navbarcomp />
                    </div>
            }
        </div>
    );
};

export default Navbar;
