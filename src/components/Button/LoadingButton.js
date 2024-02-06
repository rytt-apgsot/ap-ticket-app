import { Button, CircularProgress, Grid } from "@mui/material";
import React from "react";

export default function LoadingButton({
  isLoading,
  btnText,
  loadingText,
  children,
  disabled,
  color,
  ...props
}) {
  return (
    <Button
      sx={{
        boxShadow: "none",
        ":hover": { boxShadow: "none" },
      }}
      {...props}
      disabled={isLoading || disabled}
      color={color}
    >
      {isLoading ? (
        <Grid container alignItems="center" justifyContent="center">
          {loadingText}{" "}
          <CircularProgress
            color="primary"
            size={16}
            style={{ marginLeft: "1rem" }}
          />
        </Grid>
      ) : (
        children || btnText
      )}
    </Button>
  );
}
