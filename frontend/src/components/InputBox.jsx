import React from "react";

export const InputBox = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="mb-4 text-left">
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[#1E1E1E] text-[#E0E0E0] border border-gray-600 rounded-md placeholder-gray-500"
      />
    </div>
  );
};
