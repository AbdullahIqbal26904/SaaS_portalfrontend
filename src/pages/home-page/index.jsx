import { useEffect } from "react";
import Homecomponent from "@/components/Hero/Homecomponent";
import Navbar from "../../components/Navbarcomponent/Navbar";
import { useSelector, useDispatch } from "react-redux";
import Slider from "@/components/Slider/Slider";
import Main from "@/components/Main/Main";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/router";
import { setopenSlider } from "@/redux/slices/urlslice";

const Home = () => {
  const { loading, openSlider } = useSelector((state) => state.allCart);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle URL parameters for login/register
  useEffect(() => {
    // Check if login parameter is present and open login slider
    if (router.query.login === 'true') {
      dispatch(setopenSlider(true));
      
      // If there's an error message, set it in the Redux store
      if (router.query.error === 'session_expired') {
        // You could dispatch an action to show a notification here
        console.warn('Session expired. Please login again.');
        
        // Alternatively, show a toast message or alert
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            alert('Your session has expired. Please login again.');
          }, 500);
        }
      }
    }
  }, [router.query, dispatch]);

  // Handle body scrolling
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
