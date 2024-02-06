import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { Alert, Box, Grid } from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingButton from "../Button/LoadingButton";
import FormikTextField from "../Formik/FormikTextField";

const SignupUser = ({ phoneNumber }) => {
  const [error, getError] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOTP] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPop, setErrorPop] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().label("First Name").required(),
    last_name: Yup.string().label("Last Name").required(),
    email: Yup.string().label("Email").required(),
  });

  const generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    const newOTP = generateRandomOTP();
    const otp = newOTP.toString();
    setOTP(otp);

    if (!otpSent) {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYmZkN2M0NS1jOWZjLTRkNGItYTE1MS0zZjg3NGFhNzJhZjYiLCJ1bmlxdWVfbmFtZSI6ImFzbWl0YXBhdGVsLmFwZ3NvdEBnbWFpbC5jb20iLCJuYW1laWQiOiJhc21pdGFwYXRlbC5hcGdzb3RAZ21haWwuY29tIiwiZW1haWwiOiJhc21pdGFwYXRlbC5hcGdzb3RAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMTIvMTYvMjAyMyAxMjo1NjozOSIsImRiX25hbWUiOiIyMDM2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.dZhwhzMkSKVgEilr2wC6mTrPldFeMRCgO1dqRZFFk0o"; // Replace with your actual bearer token

      try {
        const response = await axios.post(
          "https://live-server-2036.wati.io/api/v1/sendTemplateMessage?whatsappNumber=" +
            phoneNumber,
          {
            template_name: "login_otp",
            broadcast_name: "login_otp",
            parameters: [
              {
                name: "reason",
                value: "login",
              },
              {
                name: "otp",
                value: otp,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getError(false);
        setOtpSent(true);
        setErrorPop(false);
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:");
      }
    } else {
      const validate = values.otp === otpValid;
      const isoDate = new Date().toISOString();

      if (validate) {
        try {
          await axios
            .post(`https://test-strapi.rytt.com/api/free-leads`, {
              data: {
                Name: values.first_name + " " + values.last_name,
                Email_id: values.email,
                Source: "Sign Up",
                Mobile_Number: phoneNumber,
                Date: isoDate,
              },
            })
            .then(function (responseCase) {
              console.log("Response:", responseCase);
              // const stringifiedData = JSON.stringify(responseCase.data);

              // localStorage.setItem("user_student", stringifiedData);
              // navigate("/home");
            });
        } catch (error) {
          console.log(error);
        }

        console.log("Login");
      } else {
        setErrorOtp(true);
      }

      console.log(validate);
    }
  };

  return (
    <>
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, isSubmitting, values }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <FormikTextField
                    name="first_name"
                    label="First Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormikTextField
                    name="last_name"
                    label="Last Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField name="email" label="Email Id" fullWidth />
                </Grid>
                {otpSent && (
                  <Grid item xs={12}>
                    <FormikTextField
                      type="number"
                      label="Enter OTP"
                      name="otp"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <LoadingButton
                    startIcon={
                      !otpSent ? <SmsOutlinedIcon /> : <FingerprintIcon />
                    }
                    color="primary"
                    variant="contained"
                    fullWidth
                    isLoading={isSubmitting}
                    btnText={!otpSent ? "Send Otp" : "Verify"}
                    loadingText={!otpSent ? "Sending Otp" : "Verifying"}
                    size="large"
                    type="submit"
                  />
                </Grid>{" "}
                <Grid item xs={12}>
                  {errorPop && (
                    <Alert severity="error">
                      Please Enter a Valid Phone Number
                    </Alert>
                  )}
                  {errorOtp && (
                    <Alert severity="error">Please Enter a Valid OTP</Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default SignupUser;
