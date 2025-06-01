import { useEffect } from "react";
import Homecomponent from "@/components/Hero/Homecomponent";
import Navbar from "../../components/Navbarcomponent/Navbar";
import { useSelector } from "react-redux";
import Slider from "@/components/Slider/Slider";
import Main from "@/components/Main/Main";
import Footer from "@/components/footer/Footer";
const Home = () => {
  const { loading, openSlider } = useSelector((state) => state.allCart);

  useEffect(() => {
    if (openSlider) {
      document.body.classList.add("overflow-hidden"); // Disable scrolling
    } else {
      document.body.classList.remove("overflow-hidden"); // Enable scrolling
    }
  }, [openSlider]);

  return (
    <div className="relative">
      <Navbar />
      <Main />
      <Slider openSlider={openSlider} />

      {/* Blur overlay when openSlider is true */}
      {openSlider && (
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-20"></div>
      )}

      {/* Background Content */}
      <div className="scroll-smooth bg-[#031f39] h-[1020px] relative z-10">
        <Homecomponent />
        
      </div>
      <Footer />
    </div>
  );
};

export default Home;
