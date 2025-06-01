function Footer() {
    return (
      <div className="fixed z-50 bottom-0 w-full bg-gray-800 font-montserrat space-x-2   h-8 flex items-center justify-start text-white text-sm">
        <span className="ml-6 font-bold text-md text-gray-400">Copyright © TinyURL LLC </span>
        <span className="ml-6 font-bold text-lg text-gray-400"> . </span>
        <a href="/" className="mx-2 font-bold text-md underline text-gray-400">Terms</a>
        <span className="ml-6 font-bold text-lg text-gray-400"> . </span>
        <a href="/" className="mx-2  text-md font-bold underline text-gray-400">Privacy Policy</a>
        <span className="ml-6 font-bold text-lg text-gray-400"> . </span>
        <a href="/" className="mx-2 text-md underline font-bold text-gray-400">Accessibility</a>
      </div>
    );
  }
  
  export default Footer;
  