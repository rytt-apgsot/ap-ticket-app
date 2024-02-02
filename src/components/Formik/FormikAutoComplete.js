import { Autocomplete, TextField } from "@mui/material";
import { useField } from "formik";
import React from "react";

const FormikAutoComplete = ({
  name,
  label,
  fullWidth,
  shrink,
  options,
  helperText,
  required,
  ...props
}) => {
  const [{ onBlur }, { value, error, touched }, { setValue, setTouched }] =
    useField({
      name,
      label,
    });

  return (
    <>
      <Autocomplete
        disablePortal
        size="small"
        onBlur={onBlur}
        fullWidth={fullWidth}
        id={"label-select-" + name}
        name={name}
        value={value}
        blurOnSelect="touch"
        onChange={(event, newValue) => {
          setValue(newValue);
          setTouched(true);
        }}
        notched={shrink}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={error && touched}
            helperText={(error && touched && error) || props.helperText}
            onBlur={onBlur}
          />
        )}
        {...props}
      />
    </>
  );
};
export default FormikAutoComplete;
