import React from "react";

const Button = ({ children, onclick, className, disabled }) => {
  return (
    <button
      className={`border-[2px] rounded-md px-2 py-1 border-black font-bold ${className} hover:bg-black hover:text-white transition-all duration-200`}
      onClick={onclick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
