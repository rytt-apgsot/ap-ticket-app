import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useField } from "formik";
import * as React from "react";

export function FormikDateTimeField({
  name,
  label,
  fullWidth,
  required,
  helperText,
  ...props
}) {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={dayjs(value)}
        onChange={(newValue) => {
          setValue(dayjs(newValue).toISOString());
        }}
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
