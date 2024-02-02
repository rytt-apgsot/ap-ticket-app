import { Button, CircularProgress, Grid } from "@mui/material";
import React from "react";

export default function LoadingButton({
  isLoading,
  btnText,
  loadingText,
  children,
  disabled,
  ...props
}) {
  return (
    <Button {...props} disabled={isLoading || disabled}>
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
