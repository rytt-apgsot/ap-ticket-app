import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText"; // Import FormHelperText
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useField, useFormikContext } from "formik";
import React from "react";

const FormikRadioGroup = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleChange = (event) => {
    setFieldValue(name, event.target.value);
    setFieldTouched(name, true);
  };

  const { error, touched } = meta; // Extract error and touched from meta

  return (
    <FormControl size="small">
      <FormLabel size="small">{label}</FormLabel>
      <RadioGroup
        row
        size="small"
        name={name}
        value={field.value}
        onChange={handleChange}
        {...props}
      >
        {props.options.map((option) => (
          <FormControlLabel
            size="small"
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {error && touched && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikRadioGroup;
