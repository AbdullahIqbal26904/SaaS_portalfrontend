function Plan({ whichplan }) {
  if (whichplan === "pro") {
    return (
      <div className="relative flex flex-col justify-center  p-7 border border-gray-200 shadow-lg max-w-sm h-[500px] mx-auto">
        <h2 className="text-2xl font-semibold font-montserrat text-gray-800 mb-2">Pro</h2>
        <div className="text-4xl font-bold text-gray-900 mb-1 font-montserrat">$9.99</div>
        <div className="text-sm text-gray-500 mb-4 font-montserrat">( $119.88 / yr )</div>
        <div className="w-full font-montserrat flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>500</span>
          <span>50K+</span>
        </div>
        <div className="w-full font-montserrat bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 font-montserrat rounded-full w-1/5"></div>
        </div>
        <p className="text-sm font-montserrat font-medium text-gray-800 mb-4">
          500 Links with Unlimited Trackable Clicks
        </p>
        <ul className="text-sm font-montserrat text-gray-700 space-y-2 mb-6">
          <li>• Link Analytics</li>
          <li>• Advanced Link Management</li>
          <li>• Shorten URLs Using Branded Domains</li>
          <li>• Link Editing & Deletion</li>
          <li>• Custom Link Expiration Dates</li>
        </ul>
        <p className="text-sm font-montserrat text-gray-600 mb-6">
          Enjoy 500 links with unlimited clicks and track up to 9.5K clicks on 9.5K additional links.
        </p>
        <button className="absolute bottom-4 w-[90%] py-2 font-montserrat px-4 bg-green-600 text-white font-semibold rounded-sm shadow-md hover:bg-green-500 transition-all">
          Sign Up
        </button>
      </div>
    );
  } else if (whichplan === "bulk") {
    return (
      <div className="relative flex flex-col justify-center  p-7 border border-gray-200 shadow-lg h-[500px] max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold font-montserrat text-gray-800 mb-2">Bulk 100K</h2>
        <div className="text-4xl font-bold text-gray-900 mb-1 font-montserrat">$99.99</div>
        <div className="text-sm text-gray-500 mb-4 font-montserrat">( $1,188.00 / yr )</div>
        <div className="w-full font-montserrat flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>100K</span>
          <span>5M+</span>
        </div>
        <div className="w-full font-montserrat bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 font-montserrat rounded-full w-1/5"></div>
        </div>
        <p className="text-sm font-montserrat font-medium text-gray-800 mb-4">
          Our bulk plan for users who need to generate a ton of short-term, branded links to support their marketing or operations.
        </p>

        <p className="text-sm font-montserrat text-gray-600 mb-6">
          Enjoy all Pro features, 90-day default link expiration, and track up to 100K clicks across 100K branded short links.
        </p>
        <button className="absolute bottom-4 w-[90%] py-2 font-montserrat px-4 bg-green-600 text-white font-semibold rounded-sm shadow-md hover:bg-green-500 transition-all">
          Sign Up
        </button>
      </div>
    );
  }
  else {
    return (
      <div className="relative flex flex-col justify-center  p-7 border border-gray-200 h-[500px] shadow-lg max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold font-montserrat text-gray-800 mb-2">Pro</h2>
        <div className="text-4xl font-bold text-gray-900 mb-1 font-montserrat">$9.99</div>
        <div className="text-sm text-gray-500 mb-4 font-montserrat">( $119.88 / yr )</div>
        <div className="w-full font-montserrat flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>500</span>
          <span>50K+</span>
        </div>
        <div className="w-full font-montserrat bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 font-montserrat rounded-full w-1/5"></div>
        </div>
        <p className="text-sm font-montserrat font-medium text-gray-800 mb-4">
          500 Links with Unlimited Trackable Clicks
        </p>
        <ul className="text-sm font-montserrat text-gray-700 space-y-2 mb-6">
          <li>• Link Analytics</li>
          <li>• Advanced Link Management</li>
          <li>• Shorten URLs Using Branded Domains</li>
          <li>• Link Editing & Deletion</li>
          <li>• Custom Link Expiration Dates</li>
        </ul>
        <p className="text-sm font-montserrat text-gray-600 mb-6">
          Enjoy 500 links with unlimited clicks and track up to 9.5K clicks on 9.5K additional links.
        </p>
        <button className="absolute bottom-4 w-[90%] py-2 font-montserrat px-4 bg-green-600 text-white font-semibold rounded-sm shadow-md hover:bg-green-500 transition-all">
          Sign Up
        </button>
      </div>
    );
  }
}
export default Plan;
