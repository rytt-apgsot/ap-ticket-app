import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useField } from "formik";
import moment from "moment";
import React from "react";

function FormikDateField({
  name,
  label,
  fullWidth,
  dateFormat = "YYYY-MM-DD",
  required,
  helperText,
  ...props
}) {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        onChange={(value) => {
          setValue(moment(value).format(dateFormat));
        }}
        value={moment(value, dateFormat)}
        format="DD/MM/YYYY"
        size="small"
        {...props}
        slotProps={{
          textField: {
            required,
            size: "small",
            helperText: error && touched ? error : helperText,
            error: error && touched,
            variant: "outlined",
            fullWidth,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default FormikDateField;
