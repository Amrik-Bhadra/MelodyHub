import React, { useEffect, useRef, useState } from "react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import FormBtn from "../../components/form_components/FormBtn";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../utils/validator/useAxios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(90); // 1 min 30 sec = 90 sec
  const [showResend, setShowResend] = useState(false);
  const intervalRef = useRef(null);
  const { setAuth } = useAuth();
  const axiosInstance = useAxios();

  // Handle OTP input change
  const handleChange = (index, value) => {
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);
  };

  // Start countdown timer on mount
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(intervalRef.current);
          setShowResend(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Format timer as mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, "0");
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otp = otpInputs.join("");
    if (otp.length !== 5) {
      toast.error("Please enter all 5 digits of the OTP.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/verifyotp", { otp });
      toast.success(`${response.data.message} ✅`);

      if (response.data.task === "login") {
        const { token, user } = response.data;
        const role = user.role;
        setAuth({ token, user });

        if (role === "admin") {
          navigate("/admin");
        } else if(role === "instructor") {
          navigate("/instructor");
        }else{
          navigate("/student");
        }
      }else{
        navigate('/auth/resetpassword');
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = () => {
    // Add your resend OTP API call here if needed
    setTimer(90);
    setShowResend(false);

    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(intervalRef.current);
          setShowResend(true);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-between px-8 mt-2">
        <span>{/* Logo placeholder */}</span>
        {/* <a href="/auth/login" className="text-link underline font-medium">
          Create Account
        </a> */}
      </div>

      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1">
          <div className="h-12 w-12 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5">
            <MdOutlineVerifiedUser className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Verify OTP</h1>
          <p className="text-sm text-center font-light text-secondary-txt">
            We have sent a 5 digit verification code to your email
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
          <div className="flex justify-between gap-2">
            {otpInputs.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                className="border border-[#e0e0e0] rounded-md h-16 w-16 text-center text-xl outline-none"
                onInput={(e) => {
                  const input = e.target;
                  const value = input.value.replace(/[^0-9]/g, "");
                  handleChange(index, value);
                  if (value && input.nextElementSibling) {
                    input.nextElementSibling.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !otpInputs[index] &&
                    e.target.previousElementSibling
                  ) {
                    e.target.previousElementSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          {!showResend && (
            <p className="text-sm text-right text-primary-txt font-regular">
              {formatTime(timer)}
            </p>
          )}

          <div className="flex flex-col gap-6 w-full">
            <FormBtn btnText="Verify OTP" type="submit" />

            <p className="text-sm text-center text-primary-txt font-light">
              Didn't receive the OTP?
              {showResend ? (
                <button
                  type="button"
                  className="text-link font-medium ml-1"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-400 ml-1">Please wait...</span>
              )}
            </p>

            <button
              type="button"
              className="border hover:bg-[#f5f5f5] text-primary-txt px-4 py-2 rounded-md flex gap-2 items-center justify-center"
              onClick={() => {
                navigate("/auth/login");
              }}
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

export default VerifyOTP;
