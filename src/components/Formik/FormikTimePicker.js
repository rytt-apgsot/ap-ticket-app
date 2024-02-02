import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useField } from "formik";
import React from "react";
// import "react-phone-input-material-ui/lib/style.css";

const FormikTimePicker = ({
  name,
  label,
  type = "text",
  defaultCountry,
  ...props
}) => {
  const [, { value, error, touched }, { setValue, setTouched }] = useField({
    name,
    label,
  });
  // const { handleBlur } = useFormikContext()

  const dateObject = new Date(value);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          variant="outlined"
          name={name}
          id="time-picker-inline"
          label={label}
          value={dateObject}
          inputVariant="outlined"
          onChange={(value) => {
            setValue(value);
          }}
          onBlur={() => {
            setTouched(true);
          }}
          helperText={error && touched && error}
          error={error && touched}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
          size="small"
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          ampm={false}
          {...props}
        />
      </LocalizationProvider>
    </>
  );
};

export default FormikTimePicker;
