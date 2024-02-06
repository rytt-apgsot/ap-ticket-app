import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { Alert, Box, Grid } from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingButton from "../Button/LoadingButton";
import FormikNewPhoneNumber from "../Formik/FormikNewPhoneNumber";
import FormikTextField from "../Formik/FormikTextField";

const LoginUser = ({ onChildErrorPop }) => {
  const [error, getError] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOTP] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPop, setErrorPop] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleFormData = (secondary, numericValue) => {
    // Your logic for handling form data
    console.log("Secondary:", secondary);
    console.log("Numeric Value:", numericValue);
    setPhoneNumber(secondary + numericValue);
  };

  useEffect(() => {
    onChildErrorPop({ errorPop: errorPop, phoneNumber: phoneNumber });
  }, [errorPop]);

  const initialValues = {
    phone: "",
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string().label("Phone Number").required(),
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
            phoneNumber
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
      setErrorPop(true);
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
        console.log("Enrollment data not found.");
        getError(true);
      }
    } else {
      const validate = values.otp === otpValid;

      if (validate) {
        const stringifiedData = JSON.stringify(enrollmentData);

        localStorage.setItem("user_student", stringifiedData);
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
                  <FormikNewPhoneNumber
                    label={"Mobile Number"}
                    name="phone"
                    onFormData={handleFormData}
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

export default LoginUser;
