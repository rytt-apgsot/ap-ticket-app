import { Box, Card, Grid, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { Field, Formik } from "formik";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import LoadingButton from "../Button/LoadingButton";
import FormikPhoneFieldCode from "../Formik/FormikPhoneFieldCode";
import FormikSelectNew from "../Formik/FormikSelectNew";
import FormikTextField from "../Formik/FormikTextField";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function CreateCase({ formData }) {
  const storedData = localStorage.getItem("user_student");

  const [open, setOpen] = React.useState(false);

  const userData = JSON.parse(storedData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    name: "",
    phone: "",
    email: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().label("Name").required(),
    phone: Yup.string().label("Phone Number").required(),
    email: Yup.string().label("Email id").required(),
  });

  const FileUploadField = ({ form, field }) => {
    const onDrop = React.useCallback(
      (acceptedFiles) => {
        form.setFieldValue(field.name, acceptedFiles);
      },
      [form, field]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <div>
        <div {...getRootProps()} style={dropzoneStyles}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop files here, or click to select files</p>
        </div>
        <Box>
          {field?.value?.map((file, index) => (
            <Card
              variant="outlined"
              key={index}
              sx={{
                marginTop: "10px",
                padding: "10px",
              }}
            >
              {file.name}
            </Card>
          ))}
        </Box>
      </div>
    );
  };

  const dropzoneStyles = {
    border: "2px dashed #cccccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const now = new Date();
    const isoString = now.toISOString();

    const formData = new FormData();

    values.file.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (values.file) {
        const response = await axios.post(
          "https://test-strapi.rytt.com/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload successful:", response.data);

        if (response.data) {
          try {
            await axios
              .post(`https://test-strapi.rytt.com/api/cases`, {
                data: {
                  ...values,
                  Subject: values.issue_type + "-queries",
                  media: response.data.map((data) => ({ id: data.id })),
                  leads: {
                    id: userData[0].id,
                  },
                },
              })
              .then(function (responseCase) {
                axios.post(`https://test-strapi.rytt.com/api/chat-finals`, {
                  data: {
                    lead: [
                      {
                        id: userData[0].id,
                      },
                    ],
                    messages: [
                      {
                        messages: responseCase.data.data.attributes.Description,
                        lead: userData[0].attributes.name,
                        timestamp: isoString,
                        media_file: response.data.map((data) => ({
                          id: data.id,
                        })),
                      },
                    ],
                    case: {
                      id: responseCase.data.data.id,
                    },
                  },
                });
              });
            console.log("Response:", response.data);
            handleClose();
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }
      } else {
        try {
          await axios
            .post(`https://test-strapi.rytt.com/api/cases`, {
              data: {
                ...values,
                Subject: values.issue_type + "-queries",
                leads: [
                  {
                    id: userData[0].id,
                  },
                ],
              },
            })
            .then(function (responseCase) {
              axios.post(`https://test-strapi.rytt.com/api/chat-finals`, {
                data: {
                  lead: [
                    {
                      id: userData[0].id,
                    },
                  ],
                  messages: [
                    {
                      messages: responseCase.data.data.attributes.Description,
                      lead: userData[0].attributes.name,
                      timestamp: isoString,
                    },
                  ],
                  case: {
                    id: responseCase.data.data.id,
                  },
                },
              });
            });
          console.log("Response: Successfuly");
          handleClose();
        } catch (error) {
          console.log(error);
        } finally {
          setSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      console.log("Error details:", error.response); // Log more details about the error
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
        <Button variant="outlined" onClick={handleClickOpen}>
          Create Case
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create Case</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            // validationSchema={validationSchema}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} sx={{ mt: "0.5px" }}>
                  <Grid item xs={12}>
                    <FormikTextField
                      name={"SuppliedName"}
                      label={"Name"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikPhoneFieldCode
                      type="number"
                      label={"Mobile Number"}
                      name="SuppliedPhone"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikTextField
                      name={"SuppliedEmail"}
                      label={"Email Id"}
                      fullWidth
                    />
                  </Grid>
                  {formData.map((data, index) => (
                    <>
                      {data.type === "Text" && (
                        <Grid item xs={12}>
                          <FormikTextField
                            name={data.name}
                            label={data.label}
                            fullWidth
                          />
                        </Grid>
                      )}

                      {data.type === "select" && (
                        <Grid item xs={12}>
                          <FormikSelectNew
                            name={data.name}
                            label={data.label}
                            fullWidth
                          >
                            {data.menuItem.map((item, i) => (
                              <MenuItem value={item.value} key={i}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </FormikSelectNew>
                        </Grid>
                      )}

                      {values.issue_type === "Technical Support" &&
                        data.menuItem[0].form && (
                          <>
                            <Grid item xs={12}>
                              <FormikSelectNew
                                name={data.menuItem[0].form[0].name}
                                label={data.menuItem[0].form[0].label}
                                fullWidth
                              >
                                {data.menuItem[0].form[0].menuItem.map(
                                  (subItem, i) => (
                                    <MenuItem value={subItem.value} key={i}>
                                      {subItem.name}
                                    </MenuItem>
                                  )
                                )}
                              </FormikSelectNew>
                            </Grid>
                            {values[data.menuItem[0].form[0].name] ===
                              "Strategy" &&
                              data.menuItem[0].form[0].menuItem[0].form && (
                                <>
                                  <Grid item xs={12}>
                                    {data.menuItem[0].form[0].menuItem[0].form.fields.map(
                                      (strategyField, i) => (
                                        <FormikTextField
                                          key={i}
                                          name={strategyField.name}
                                          label={strategyField.label}
                                          fullWidth
                                        />
                                      )
                                    )}
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Calculation" &&
                              data.menuItem[0].form[0].menuItem[0].form && (
                                <>
                                  <Grid item xs={12}>
                                    {data.menuItem[0].form[0].menuItem[1].form.fields.map(
                                      (strategyField, i) => (
                                        <FormikTextField
                                          key={i}
                                          name={strategyField.name}
                                          label={strategyField.label}
                                          multiline
                                          rows={2}
                                          fullWidth
                                        />
                                      )
                                    )}
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Rules" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    {data.menuItem[0].form[0].menuItem[2].form.fields.map(
                                      (rulesField, i) => (
                                        <FormikTextField
                                          key={i}
                                          name={rulesField.name}
                                          label={rulesField.label}
                                          fullWidth
                                        />
                                      )
                                    )}
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Order-Placement" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Roll-over" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] === "Gaps" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Risk Management" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Expiry" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                            {values[data.menuItem[0].form[0].name] ===
                              "Others" &&
                              data.menuItem[0].form[0].menuItem[1].form && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}
                          </>
                        )}
                      {values.issue_type === "Non-Technical Support" &&
                        data.menuItem[1].form && (
                          <>
                            <Grid item xs={12}>
                              <FormikSelectNew
                                name={data.menuItem[1].form[0].name}
                                label={data.menuItem[1].form[0].label}
                                fullWidth
                              >
                                {data.menuItem[1].form[0].menuItem.map(
                                  (subItem, i) => (
                                    <MenuItem value={subItem.value} key={i}>
                                      {subItem.name}
                                    </MenuItem>
                                  )
                                )}
                              </FormikSelectNew>
                            </Grid>
                            {values[data.menuItem[1].form[0].name] ===
                              "Session-Related" && (
                              <Grid item xs={12}>
                                {/* Render the next dropdown based on the selection */}
                                <FormikSelectNew
                                  name={
                                    data.menuItem[1].form[0].menuItem[0].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[1].form[0].menuItem[0].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[1].form[0].menuItem[0].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {values[
                              data.menuItem[1].form[0].menuItem[0].form[0].name
                            ] === "Session-Note" && (
                              <>
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              </>
                            )}
                            {values[
                              data.menuItem[1].form[0].menuItem[0].form[0].name
                            ] === "Session-Recording" && (
                              <>
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              </>
                            )}
                            {values[
                              data.menuItem[1].form[0].menuItem[0].form[0].name
                            ] === "Session-Link" && (
                              <>
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              </>
                            )}

                            {values[data.menuItem[1].form[0].name] ===
                              "Student Portal" && (
                              <Grid item xs={12}>
                                <FormikSelectNew
                                  name={
                                    data.menuItem[1].form[0].menuItem[1].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[1].form[0].menuItem[1].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[1].form[0].menuItem[1].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {(values[
                              data.menuItem[1].form[0].menuItem[1].form[0].name
                            ] === "Not able to login" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Not receiving OTP" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Not able to reset the password" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Account has been locked" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] ===
                                "Change the mobile number/ Wrong mobile Number" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Not able to verify" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "601 Error" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Not able to play the video" ||
                              values[
                                data.menuItem[1].form[0].menuItem[1].form[0]
                                  .name
                              ] === "Any technical issue") &&
                              values[data.menuItem[1].form[0].name] ===
                                "Student Portal" && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}

                            {values[data.menuItem[1].form[0].name] ===
                              "Zoom" && (
                              <Grid item xs={12}>
                                <FormikSelectNew
                                  name={
                                    data.menuItem[1].form[0].menuItem[2].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[1].form[0].menuItem[2].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[1].form[0].menuItem[2].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {(values[
                              data.menuItem[1].form[0].menuItem[2].form[0].name
                            ] === "Not able to login" ||
                              values[
                                data.menuItem[1].form[0].menuItem[2].form[0]
                                  .name
                              ] === "Not able to open the meeting" ||
                              values[
                                data.menuItem[1].form[0].menuItem[2].form[0]
                                  .name
                              ] ===
                                "Zoom is not working properly video is blur, video getting hang") &&
                              values[data.menuItem[1].form[0].name] ===
                                "Zoom" && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}

                            {values[data.menuItem[1].form[0].name] ===
                              "Recording Request Form" && (
                              <Grid item xs={12}>
                                <FormikSelectNew
                                  name={
                                    data.menuItem[1].form[0].menuItem[3].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[1].form[0].menuItem[3].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[1].form[0].menuItem[3].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {(values[
                              data.menuItem[1].form[0].menuItem[3].form[0].name
                            ] === "Date of the session" ||
                              values[
                                data.menuItem[1].form[0].menuItem[3].form[0]
                                  .name
                              ] === "Reason for not attending") &&
                              values[data.menuItem[1].form[0].name] ===
                                "Recording Request Form" && (
                                <>
                                  <Grid item xs={12}>
                                    <FormikTextField
                                      multiline
                                      rows={5}
                                      name={"Description"}
                                      label={"Description"}
                                      fullWidth
                                    />
                                  </Grid>
                                </>
                              )}

                            {values[data.menuItem[1].form[0].name] ===
                              "Others" && (
                              <Grid item xs={12}>
                                <FormikTextField
                                  multiline
                                  rows={5}
                                  name={"Description"}
                                  label={"Description"}
                                  fullWidth
                                />
                              </Grid>
                            )}
                          </>
                        )}

                      {values.issue_type === "ShareKhan" &&
                        data.menuItem[2].form && (
                          <>
                            <Grid item xs={12}>
                              <FormikSelectNew
                                name={data.menuItem[2].form[0].name}
                                label={data.menuItem[2].form[0].label}
                                fullWidth
                              >
                                {data.menuItem[2].form[0].menuItem.map(
                                  (subItem, i) => (
                                    <MenuItem value={subItem.value} key={i}>
                                      {subItem.name}
                                    </MenuItem>
                                  )
                                )}
                              </FormikSelectNew>
                            </Grid>

                            {values[data.menuItem[2].form[0].name] ===
                              "Front-End" && (
                              <Grid item xs={12}>
                                <FormikSelectNew
                                  name={
                                    data.menuItem[2].form[0].menuItem[0].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[2].form[0].menuItem[0].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[2].form[0].menuItem[0].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {values[
                              data.menuItem[2].form[0].menuItem[0].form[0].name
                            ] === "Order Placement" &&
                              values[data.menuItem[2].form[0].name] ===
                                "Front-End" && (
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              )}

                            {values[data.menuItem[2].form[0].name] ===
                              "Backend-End" && (
                              <Grid item xs={12}>
                                <FormikSelectNew
                                  name={
                                    data.menuItem[2].form[0].menuItem[1].form[0]
                                      .name
                                  }
                                  label={
                                    data.menuItem[2].form[0].menuItem[1].form[0]
                                      .label
                                  }
                                  fullWidth
                                >
                                  {data.menuItem[2].form[0].menuItem[1].form[0].menuItem.map(
                                    (subSubItem, i) => (
                                      <MenuItem
                                        value={subSubItem.value}
                                        key={i}
                                      >
                                        {subSubItem.name}
                                      </MenuItem>
                                    )
                                  )}
                                </FormikSelectNew>
                              </Grid>
                            )}

                            {(values[
                              data.menuItem[2].form[0].menuItem[0].form[0].name
                            ] === "Branch Shifting" ||
                              values[
                                data.menuItem[2].form[0].menuItem[0].form[0]
                                  .name
                              ] === "Client Master Change (CMC)") &&
                              values[data.menuItem[2].form[0].name] ===
                                "Backend-End" && (
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              )}

                            {values[
                              data.menuItem[2].form[0].menuItem[0].form[0].name
                            ] === "Queries" &&
                              values[data.menuItem[2].form[0].name] ===
                                "Backend-End" && (
                                <Grid item xs={12}>
                                  {/* Render the "reason" dropdown based on the selection */}
                                  <FormikSelectNew
                                    name={
                                      data.menuItem[2].form[0].menuItem[1]
                                        .form[0].menuItem[2].form[0].name
                                    }
                                    label={
                                      data.menuItem[2].form[0].menuItem[1]
                                        .form[0].menuItem[2].form[0].label
                                    }
                                    fullWidth
                                  >
                                    {data.menuItem[2].form[0].menuItem[1].form[0].menuItem[2].form[0].menuItem.map(
                                      (subSubItem, i) => (
                                        <MenuItem
                                          value={subSubItem.value}
                                          key={i}
                                        >
                                          {subSubItem.name}
                                        </MenuItem>
                                      )
                                    )}
                                  </FormikSelectNew>
                                </Grid>
                              )}

                            {(values[
                              data.menuItem[2].form[0].menuItem[1].form[0]
                                .menuItem[2].form[0].name
                            ] === "Segment Activation" ||
                              values[
                                data.menuItem[2].form[0].menuItem[1].form[0]
                                  .menuItem[2].form[0].name
                              ] === "Account Opening" ||
                              values[
                                data.menuItem[2].form[0].menuItem[1].form[0]
                                  .menuItem[2].form[0].name
                              ] === "Share Transfer" ||
                              values[
                                data.menuItem[2].form[0].menuItem[1].form[0]
                                  .menuItem[2].form[0].name
                              ] === "Offline to Online conversion of account" ||
                              values[
                                data.menuItem[2].form[0].menuItem[1].form[0]
                                  .menuItem[2].form[0].name
                              ] === "Limit in sharekhan (P&L account)" ||
                              values[
                                data.menuItem[2].form[0].menuItem[1].form[0]
                                  .menuItem[2].form[0].name
                              ] === "Others") &&
                              values[
                                data.menuItem[2].form[0].menuItem[0].form[0]
                                  .name
                              ] === "Queries" &&
                              values[data.menuItem[2].form[0].name] ===
                                "Backend-End" && (
                                <Grid item xs={12}>
                                  <FormikTextField
                                    multiline
                                    rows={5}
                                    name={"Description"}
                                    label={"Description"}
                                    fullWidth
                                  />
                                </Grid>
                              )}
                          </>
                        )}
                    </>
                  ))}

                  <Grid item xs={12}>
                    <Field name="file" component={FileUploadField} />
                  </Grid>

                  {/* <Grid item xs={12}>
                    {selectedFile.length > 0 && (
                      <Box>
                        {Array.from(selectedFile).map((file, index) => (
                          <Card
                            variant="outlined"
                            key={index}
                            sx={{
                              marginTop: "10px",
                              padding: "10px",
                            }}
                          >
                            {file.name}
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Grid> */}
                  <Grid item xs={12}>
                    {/* {error && (
                      <Alert severity="error">
                        Please Enter a Valid Phone Number
                      </Alert>
                    )}
                    {errorOtp && (
                      <Alert severity="error">Please Enter a Valid OTP</Alert>
                    )} */}
                  </Grid>
                  <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <LoadingButton
                      color="primary"
                      variant="contained"
                      type="submit"
                      isLoading={isSubmitting}
                      btnText={"Create Case"}
                      loadingText={"Creating Case"}
                    />
                  </DialogActions>
                </Grid>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
