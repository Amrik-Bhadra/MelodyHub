import { useState } from "react";
import { toast } from "react-hot-toast";
import InputFieldComponent from "../../components/form_components/InputFieldComponent";
import PasswordFieldComponent from "../../components/form_components/PasswordFieldComponent";
import FormBtn from "../../components/form_components/FormBtn";
import { MdEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { HiUserAdd } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../utils/validator/useAxios";
import DropdownComponent from "../../components/form_components/DropdownComponent";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const axiosInstance = useAxios();

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'student', label: 'Student' },
    { value: 'instructor', label: 'Instructor' },
  ];

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(!name){
        toast.error("Name field not filled!");
        return;
    }

    if(!email){
        toast.error("Email field not filled!");
        return;
    }

    if(!role){
        toast.error("Role field not filled!");
        return;
    }

    if(!password){
        toast.error("Password field not filled!");
        return;
    }

    try {
      const response = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        role,
        password,
      });

      if (response.status === 200) {
        toast.success(response?.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed! Try again.");
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
            <HiUserAdd className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to MelodyHub</h1>
          <p className="text-center text-sm font-light text-secondary-txt">
            Join our family, to begin your musical journey
          </p>
        </header>
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <InputFieldComponent
            label="Name"
            type="text"
            name="name"
            id="name"
            placeholder="Enter your Name"
            icon={IoPerson}
            value={name}
            onChange={setName}
            required={true}
          />
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

          <DropdownComponent
            label="Select Your Role"
            name="role"
            options={roleOptions}
            selectedValue={role}
            onChange={setRole}
            required={true}
            placeholder="Choose a role"
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

          <FormBtn btnText="Register" type="submit" />

          <p className="text-sm text-center text-primary-txt font-light">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-link font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegistrationForm;
