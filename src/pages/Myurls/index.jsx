import React, { useEffect, useState } from 'react';
import Leftbar from '@/components/myurlpagecompon/Leftbar';
import Topbar from '@/components/myurlpagecompon/Topbar';
import DashboardContent from '@/components/myurlpagecompon/DashboardContent';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';

function Myurls() {
  const { openleftbar } = useSelector(state => state.allCart);
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If we're authenticated but don't have user data, fetch it
        if (isAuthenticated && !user) {
          await dispatch(fetchUserProfile()).unwrap();
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // If fetching the profile fails, it likely means the token is invalid
        if (typeof window !== 'undefined') {
          router.push('/?login=true&error=session_expired');
        }
      } finally {
        // Always mark auth as checked when we're done
        setAuthChecked(true);
      }
    };
    
    // Start the auth check process
    checkAuth();
    
    // If we already know the user is not authenticated, redirect immediately
    if (!loading && !isAuthenticated && typeof window !== 'undefined') {
      router.push('/?login=true');
    }
  }, [dispatch, isAuthenticated, user, router, loading]);

  // Show loading indicator while checking auth or if explicitly loading
  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authenticated, show the dashboard
  return isAuthenticated ? (
    <div className="flex">
      <Leftbar />
      <Topbar />
      <DashboardContent />
    </div>
  ) : null; // This shouldn't render as we redirect
}

export default Myurls;
