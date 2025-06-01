import { useState, useEffect } from "react";

export default function LoadingToTick() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simulate loading completion
    }, 3000); // 3 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="relative flex items-center justify-center w-10 h-10">
        {loading ? (
          <div className="relative w-10 h-10">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className={`absolute left-4 top-4 w-2 h-2 bg-green-600 rounded-full animate-circle-rotate`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  transformOrigin: "10px 10px",
                }}
              ></span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <p className="text-green-600 font-montserrat text-md">Verifying...</p>
      ) : (
        <p className="text-green-600 font-montserrat text-md">Success!</p>
      )}
    </div>
  );
}
