import {
  Box,
  FormControl,
  FormHelperText,
  Icon,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useField } from "formik";
import React, { useEffect, useState } from "react";

function FormikImagePicker({
  name,
  label,
  helperText,
  type = "text",
  ...props
}) {
  const [, { value, error, touched }, { setValue, setTouched }] = useField({
    name,
    label,
  });

  const theme = useTheme();

  const [preview, setPreview] = useState(null);

  const htmlId = `image-picker-file-${name}`;

  useEffect(() => {
    if (value) {
      setPreview(value.data);
      setTouched(true);
    }
  }, [value]);

  return (
    <FormControl error={error && touched} fullWidth>
      <label htmlFor={htmlId}>
        <FormHelperText>{label}</FormHelperText>
        <Box
          sx={{
            border: `1px solid ${
              error && touched ? theme.palette.error.main : grey[800]
            }`,
            borderRadius: 2,
            mt: 1,
            height: 150,
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.1s ease",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            "&:hover": {
              bgcolor: alpha(grey[400], 0.1),
            },
          }}
        >
          {preview ? (
            <img src={preview} styles={{ width: "100%" }} />
          ) : (
            <Icon sx={{ fontSize: "40px !important", mb: 2 }}>image</Icon>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor:
                error && touched
                  ? alpha(theme.palette.error.light, 0.3)
                  : preview
                  ? alpha("#0000", 0.7)
                  : alpha(grey[800], 0.7),
              overflow: "hidden",
              p: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {!preview ? "Click to select image" : "Click to change image"}
            </Typography>
          </Box>
        </Box>

        <input
          id={htmlId}
          type="file"
          onChange={async (e) => {
            const inputFile = e.target.files[0];
            if (inputFile)
              setValue({
                name: inputFile.name,
                data: await toBase64(inputFile),
              });
          }}
          accept="image/*"
          style={{ display: "none" }}
        />
      </label>
      {error && touched ? (
        <FormHelperText>{error}</FormHelperText>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
export default FormikImagePicker;
