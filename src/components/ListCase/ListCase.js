import {
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ChatDetail from "./ChatDetail";

const ListCase = () => {
  const [listCase, setListCase] = useState();
  const [loading, setLoading] = useState(true);
  const storedData = localStorage.getItem("user_student");
  const userData = JSON.parse(storedData);

  const getData = () => {
    try {
      axios
        .get(
          `https://strapi.rytt.com/api/cases?populate=*&filters[lead][id][$eq]=${userData?.[0]?.id}&sort=createdAt:desc`
        )
        .then(function (response) {
          setListCase(response?.data?.data);
          setLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Box mt={3}>
        <Typography variant="h6">Lists Case</Typography>

        {loading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          listCase?.map((data, index) => (
            <Card
              key={index}
              sx={{ padding: "15px", marginTop: "20px", boxShadow: "none" }}
            >
              <Grid container sx={{ alignItems: "center" }}>
                <Grid item xs={1}>
                  Case {index + 1}
                </Grid>
                <Grid item xs={8}>
                  {data.attributes.Subject}
                </Grid>
                <Grid item xs={2}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {moment(data.attributes.createdAt).fromNow()}
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
                  <ChatDetail data={data.id} />
                </Grid>
              </Grid>
            </Card>
          ))
        )}
      </Box>
    </>
  );
};

export default ListCase;
