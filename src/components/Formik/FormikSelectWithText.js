import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";
import React, { useEffect, useState } from "react";
import FormikTextField from "./FormikTextField";

const FormikSelectWithText = ({
  name,
  label,
  options,
  fullWidth,
  shrink,
  helperText,
  ...props
}) => {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });
  const [showTextField, setShowTextField] = useState(false);

  useEffect(() => {
    setShowTextField(!options?.map((x) => x.code).includes(value));
  }, []);

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
        value={!options?.map((x) => x.code).includes(value) ? "other" : value}
        label={label}
        onChange={(e) => {
          if (e.target.value === "other") {
            setShowTextField(true);
            setValue("");
          } else {
            setShowTextField(false);
            setValue(e.target.value);
          }
        }}
        labelId={"label-select-" + name}
        id={"select-" + name}
        displayEmpty
        notched={shrink}
        {...props}
      >
        {options?.map((option) => (
          <MenuItem value={option.code} key={option.code}>
            {option.name}
          </MenuItem>
        ))}
        <MenuItem value="other" key={"other"}>
          Other (Enter manually)
        </MenuItem>
      </Select>

      {showTextField ? (
        <Box mt={2}>
          <FormikTextField
            name={name}
            label={`Enter ${label}`}
            helperText={helperText}
            fullWidth
          />
        </Box>
      ) : error && touched ? (
        <FormHelperText>{error}</FormHelperText>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
export default FormikSelectWithText;
