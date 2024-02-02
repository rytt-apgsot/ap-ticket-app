import { TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";

import React from "react";

function FormikTextField({
  name,
  label,
  maxLength,
  convertToUppercase = false,
  type = "text",
  disabled = false,
  ...props
}) {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });
  const { handleBlur } = useFormikContext();

  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    if (convertToUppercase) {
      inputValue = inputValue.toUpperCase();
    }

    // Limit the input to maxLength characters
    if (maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    // Update the field value
    setValue(inputValue);
  };

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value || ""}
      // onChange={(e) => {
      //   if (type === "file") {
      //     setValue(e.currentTarget.files[0]);
      //   } else setValue(e.target.value);
      // }}
      onChange={handleInputChange}
      onBlur={handleBlur}
      error={error && touched}
      disabled={disabled}
      variant="outlined"
      size="small"
      {...props}
      helperText={(error && touched && error) || props.helperText}
    />
  );
}
export default FormikTextField;
