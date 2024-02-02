import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";
import React from "react";

const FormikSelect = ({
  name,
  label,
  options,
  fullWidth,
  shrink,
  required,
  helperText,
  ...props
}) => {
  const [{ onBlur }, { value, error, touched }, { setValue, setTouched }] =
    useField({
      name,
      label,
    });
  // useEffect(() => {
  //   return setTouched(false);
  // }, []);

  return (
    <FormControl
      size="small"
      variant="outlined"
      error={error && touched}
      fullWidth={fullWidth}
      required={required}
    >
      <InputLabel id={"label-select-" + name} shrink={shrink}>
        {label}
        {/* {required && <sup>*</sup>} */}
      </InputLabel>
      <Select
        name={name}
        value={value || ""}
        label={label}
        onChange={(e) => {
          setValue(e.target.value);
          // setTouched(true);
        }}
        onBlur={onBlur}
        labelId={"label-select-" + name}
        id={"select-" + name}
        displayEmpty
        notched={shrink}
        // required={required}
        {...props}
      >
        {options?.map((option) => (
          <MenuItem value={option.code} key={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {error && touched ? (
        <FormHelperText>{error}</FormHelperText>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
export default FormikSelect;
