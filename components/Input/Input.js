import React from "react";

const Input = ({ onChange, className, placeholder }) => {
  return (
    <input
      className={`border-2 rounded-md px-4 py-2 ${className}`}
      onChange={onchange}
      placeholder={placeholder}
    />
  );
};

export default Input;
