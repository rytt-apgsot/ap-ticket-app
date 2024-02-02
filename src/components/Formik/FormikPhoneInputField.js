import { useField } from "formik";
import { MuiTelInput } from "mui-tel-input";
import React from "react";

function FormikPhoneInputField({ name, label, type = "text", ...props }) {
  const [, { value, error, touched }, { setValue }] = useField({
    name,
    label,
  });

  return (
    <>
      <MuiTelInput
        name={name}
        label={label}
        error={error && touched}
        helperText={error && touched && error}
        value={value || "+91"}
        size="small"
        onChange={(value) => {
          setValue(value);
        }}
        {...props}
      />
    </>
  );
}
export default FormikPhoneInputField;
