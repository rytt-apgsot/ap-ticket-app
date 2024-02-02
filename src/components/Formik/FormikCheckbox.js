import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { useField } from "formik";
import React from "react";

const FormikCheckbox = ({ name, label, fullWidth, ...props }) => {
  const [{ onBlur }, { value, error, touched }, { setValue }] = useField({
    name,
    label,
  });

  return (
    <FormControl
      size="small"
      variant="outlined"
      error={error && touched}
      fullWidth={fullWidth}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              // onBlur={onBlur}
              checked={!!value}
              onChange={(e) => {
                setValue(e.target.checked);
              }}
            />
          }
          label={label}
        />
      </FormGroup>

      {error && touched && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export default FormikCheckbox;
