import { Box, Grid, TextField, Typography } from "@mui/material";
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

    const maxLength = 10;

    if (numericValue.length <= maxLength) {
      // Add a hyphen after every 5 digits
      const formattedValue = numericValue;
      return formattedValue;
    }

    return numericValue.slice(0, maxLength);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Box sx={{ position: "absolute", width: "5.5%" }}>
            <ReactFlagsSelect
              selected={selected}
              onSelect={(code) => setSelected(code)}
              showSecondaryOptionLabel={true}
              showSelectedLabel={false}
              showOptionLabel={false}
              size="small"
              customLabels={contry}
              className="custom-flags-select"
            />
          </Box>
        </Grid>
        <Grid item xs={9}>
          <TextField
            name={name}
            label={label}
            type={type}
            fullWidth
            value={value || ""}
            onChange={(e) => {
              const numericValue = formatPhoneNumber(e.target.value);
              setValue(numericValue);
              onFormData(foundCode.secondary, numericValue.replace("-", "")); // Remove hyphen before passing to onFormData
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
