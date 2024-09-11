// import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import Swal from "sweetalert2";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const loginUser = async (e) => {
    e.preventDefault(); 
    if (form.username === "" || form.password === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'To login, please enter your username and password.',
      });
      return;
    }
  
    try {
      let response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      let data = await response.json();
  
      if (response.status === 200) {
        const decodedToken = jwtDecode(data.access);
        localStorage.setItem("user", JSON.stringify(decodedToken));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.detail || 'There was an issue with your login credentials.',
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({ 
        icon: 'error',
        title: 'Network Error',
        text: 'There was an error connecting to the server. Please check your internet connection.',
      });
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen  items-center place-items-center">
        <div className="flex justify-center">
        <video
        className="mx-auto video-responsive"
        src={require("../assets/STOCKMANAGER.mp4")}
        alt="Your Company Video"
        autoPlay
        loop
        muted
        style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
        >
        <source src={require("../assets/STOCKMANAGER.mp4")} type="video/mp4" media="(min-width: 720px)" />
      </video> 
        </div>
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/logo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Signin to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or
              <span
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                start your 14-day free trial
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={loginUser}>
            {/* <input type="hidden" name="remember" defaultValue="true" /> */}
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Username"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  to={'/forgot-password'}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={loginUser}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  /> */}
                </span>
                Sign in
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Don't Have an Account, Please{" "}
                  <Link to="/register"> Register now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
