import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import { useField } from "formik";
import React from "react";

const FormikSelectNew = ({
  name,
  label,
  children,
  fullWidth,
  shrink,
  ...props
}) => {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });

  return (
    <FormControl
      size="small"
      variant="outlined"
      error={error && touched}
      fullWidth={fullWidth}
    >
      <InputLabel id={"label-select-" + name} shrink={shrink}>
        {label}
      </InputLabel>
      <Select
        name={name}
        value={value}
        label={label}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        labelId={"label-select-" + name}
        id={"select-" + name}
        displayEmpty
        notched={shrink}
        {...props}
      >
        {children}
      </Select>
      {error && touched && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export default FormikSelectNew;
