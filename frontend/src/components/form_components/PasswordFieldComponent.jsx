import React, {useState} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const PasswordFieldComponent = ({
  label,
  name,
  id,
  placeholder,
  icon: Icon,
  error,
  value,
  onChange,
  required,
  className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`
        flex items-center border p-2 rounded-md
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${error ? 'focus-within:border-red-500' : 'focus-within:border-sky'}
        transition-all duration-200
      `}>
        <Icon className="h-5 w-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`
            w-full outline-none border-none bg-transparent
            ${Icon ? 'pl-3' : 'pl-0'}
            transition-all duration-200
            text-md placeholder:text-sm
            ${className}
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5" />
          ) : (
            <FaEye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordFieldComponent;
