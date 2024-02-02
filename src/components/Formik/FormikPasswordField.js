import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";

function FormikPasswordField({ name, label, ...props }) {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });
  const { handleBlur } = useFormikContext();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    // Update the field value
    setValue(e.target.value);
  };

  return (
    <FormControl
      size="small"
      fullWidth
      variant="outlined"
      helperText={(error && touched && error) || props.helperText}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        type={showPassword ? "text" : "password"}
        value={value || ""}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={error && touched}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      <Typography
        variant="subtitle1"
        sx={{ color: "red", fontSize: "12px", ml: "15px" }}
      >
        {(error && touched && error) || props.helperText}
      </Typography>
    </FormControl>
  );
}

export default FormikPasswordField;
