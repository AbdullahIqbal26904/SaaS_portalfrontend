import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/redux/app/store";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Check if login parameter is present in URL and open login slider
    if (router.query.login === 'true' && typeof window !== 'undefined') {
      // You could dispatch an action to open the login slider here
      // For now, we'll just log it
      console.log('Login requested via URL parameter');
    }
    
    // Try to fetch user profile if we have a token
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      store.dispatch(fetchUserProfile()).catch(err => {
        console.error('Error fetching user profile:', err);
      });
    }
  }, [router.query]);
  
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
