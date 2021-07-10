import React from "react";

function InputComponent({
  type,
  allCheck,
  onChange,
  value,
  className,
  disabled,
  name,
}) {
  return (
    <input
      type={type}
      checked={allCheck}
      onChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
      className={className}
    />
  );
}

export default InputComponent;
