

function Navbarcomp2() {
    return (
        <div>
            <button className="absolute right-[625px] top-[20px] w-10 h-10 bg-[#087da8] text-white rounded-full flex items-center justify-center group">
                <span className="text-3xl">?</span>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs py-1 px-2 rounded-md mt-2 transition-opacity duration-300">
                    Help
                </span>
            </button>
        </div>
    )
}

export default Navbarcomp2