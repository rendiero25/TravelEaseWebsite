import HeaderForWhiteBg from "../components/HeaderForWhiteBg.jsx";

const Login = () => {
    return (
        <div className="m-0 p-0 box-border font-primary">
            <HeaderForWhiteBg />

            <div className="mt-20 flex flex-col justify-center items-center px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 py-2">
                <form className="w-full flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="username" className="">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            // value={}
                            // onChange={}
                            placeholder="Username"
                            required
                            className="border-1 border-gray w-full p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label htmlFor="password" className="">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            // value={}
                            // onChange={}
                            placeholder="Password"
                            required
                            className="border-1 border-gray w-full p-2"
                        />
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Login;