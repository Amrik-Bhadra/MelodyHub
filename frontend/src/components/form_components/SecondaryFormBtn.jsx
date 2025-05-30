import React from "react";

const SecondaryFormBtn = ({ btnText, onClick }) => {
  return (
    <button className="w-full bg-[#f9f9f9] hover:bg-[#eee] text-primary-txt px-4 py-2 rounded-md" onClick={onClick}>
      {btnText}
    </button>
  );
};

export default SecondaryFormBtn;
