import React from "react";
import { useAuth } from "../context/authContext";

const Login = () => {
  const { user, login } = useAuth();

  const handleLogin = async () => {
    console.log("handleLogin");
    await login("test1@test.com", "test1234");

    if (user) {
      console.log("Logged in successfully", user);
    } else {
      console.log("Login failed");
    }
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogin}
    >
      Click
    </button>
    // <div className="grid lg:grid-cols-2 grow">
    //   <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1">
    //     <div className="card max-w-[390px] w-full">
    //       <form className="card-body flex flex-col gap-5 p-10" noValidate>
    //         <div className="text-center mb-2.5">
    //           <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
    //             Sign in
    //           </h3>
    //           <div className="flex items-center justify-center font-medium">
    //             <span className="text-2sm text-gray-600 me-1.5">
    //               Need an account?
    //             </span>
    //             <a
    //               className="text-2sm link"
    //               href="/metronic/tailwind/react/demo1/auth/signup"
    //             >
    //               Sign up
    //             </a>
    //           </div>
    //         </div>
    //         <div className="grid grid-cols-2 gap-2.5">
    //           <a href="#" className="btn btn-light btn-sm justify-center">
    //             <img
    //               src="/metronic/tailwind/react/demo1/media/brand-logos/google.svg"
    //               className="size-3.5 shrink-0"
    //               alt="Google Logo"
    //             />
    //             Use Google
    //           </a>
    //           <a href="#" className="btn btn-light btn-sm justify-center">
    //             <img
    //               src="/metronic/tailwind/react/demo1/media/brand-logos/apple-black.svg"
    //               className="size-3.5 shrink-0 dark:hidden"
    //               alt="Apple Black Logo"
    //             />
    //             <img
    //               src="/metronic/tailwind/react/demo1/media/brand-logos/apple-white.svg"
    //               className="size-3.5 shrink-0 light:hidden"
    //               alt="Apple White Logo"
    //             />
    //             Use Apple
    //           </a>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <span className="border-t border-gray-200 w-full" />
    //           <span className="text-2xs text-gray-500 font-medium uppercase">
    //             Or
    //           </span>
    //           <span className="border-t border-gray-200 w-full" />
    //         </div>
    //         <div
    //           className="flex items-center gap-2.5 border rounded-md p-3 border-primary-clarity bg-primary-light text-primary"
    //           role="alert"
    //         >
    //           <i
    //             aria-label="information-2"
    //             className="ki-solid ki-information-2 text-lg leading-0 text-primary"
    //           />
    //           <div className="text-gray-700 text-sm">
    //             Use{" "}
    //             <span className="font-semibold text-gray-900">
    //               demo@keenthemes.com
    //             </span>{" "}
    //             username and{" "}
    //             <span className="font-semibold text-gray-900">demo1234</span>{" "}
    //             password.
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <label className="form-label text-gray-900" htmlFor="email">
    //             Email
    //           </label>
    //           <input
    //             id="email"
    //             placeholder="Enter username"
    //             autoComplete="off"
    //             name="email"
    //             className="form-control"
    //             defaultValue="demo@keenthemes.com"
    //           />
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="flex items-center justify-between gap-1">
    //             <label className="form-label text-gray-900" htmlFor="password">
    //               Password
    //             </label>
    //             <a
    //               className="text-2sm link shrink-0"
    //               href="/metronic/tailwind/react/demo1/auth/reset-password"
    //             >
    //               Forgot Password?
    //             </a>
    //           </div>
    //           <div className="relative">
    //             <input
    //               id="password"
    //               type="password"
    //               placeholder="Enter Password"
    //               autoComplete="off"
    //               name="password"
    //               className="form-control"
    //               defaultValue="demo1234"
    //             />
    //             <button
    //               type="button"
    //               className="btn btn-icon absolute right-3 top-1/2 transform -translate-y-1/2"
    //             >
    //               <i className="ki-filled ki-eye text-gray-500" />
    //               <i className="ki-filled ki-eye-slash text-gray-500 hidden" />
    //             </button>
    //           </div>
    //         </div>
    //         <label className="checkbox-group">
    //           <input
    //             className="checkbox checkbox-sm"
    //             type="checkbox"
    //             name="remember"
    //             defaultValue="false"
    //           />
    //           <span className="checkbox-label">Remember me</span>
    //         </label>
    //         <button
    //           type="submit"
    //           className="btn btn-primary flex justify-center grow"
    //         >
    //           Sign In
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    //   <div className="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-1 lg:order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
    //     <div className="flex flex-col p-8 lg:p-16 gap-4">
    //       <a href="/metronic/tailwind/react/demo1">
    //         <img
    //           src="/metronic/tailwind/react/demo1/media/app/mini-logo.svg"
    //           className="h-[28px] max-w-none"
    //           alt="Mini Logo"
    //         />
    //       </a>
    //       <div className="flex flex-col gap-3">
    //         <h3 className="text-2xl font-semibold text-gray-900">
    //           Secure Access Portal
    //         </h3>
    //         <div className="text-base font-medium text-gray-600">
    //           A robust authentication gateway ensuring
    //           <br />
    //           secure{" "}
    //           <span className="text-gray-900 font-semibold">
    //             efficient user access
    //           </span>{" "}
    //           to the Metronic
    //           <br />
    //           Dashboard interface.
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Login;
