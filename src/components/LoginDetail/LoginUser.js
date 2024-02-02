import { Alert, Box, Grid } from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingButton from "../Button/LoadingButton";
import FormikPhoneFieldCode from "../Formik/FormikPhoneFieldCode";
import FormikTextField from "../Formik/FormikTextField";

const LoginUser = () => {
  const [error, getError] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOTP] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    phone: "",
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string().label("User Id").required(),
  });

  const checkPhoneNumberExits = async ({ values }) => {
    const filtersPhone = [
      "mobile_number",
      "alternate_mobile_number",
      "latest_mobile_number",
      "manual_mobile_number",
      "final_mobile_number",
      "revised_latest_mobile_number",
      "mobile_number_4",
      "mobile_number_5",
    ];

    try {
      // Create an array of promises for each field
      const promises = filtersPhone.map((field) =>
        axios.get(
          `https://test-strapi.rytt.com/api/leads?filters[${field}][$eq]=${encodeURIComponent(
            values.phone
          )}`
        )
      );

      // Use Promise.all to wait for all promises to resolve
      const responses = await Promise.all(promises);

      // Iterate through responses to find the first non-empty one
      for (const response of responses) {
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const enrollmentData = response.data.data;
          console.log("Enrollment Data:", enrollmentData);
          return enrollmentData;
        }
      }

      console.log("Phone number not found in any field.");
      return null;
    } catch (error) {
      console.error("Error while checking phone number:", error);
      getError(true);
      return null;
    }
  };

  const generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    const newOTP = generateRandomOTP();
    const otp = newOTP.toString();
    setOTP(otp);

    const enrollmentData = await checkPhoneNumberExits({ values });

    console.log(enrollmentData);

    if (!otpSent) {
      if (enrollmentData.length > 0) {
        console.log("Enrollment data found:", enrollmentData);

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYmZkN2M0NS1jOWZjLTRkNGItYTE1MS0zZjg3NGFhNzJhZjYiLCJ1bmlxdWVfbmFtZSI6ImFzbWl0YXBhdGVsLmFwZ3NvdEBnbWFpbC5jb20iLCJuYW1laWQiOiJhc21pdGFwYXRlbC5hcGdzb3RAZ21haWwuY29tIiwiZW1haWwiOiJhc21pdGFwYXRlbC5hcGdzb3RAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMTIvMTYvMjAyMyAxMjo1NjozOSIsImRiX25hbWUiOiIyMDM2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.dZhwhzMkSKVgEilr2wC6mTrPldFeMRCgO1dqRZFFk0o"; // Replace with your actual bearer token

        try {
          const response = await axios.post(
            "https://live-server-2036.wati.io/api/v1/sendTemplateMessages",
            {
              template_name: "login_otp",
              broadcast_name: "login_otp",
              receivers: [
                {
                  whatsappNumber: values.phone,
                  customParams: [
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
          console.log("Response:", response.data);
        } catch (error) {
          console.error("Error:");
        }
      } else {
        console.log("Enrollment data not found.");
        getError(true);
      }
    } else {
      const validate = values.otp === otpValid;

      if (validate) {
        const stringifiedData = JSON.stringify(enrollmentData);

        localStorage.setItem("user", stringifiedData);
        navigate("/home");

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
                <Grid item xs={12}>
                  <FormikPhoneFieldCode
                    type="number"
                    label={"Mobile Number"}
                    name="phone"
                  />
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
                    color="primary"
                    variant="contained"
                    type="submit"
                    isLoading={isSubmitting}
                    btnText={!otpSent ? "Send Otp" : "Verify"}
                    loadingText={!otpSent ? "Sending Otp" : "Verifying"}
                  />
                </Grid>{" "}
                <Grid item xs={12}>
                  {error && (
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
export default LoginUser;
