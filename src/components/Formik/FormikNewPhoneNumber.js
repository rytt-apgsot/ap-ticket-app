import { Grid, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import contry from "../authentication/contry";

function FormikNewPhoneNumber({
  name,
  label,
  onFormData,
  type = "text",
  ...props
}) {
  const [, { value, error, touched }, { setValue }] = useField({ name, label });
  const { handleBlur } = useFormikContext();
  const [selected, setSelected] = useState("IN");

  const foundCode = contry[selected];

  const formatPhoneNumber = (input) => {
    const numericValue = input.replace(/[^0-9]/g, "");
    if (numericValue.length <= 10) {
      const formattedValue = numericValue.replace(/(\d{5})(\d{1,5})/, "$1-$2");
      return formattedValue;
    }
    return numericValue.slice(0, 10); // Limit to 10 digits
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ReactFlagsSelect
            searchable
            selected={selected}
            onSelect={(code) => setSelected(code)}
            showSecondaryOptionLabel={true}
            showSelectedLabel={false}
            showOptionLabel={false}
            size="small"
            customLabels={contry}
            className="custom-flags-select"
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            name={name}
            label={label}
            type={type}
            value={value || ""}
            onChange={(e) => {
              if (type === "file") {
                setValue(e.currentTarget.files[0]);
              } else {
                const numericValue = formatPhoneNumber(e.target.value);
                if (numericValue.length <= 11) {
                  setValue(numericValue);
                }
                onFormData(foundCode.secondary, numericValue);
              }
            }}
            onBlur={handleBlur}
            error={error && touched}
            variant="outlined"
            size="small"
            inputProps={{
              pattern: "[0-9]*",
              maxLength: 12,
            }}
            {...props}
          />
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ color: "red", fontSize: "12px" }}>
        {(error && touched && error) || props.helperText}
      </Typography>
    </>
  );
}
export default FormikNewPhoneNumber;
