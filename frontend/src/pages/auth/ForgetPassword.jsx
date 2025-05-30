import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputFieldComponent from "../../components/form_components/InputFieldComponent";
import FormBtn from "../../components/form_components/FormBtn";
import { MdEmail } from "react-icons/md";
import { IoFingerPrintSharp } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const axiosInstance = useAxios();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/forgotpassword", {
        email,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/verifyotp");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-between px-8 mt-2">
        {/* <span>
            <img src={images.logo} alt="logo" className="w-32" />
        </span> */}
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1">
          <div className="h-12 w-12 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <IoFingerPrintSharp className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Forget Password?</h1>
          <p className="text-sm text-center font-light text-secondary-txt">
            Enter the email address associated with your account and we will
            send you a verification code to reset your password.
          </p>
        </header>
        <form className="flex flex-col gap-8">
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

          <div className="flex flex-col gap-3 w-full">
            <FormBtn btnText="Send OTP" onClick={handleSendOTP} />

            <button
              className="border hover:bg-[#f5f5f5] text-primary-txt px-4 py-2 rounded-md flex gap-2 items-center justify-center"
              onClick={() => navigate("/auth/login")}
            >
              <IoMdArrowBack className="h-5 w-5" />
              <span className="text-sm font-medium font-body">
                Back to Login
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
