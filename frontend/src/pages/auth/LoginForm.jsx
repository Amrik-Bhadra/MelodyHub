import { useState } from "react";
import { toast } from "react-hot-toast";
import InputFieldComponent from "../../components/form_components/InputFieldComponent";
import PasswordFieldComponent from "../../components/form_components/PasswordFieldComponent";
import FormBtn from "../../components/form_components/FormBtn";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserLock } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../utils/validator/useAxios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const axiosInstance = useAxios();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(
        email ? "Password field not filled!" : "Password field not filled"
      );
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        { email, password },
      );

      if (response.status === 200) {
        toast.success(response?.data.message);
        navigate("/auth/verifyotp");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed! Try again.");
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-start px-8 mt-2">
        <span>
          {/* <img src={images.logo} alt="logo" className="w-32" /> */}
        </span>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <FaUserLock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Hi, Welcome Back</h1>
          <p className="text-center text-sm font-light text-secondary-txt">
            Enter your credentials to access your account
          </p>
        </header>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <InputFieldComponent
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            icon={MdEmail}
            value={email}
            onChange={setEmail}
            required={true}
          />

          <PasswordFieldComponent
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
            icon={RiLockPasswordFill}
            value={password}
            onChange={setPassword}
            required={true}
          />

          <div className="flex justify-between items-center gap-3">
            {/* Remember Me Checkbox */}
            <label className="flex items-center text-sm text-primary-txt cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-primary-btn cursor-pointer"
                id="rememberMe"
              />
              Remember Me
            </label>

            {/* Forgot Password Link */}
            <div>
              <Link
                to="/auth/forgotpassword"
                className="w-full text-sm text-link font-semibold "
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <FormBtn btnText="Login" type="submit" />

          <p className="text-sm text-center text-primary-txt font-light">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-link font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
