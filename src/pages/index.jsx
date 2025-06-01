import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This is a simple redirect page that sends users to the home-page
export default function IndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if there are any query parameters to forward
    const query = router.query;
    const queryString = Object.keys(query).length > 0 
      ? `?${new URLSearchParams(query).toString()}` 
      : '';
      
    router.replace(`/home-page${queryString}`);
  }, [router]);
  
  // Show a simple loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
