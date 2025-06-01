import LoadingToTick from "../Loader/LoadingToTick"

function Main() {
    return (
        <div className="absolute top-[130px]  w-full grid grid-cols-1 md:grid-cols-2 z-20">
            <div className="flex justify-center ">
                <div className="bg-[#F8F8F8] flex flex-col p-6 rounded-2xl shadow-lg sm:w-[400px] md:w-[500px] max-w-[90%] h-[468px] ">
                    <div className="flex justify-start items-center mb-6 w-[100%] ">
                        <img className="h-8 w-8 mx-3  object-cover" src="/images/favicon-128.png" alt="" />
                        <h2 className="text-base antialiased font-bold text-xl font-montserrat">Shorten a long URL</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter long link here"
                        className="w-full font-medium p-4 border font-montserrat rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mb-8">
                        <label className="block text-lg font-montserrat font-medium mb-2">Customize your link</label>
                        <div className="flex items-center space-x-2">
                            <select
                                className="p-2 border h-14 font-montserrat font-medium rounded-lg w-full  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>tinyurl.com</option>
                                <option>bit.ly</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Enter alias"
                                className="flex-1 h-14 p-2 border font-montserrat rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="ml-[50px] flex w-[80%] h-[220px] left-20 border-2 items-center justify-between mb-10">
                        <div className="ml-5">
                            <LoadingToTick />
                        </div>
                        <div className="flex flex-col justify-end items-center mr-5">
                            {/* Cloudflare logo */}
                            <img
                                src="data:image/png;base64,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"
                                alt="Cloudflare Logo"
                                className="w-16"
                            />
                            {/* Terms and Conditions */}
                            <span className="text-sm text-gray-600">
                                Terms and Conditions
                            </span>
                        </div>

                    </div>


                    <button className="w-full bg-green-600 text-white py-3 font-montserrat rounded-lg hover:bg-green-700">
                        Shorten URL
                    </button>
                </div>
            </div>
            <div className=" h-full flex justify-center items-center">
                <div className="w-[80%] h-[80%]  ">

                </div>
            </div>
        </div>

    )
}

export default Main