import { Container } from "@mui/material";
import CreateCase from "../../components/CreateCase/CreateCase";
import Dashboard from "../../components/Dashboard/Dashboard";
import ListCase from "../ListCase";

const Home = () => {
  const formData = [
    {
      type: "select",
      name: "issue_type",
      label: "Issue Type",
      menuItem: [
        {
          name: "Technical Support",
          value: "Technical Support",
          form: [
            {
              name: "Sub_Type__c",
              label: "Sub Issue Type",
              type: "select",
              menuItem: [
                {
                  name: "Strategy",
                  value: "Strategy",
                  form: {
                    fields: [
                      {
                        name: "StrategyName",
                        label: "Strategy Name",
                        type: "text",
                      },
                    ],
                  },
                },
                {
                  name: "Calculation",
                  value: "Calculation",
                  form: {
                    fields: [
                      {
                        name: "Calculation",
                        label: "Calculation",
                        type: "textLine",
                      },
                    ],
                  },
                },
                {
                  name: "Rules",
                  value: "Rules",
                  form: {
                    fields: [
                      {
                        name: "StrategyName",
                        label: "Strategy Name",
                        type: "text",
                      },
                    ],
                  },
                },
                {
                  name: "Order-Placement",
                  value: "Order-Placement",
                },
                {
                  name: "Roll-over",
                  value: "Roll-over",
                },
                {
                  name: "Gaps",
                  value: "Gaps",
                },
                {
                  name: "Risk Management",
                  value: "Risk Management",
                },
                {
                  name: "Expiry",
                  value: "Expiry",
                },
                {
                  name: "Others",
                  value: "Others",
                },
              ],
            },
          ],
        },
        {
          name: "Non-Technical Support",
          value: "Non-Technical Support",
          form: [
            {
              name: "Sub_Type__c",
              label: "Sub Issue Type",
              type: "select",
              menuItem: [
                {
                  name: "Session-Related",
                  value: "Session-Related",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Session-Note",
                          value: "Session-Note",
                        },
                        {
                          name: "Session-Recording",
                          value: "Session-Recording",
                        },
                        {
                          name: "Session-Link",
                          value: "Session-Link",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Student Portal",
                  value: "Student Portal",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Not able to login",
                          value: "Not able to login",
                        },
                        {
                          name: "Not receiving OTP",
                          value: "Not receiving OTP",
                        },
                        {
                          name: "Not able to reset the password",
                          value: "Not able to reset the password",
                        },
                        {
                          name: "Account has been locked",
                          value: "Account has been locked",
                        },
                        {
                          name: "Change the mobile number/ Wrong mobile Number",
                          value:
                            "Change the mobile number/ Wrong mobile Number",
                        },
                        {
                          name: "Not able to verify",
                          value: "Not able to verify",
                        },
                        {
                          name: "601 Error",
                          value: "601 Error",
                        },
                        {
                          name: "Not able to play the video",
                          value: "Not able to play the video",
                        },
                        {
                          name: "Any technical issue",
                          value: "Any technical issue",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Zoom",
                  value: "Zoom",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Not able to login",
                          value: "Not able to login",
                        },
                        {
                          name: "Not able to open the meeting",
                          value: "Not able to open the meeting",
                        },
                        {
                          name: "Zoom is not working properly video is blur, video getting hang",
                          value:
                            "Zoom is not working properly video is blur, video getting hang",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Recording Request Form",
                  value: "Recording Request Form",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Date of the session",
                          value: "Date of the session",
                        },
                        {
                          name: "Reason for not attending",
                          value: "Reason for not attending",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Others",
                  value: "Others",
                },
              ],
            },
          ],
        },
        {
          name: "ShareKhan",
          value: "ShareKhan",
          form: [
            {
              name: "Sub_Type__c",
              label: "Sub Issue Type",
              type: "select",
              menuItem: [
                {
                  name: "Front-End",
                  value: "Front-End",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Order Placement",
                          value: "Order Placement",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Backend-End",
                  value: "Backend-End",
                  form: [
                    {
                      name: "support_type",
                      label: "Support Type",
                      menuItem: [
                        {
                          name: "Branch Shifting",
                          value: "Branch Shifting",
                        },
                        {
                          name: "Client Master Change (CMC)",
                          value: "Client Master Change (CMC)",
                        },
                        {
                          name: "Queries",
                          value: "Queries",
                          form: [
                            {
                              name: "reason",
                              label: "Reason",
                              menuItem: [
                                {
                                  name: "Segment Activation",
                                  value: "Segment Activation",
                                },
                                {
                                  name: "Account Opening",
                                  value: "Account Opening",
                                },
                                {
                                  name: "Share Transfer",
                                  value: "Share Transfer",
                                },
                                {
                                  name: "Offline to Online conversion of account",
                                  value:
                                    "Offline to Online conversion of account",
                                },
                                {
                                  name: "Limit in sharekhan (P&L account)",
                                  value: "Limit in sharekhan (P&L account)",
                                },
                                {
                                  name: "Others",
                                  value: "Others",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <Dashboard />
      <Container>
        <CreateCase formData={formData} />
        <ListCase />
      </Container>
    </>
  );
};
export default Home;
