import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useState } from "react";
import aplogo from "../../assets/aplogo.png";
import asmitapatellogo from "../../assets/asmitapatel.png";
import LoginUser from "../../components/LoginDetail/LoginUser";
import SignupUser from "../../components/LoginDetail/SignupUser";

const Login = () => {
  const [errorPop, setErrorPop] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();

  const handleChildErrorPop = ({ errorPop, phoneNumber }) => {
    setErrorPop(errorPop);
    setPhoneNumber(phoneNumber);
  };

  return (
    <>
      <Box sx={{ background: "#26dd8026" }}>
        <Box>
          <img
            alt="Logo"
            src={aplogo}
            height={60}
            width={60}
            style={{
              objectFit: "contain",
              position: "absolute",
              top: "20px",
              left: "20px",
            }}
          />
        </Box>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          height="100vh"
        >
          <Grid item xl={3} lg={3} md={6} xs={12}>
            <Card>
              <CardContent>
                <Box>
                  <img
                    alt="Logo"
                    src={asmitapatellogo}
                    height={50}
                    width={120}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box mt={2}>
                  <Typography variant="h6" sx={{ fontWeight: "500" }}>
                    Log In/Sign Up
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Please verify your number to get started
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  {!errorPop && (
                    <LoginUser onChildErrorPop={handleChildErrorPop} />
                  )}

                  {errorPop && <SignupUser phoneNumber={phoneNumber} />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Login;
