import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setopenSlider, setshowloader, setsliderData } from "@/redux/slices/urlslice";
import { loginUser, registerUser } from "@/redux/slices/authSlice";
import { SocialIcon } from 'react-social-icons'
function Slider() {
  const { openSlider, loading, sliderData } = useSelector(state => state.allCart);
  const [animate, setAnimate] = useState(false);
  const dispatch = useDispatch();
  
  // Move all hook declarations to the top level
  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerData, setRegisterData] = useState({ 
    full_name: '', 
    email: '', 
    password: '',
    reseller_id: null,
    department_name: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResellerRegistration, setIsResellerRegistration] = useState(false);
  
  const { error: authError } = useSelector(state => state.auth);

  function handleClick(e) {
    e.preventDefault();
    dispatch(setopenSlider(false));
  }
  
  // Handle login form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  // Handle registration form input changes
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
    
    // When updating full_name for reseller registration, also update department_name 
    // if it hasn't been manually edited
    if (name === 'full_name' && isResellerRegistration) {
      if (registerData.department_name === '' || registerData.department_name.includes('Department')) {
        setRegisterData(prev => ({
          ...prev,
          [name]: value,
          department_name: `${value}'s Department`
        }));
      }
    }
  };
  
  // Handle login submission
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setLoginError('Email and password are required');
      return;
    }
    
    try {
      setIsLoggingIn(true);
      setLoginError('');
      
      console.log('Attempting login with:', loginData);
      
      // Dispatch login action
      const result = await dispatch(loginUser(loginData)).unwrap();
      console.log('Login successful:', result);
      
      // Close slider and redirect to dashboard on success
      dispatch(setopenSlider(false));
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/Myurls';
      }, 500);
    } catch (error) {
      console.error('Login error details:', error);
      
      // Provide more specific error messages based on the error
      if (error?.detail) {
        setLoginError(error.detail);
      } else if (error?.non_field_errors) {
        setLoginError(error.non_field_errors.join('. '));
      } else if (error?.message) {
        setLoginError(error.message);
      } else {
        setLoginError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Handle registration submission
  const handleRegister = async () => {
    if (!registerData.full_name || !registerData.email || !registerData.password) {
      setRegisterError('All fields are required');
      return;
    }
    
    // For reseller registration, department_name is required
    if (isResellerRegistration && !registerData.department_name) {
      setRegisterError('Department name is required for reseller registration');
      return;
    }
    
    try {
      setIsRegistering(true);
      setRegisterError('');
      
      // Prepare data based on registration type
      const registrationData = {
        full_name: registerData.full_name,
        email: registerData.email,
        password: registerData.password
      };
      
      // Add reseller_id and department_name for reseller registration
      if (isResellerRegistration && registerData.reseller_id) {
        registrationData.reseller_id = registerData.reseller_id;
        registrationData.department_name = registerData.department_name;
      }
      
      console.log('Attempting registration with:', registrationData);
      const result = await dispatch(registerUser(registrationData)).unwrap();
      console.log('Registration successful:', result);
      
      // For reseller customers, redirect to dashboard directly
      if (isResellerRegistration) {
        setTimeout(() => {
          window.location.href = '/Myurls';
        }, 500);
      } else {
        // For direct customers, switch to login form
        setTimeout(() => {
          signinkholo(); // Switch to login form
        }, 500);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages based on the error
      if (error?.detail) {
        setRegisterError(error.detail);
      } else if (error?.non_field_errors) {
        setRegisterError(error.non_field_errors.join('. '));
      } else if (error?.message) {
        setRegisterError(error.message);
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };
  
  useEffect(() => {
    if (openSlider) {
      setTimeout(() => setAnimate(true), 10); // Small delay for animation
    } else {
      setAnimate(false);
    }
  }, [openSlider]);
  
  // Check for reseller ID in the URL when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const resellerId = params.get('reseller_id');
      const companyName = params.get('company_name') || '';
      
      if (resellerId) {
        setIsResellerRegistration(true);
        setRegisterData(prev => ({
          ...prev,
          reseller_id: resellerId,
          department_name: `${companyName ? companyName + ' ' : ''}Department`
        }));
        
        if (sliderData !== "Sign Up") {
          // Open the signup slider with a small delay
          setTimeout(() => {
            signupkholo();
          }, 300);
        }
      }
    }
  }, []);
  function signupkholo() {
    dispatch(setopenSlider(false)); // Close the slider first
    dispatch(setsliderData("Sign Up"));

    // Add a small delay before opening the slider to allow transition effect
    setTimeout(() => {
      dispatch(setopenSlider(true));
    }, 300); // Adjust the delay time as needed (300ms is a good starting point)
  }
  function signinkholo() {
    dispatch(setopenSlider(false)); // Close the slider first
    dispatch(setsliderData("Sign In"));

    // Add a small delay before opening the slider to allow transition effect
    setTimeout(() => {
      dispatch(setopenSlider(true));
    }, 300); // Adjust the delay time as needed (300ms is a good starting point)
  }

  if (sliderData === "My URLs") {
    return (
      <div
        className={`fixed top-0 right-0 w-full sm:w-[44%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Cross Button */}
        <div className="flex items-center justify-between w-full px-4">
          <p className="font-Montserrat font-bold text-2xl mt-4 flex-grow text-left">Your Recent TinyURLs</p>
          <div
            onClick={(e) => handleClick(e)}
            className="w-10 mt-5 h-10 flex items-center justify-center cursor-pointer bg-gray-700 text-gray-300 rounded-md hover:text-white text-2xl"
          >
            ✖
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-gray-300 w-full mt-10" />
      </div>
    );
  } else if (sliderData === "Sign Up") {
    return (
      <div
        className={`fixed top-0 right-0 w-full sm:w-[35%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Cross Button */}
        <div className="flex items-center justify-end w-full px-4">
          <div
            onClick={(e) => handleClick(e)}
            className="w-10 mt-5 h-10 flex items-center justify-center cursor-pointer bg-gray-700 text-gray-300 rounded-md hover:text-white text-2xl"
          >
            ✖
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-gray-300 w-full mt-5" />

        {/* Sign Up Form */}
        <div className="w-full h-full mt-5 flex flex-col items-center justify-start">
          <p className="font-bungee text-[#087da8] font-medium text-3xl">Tiny URLs</p>
          <p className="text-gray-600">Welcome to TinyURL</p>

          {/* Display register error if any */}
          {registerError && (
            <div className="w-[80%] mt-3 p-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
              {registerError}
            </div>
          )}
          
          {/* Display loading indicator during registration */}
          {isRegistering && !registerError && (
            <div className="w-[80%] mt-3 p-2 bg-green-100 text-green-700 border border-green-300 rounded text-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing registration...
            </div>
          )}
          
          {/* Input Fields */}
          <form 
            className="w-full flex flex-col items-center" 
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            {isResellerRegistration && (
              <div className="w-[80%] mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                You are registering through a partner portal. Your account will be managed by your organization's administrator.
              </div>
            )}
            
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={registerData.full_name}
              onChange={handleRegisterInputChange}
              className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterInputChange}
              className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleRegisterInputChange}
              className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              autoComplete="new-password"
            />
            
            {isResellerRegistration && (
              <input
                type="text"
                name="department_name"
                placeholder="Department Name"
                value={registerData.department_name}
                onChange={handleRegisterInputChange}
                className="w-[80%] mt-5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              />
            )}

          {/* Agreement Text */}
          <p className="w-[80%] mt-5 text-center text-s text-gray-900">
            By clicking on <span className="font-semibold">“Create Account”</span>, I agree to the
            <span className="text-[#087da8] cursor-pointer"> Terms of Service</span>,
            <span className="text-[#087da8] cursor-pointer"> Privacy Policy</span>, and
            <span className="text-[#087da8] cursor-pointer"> Use of Cookies</span>.
          </p>

          {/* Create Account Button */}
          <button 
            type="submit" 
            className="w-[80%] mt-5 p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : "Create Account"}
          </button>
          </form>

          {/* Already a user? Log In */}
          <p className="mt-4 text-s text-gray-600">
            Already a user? <span onClick={signinkholo} className="text-[#087da8] font-semibold cursor-pointer">Log In</span>
          </p>

          {/* Or register via */}
          <p className="mt-6 text-gray-600 text-sm">Or register via:</p>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-3">
            <div className="rounded-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://facebook.com" />
            </div>
            <div className="rounded-full flex items-center justify-center bg-gray-200  cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://github.com" />
            </div>
            <div className=" rounded-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://www.google.com" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  else if (sliderData === "Sign In") {
    // No useState hooks or handlers here - they're at the top level now

    return (
      <div
        className={`fixed top-0 right-0 w-full sm:w-[35%] h-full bg-white z-50 transform transition-transform duration-500 ${animate ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Cross Button */}
        <div className="flex items-center justify-end w-full px-4">
          <div
            onClick={(e) => handleClick(e)}
            className="w-10 mt-5 h-10 flex items-center justify-center cursor-pointer bg-gray-700 text-gray-300 rounded-md hover:text-white text-2xl"
          >
            ✖
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-gray-300 w-full mt-5" />

        {/* Sign In Form */}
        <div className="w-full h-full mt-5 flex flex-col items-center justify-start">
          <p className="font-bungee text-[#087da8] font-medium text-3xl">Tiny URLs</p>
          <p className="text-gray-600">Welcome to TinyURL</p>

          {/* Display login error if any */}
          {loginError && (
            <div className="w-[80%] mt-3 p-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
              {loginError}
            </div>
          )}
          
          {/* Display success message when logging in successfully */}
          {isLoggingIn && !loginError && (
            <div className="w-[80%] mt-3 p-2 bg-green-100 text-green-700 border border-green-300 rounded text-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </div>
          )}

          {/* Input Fields - Wrap in form for better accessibility */}
          <form 
            className="w-full flex flex-col items-center" 
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginInputChange}
              className="w-[80%] mt-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.getElementById('password-input').focus();
                }
              }}
              autoComplete="email"
            />
            <input
              id="password-input"
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              className="w-[80%] mt-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              autoComplete="current-password"
            />

          {/* Agreement Text */}
          <div className="flex items-center justify-between w-[80%] mt-7">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="hidden peer" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
                <svg className="hidden w-4 h-4 text-white peer-checked:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Remember Me</span>
            </label>
            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-[80%] mt-8 p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center"
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : "Sign In"}
          </button>
          </form>

          {/* Already a user? Log In */}
          <p className="mt-4 text-s text-gray-600">
            Don't have an account? <span onClick={signupkholo} className="text-[#087da8] font-semibold cursor-pointer">Sign Up</span>
          </p>

          {/* Or register via */}
          <p className="mt-6 text-gray-600 text-sm">Or login via:</p>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-3">
            <div className="rounded-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://facebook.com" />
            </div>
            <div className="rounded-full flex items-center justify-center bg-gray-200  cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://github.com" />
            </div>
            <div className=" rounded-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300">
              <SocialIcon url="https://www.google.com" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return;
  }
}

export default Slider;