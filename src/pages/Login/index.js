import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import asmitapatellogo from "../../assets/asmitapatel.png";
import LoginUser from "../../components/LoginDetail/LoginUser";

const Login = () => {
  return (
    <>
      <Box sx={{ background: "#00f381" }}>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          height="100vh"
        >
          <Grid item xl={2} lg={3} md={6} xs={12}>
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
                    Log In
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Enter Phone Number
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <LoginUser />
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
