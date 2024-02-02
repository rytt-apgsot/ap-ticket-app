import {
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";

const FormikEndPointTextFields = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, handleBlur } = useFormikContext();

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
  };

  const { error, touched } = meta;

  return (
    <FormControl
      size="small"
      {...props}
      error={meta.touched && Boolean(meta.error)}
    >
      <OutlinedInput
        {...field}
        id={`outlined-adornment-${name}`}
        onChange={handleChange}
        onBlur={handleBlur}
        endAdornment={<InputAdornment position="end">% {label}</InputAdornment>}
        aria-describedby={`outlined-${name}-helper-text`}
        inputProps={{
          "aria-label": name,
        }}
      />
      {/* <FormHelperText id={`outlined-${name}-helper-text`}>
        {meta.touched && meta.error ? meta.error : label}
      </FormHelperText> */}
      {error && touched && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikEndPointTextFields;
