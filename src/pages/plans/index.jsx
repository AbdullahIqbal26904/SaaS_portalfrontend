import Navbar from "../../components/Navbarcomponent/Navbar";
import { useState } from "react";
import Plan from "@/components/subscription/Plan";
export default function Plans() {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = ["pro", "bulk", "enterprise"];
  return (
    <div>
      <Navbar />

      <div className="relative flex items-center justify-center bg-[#f5f5f5]">
        <div className="absolute w-[80%] h-[580px] top-[100px] ">
          <h1 className="mt-6 ml-10 font-bold font-montserrat text-black text-4xl">TinyURL Plans</h1>
          <h2 className="mt-4 ml-10 font-medium font-montserrat text-black text-2xl">Find a Plan that meets your needs</h2>
          <div className="mt-4 flex ml-10 items-center space-x-3 text-lg font-medium">
            <span className="text-gray-600 font-montserrat">Billing cycle: </span>
            <span className={`${isAnnual ? "font-montserrat text-gray-400" : "font-montserrat text-black"}`}>Monthly</span>
            <button
              className={`cursor-pointer relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-all duration-300 ${isAnnual ? "bg-blue-600" : ""
                }`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${isAnnual ? "translate-x-6" : ""
                  }`}
              ></div>
            </button>
            <span className={`${isAnnual ? "text-black font-montserrat" : "font-montserrat text-gray-400"}`}>Annual</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center mt-[20rem]">
          {
            plans.map((plan, index) => (
              <Plan key={index} whichplan={plan} />
            ))
          }
        </div>

      </div>

    </div>
  );
}
