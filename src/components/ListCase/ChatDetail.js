import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { Formik } from "formik";
import moment from "moment";
import * as React from "react";
import * as Yup from "yup";
import FormikTextField from "../Formik/FormikTextField";

export default function ChatDetail({ data }) {
  const [listChat, setListChat] = React.useState();
  const [selectedImageId, setSelectedImageId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const initialValues = {
    message: "",
  };

  const validationSchema = Yup.object().shape({
    message: Yup.string().label("Message").required(),
  });

  const handleOpen = (id) => {
    setSelectedImageId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedImageId(null);
    setOpen(false);
  };
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const getData = () => {
    try {
      axios
        .get(
          `https://strapi.rytt.com/api/chat-finals?populate=*,messages.media_file,lead,users_permissions_user,case&filters[case][id][$eq]=${data}`
        )
        .then(function (response) {
          setListChat(response?.data?.data);
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

  React.useEffect(() => {
    getData();
    const intervalId = setInterval(getData, 5000); // 5 sec
    return () => clearInterval(intervalId);
  }, [data]);

  const modifiedArray = listChat?.[0]?.attributes?.messages?.map((item) => ({
    ...item,
    media_file:
      item.media_file?.data?.map((file) => ({
        id: file.id,
      })) || [],
  }));

  const onSubmit = async (values, { resetForm }) => {
    const now = new Date();
    const isoString = now.toISOString();

    axios.put(
      `https://strapi.rytt.com.rytt.com/api/chat-finals/${listChat[0]?.id}`,
      {
        data: {
          messages: [
            ...modifiedArray,
            {
              messages: values.message,
              lead: listChat[0].attributes.lead.data.attributes.name,
              timestamp: isoString,
            },
          ],
        },
      }
    );
    resetForm();
  };

  const list = (
    <Box
      sx={{
        width: 450,
        padding: 2,
        backgroundColor: "#f5f5f5",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chat Header */}
      <Card sx={{ boxShadow: "none", marginBottom: 2 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "red" }}>A</Avatar>}
          title="AP Team"
        />
      </Card>

      {/* Chat Messages */}
      <Card
        sx={{
          boxShadow: "none",
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse", // Reverse the order of the messages
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        {listChat &&
          listChat?.[0]?.attributes?.messages
            ?.slice() // Create a copy of the array
            .reverse()
            .map((data) => (
              <>
                {data.lead ? (
                  <>
                    <Box
                      p={2}
                      textAlign="left"
                      sx={{
                        background: "#00f381",
                        width: "80%",
                        marginLeft: "auto",
                        marginBottom: 2,
                        borderRadius: "5px",
                        position: "relative",
                        wordWrap: "break-word",
                      }}
                    >
                      {/* Previous messages extending towards the left */}
                      {data?.messages}
                      {/* Add more messages as needed */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 4,
                          color: "#484848",
                          fontSize: "0.8rem",
                        }}
                      >
                        {moment(data?.timestamp).format("LT")}
                      </Typography>
                    </Box>
                    {data?.media_file &&
                      data?.media_file?.data?.map((data) => (
                        <Box
                          sx={{
                            // background: "#00f381",
                            marginLeft: "auto",
                            marginBottom: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{ width: 151 }}
                            image={
                              "https://strapi.rytt.com" + data?.attributes?.url
                            }
                            alt={data?.attributes?.name}
                            onClick={() => handleOpen(data?.attributes?.url)}
                          />
                          <Dialog open={open} onClose={handleClose}>
                            <img
                              src={
                                selectedImageId
                                  ? `https://strapi.rytt.com${selectedImageId}`
                                  : ""
                              }
                              alt="Full size"
                              style={{ width: "100%" }}
                            />
                          </Dialog>
                        </Box>
                      ))}
                  </>
                ) : (
                  <>
                    <Box
                      p={2}
                      textAlign="left"
                      sx={{
                        background: "#e5e5e5a1",
                        width: "80%",
                        marginBottom: 2,
                        borderRadius: "5px",
                        position: "relative",
                        wordWrap: "break-word",
                      }}
                    >
                      {/* Latest message at the right side */}
                      {data?.messages}

                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 4,
                          color: "#484848",
                          fontSize: "0.8rem",
                        }}
                      >
                        {moment(data?.timestamp).format("LT")}
                      </Typography>
                    </Box>
                    {data?.media_file &&
                      data?.media_file?.data?.map((data) => (
                        <Box
                          sx={{
                            width: "80%",
                            marginBottom: 2,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{ width: 151 }}
                            image={
                              "https://strapi.rytt.com" + data?.attributes?.url
                            }
                            alt={data?.attributes?.name}
                            onClick={() => handleOpen(data?.attributes?.url)}
                          />
                          <Dialog open={open} onClose={handleClose}>
                            <img
                              src={
                                selectedImageId
                                  ? `https://strapi.rytt.com${selectedImageId}`
                                  : ""
                              }
                              alt="Full size"
                              style={{ width: "100%" }}
                            />
                          </Dialog>
                        </Box>
                      ))}
                  </>
                )}
              </>
            ))}
      </Card>

      {/* Chat Box / Input Area */}
      <Card sx={{ boxShadow: "none" }}>
        <Box p={2}>
          {/* Text input goes here */}
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} sx={{ mt: "0.5px" }}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <FormikTextField
                        name={"message"}
                        label={"Message..."}
                        fullWidth
                      />
                      <IconButton aria-label="delete" type="submit">
                        <SendRoundedIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Card>
    </Box>
  );

  return (
    <div>
      <React.Fragment key="right">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            size="small"
            aria-label="chat"
            onClick={toggleDrawer("right", true)}
          >
            <ChatOutlinedIcon />
          </IconButton>
        </Box>
        <Drawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer("right", false)}
        >
          {list}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
