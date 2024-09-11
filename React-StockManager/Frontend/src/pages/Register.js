import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    bio: "",
    profile_picture: null,
  });

  console.log("form data: ", form);

  const navigate = useNavigate();

  // Handling Input change for registration form.
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register User
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      console.log(JSON.stringify(form));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      let data = await response.json();
      console.log("API response data: ", data);
      alert("Successfully Registered, Now Login with your details");
      navigate("/login");
    } catch (error) {
      console.log("Error occurred:", error);
      alert("An error occurred. Please check the console for details. ", error);

    }
  };
  
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "stockmanager-profilepictures");

    await fetch("https://api.cloudinary.com/v1_1/dyeiuox51/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...form, profile_picture: data.url });
        alert("Image Successfully Uploaded");
      })
      .catch((error) => console.log(error));
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      uploadImage(file);
    }
  };
  return (
    
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen  items-center place-items-center">
        <div className="w-full max-w-md space-y-8  p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/logo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={registerUser}>
            {/* <input type="hidden" name="remember" defaultValue="true"  /> */}
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="first_name"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleInputChange}
                />
                <input
                  name="last_name"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={form.username}
                onChange={handleInputChange}
              />
            </div>
              <div>
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
              <div>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm password"
                value={form.password2}
                onChange={handleInputChange}
              />
            </div>
              <div>
                <input
                  name="bio"
                  type="text"
                  //autoComplete=""
                  //required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Describe yourself"
                  value={form.bio}
                  onChange={handleInputChange}
                />
              </div>
              {/*<UploadImage uploadImage={uploadImage} />*/}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked
                  required
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I Agree Terms & Conditons
                </label>
              </div>

              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={registerUser}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    /> */}
                </span>
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already Have an Account, Please
                  <Link to="/login"> Signin now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
        <div className="flex justify-center order-first sm:order-last">
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
      </div>
    
  );
}

export default Register;
