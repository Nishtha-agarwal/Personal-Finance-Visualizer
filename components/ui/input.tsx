// components/ui/input.tsx
import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 border rounded-md"
    />
  );
};
