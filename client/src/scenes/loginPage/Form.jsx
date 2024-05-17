import React from 'react';
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Grid,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./Form.css";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const switchForm = () => {
    setPageType((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={palette.background.default}
      className={`container ${isLogin ? "login-active" : "register-active"}`}
    >
      <Box className="form-wrapper">
        {/* Left Panel */}
        <Box
          className="panel"
          bgcolor={palette.primary.main}
          color={palette.primary.contrastText}
          p="3rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {isLogin ? (
            <>
              <Typography variant="h3" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body1" mb="2rem">
                To keep connected with us, please login with your personal info
              </Typography>
              <Button
                onClick={switchForm}
                variant="contained"
                color="secondary"
                size="large"
              >
                REGISTER
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h3" gutterBottom>
                Join Us Today!
              </Typography>
              <Typography variant="body1" mb="2rem">
                Create an account to connect with others
              </Typography>
              <Button
                onClick={switchForm}
                variant="contained"
                color="secondary"
                size="large"
              >
                LOGIN
              </Button>
            </>
          )}
        </Box>

        {/* Form Panel */}
        <Box className="form-panel" bgcolor={palette.background.alt} p="3rem">
          <Typography variant="h4" align="center" mb="1.5rem">
            {isLogin ? "Login" : "Create Account"}
          </Typography>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {isRegister && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          label="First Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          name="firstName"
                          error={
                            Boolean(touched.firstName) &&
                            Boolean(errors.firstName)
                          }
                          helperText={touched.firstName && errors.firstName}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Last Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          name="lastName"
                          error={
                            Boolean(touched.lastName) &&
                            Boolean(errors.lastName)
                          }
                          helperText={touched.lastName && errors.lastName}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Location"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.location}
                          name="location"
                          error={
                            Boolean(touched.location) &&
                            Boolean(errors.location)
                          }
                          helperText={touched.location && errors.location}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Occupation"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.occupation}
                          name="occupation"
                          error={
                            Boolean(touched.occupation) &&
                            Boolean(errors.occupation)
                          }
                          helperText={touched.occupation && errors.occupation}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          border={`1px solid ${palette.neutral.medium}`}
                          borderRadius="5px"
                          p="1rem"
                        >
                          <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            onDrop={(acceptedFiles) =>
                              setFieldValue("picture", acceptedFiles[0])
                            }
                          >
                            {({ getRootProps, getInputProps }) => (
                              <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                              >
                                <input {...getInputProps()} />
                                {!values.picture ? (
                                  <Typography>Add Picture Here</Typography>
                                ) : (
                                  <FlexBetween>
                                    <Typography>{values.picture.name}</Typography>
                                    <EditOutlinedIcon />
                                  </FlexBetween>
                                )}
                              </Box>
                            )}
                          </Dropzone>
                        </Box>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={
                        Boolean(touched.password) && Boolean(errors.password)
                      }
                      helperText={touched.password && errors.password}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* Social Media Icons */}
                {!isLogin && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    mt="1rem"
                    gap="1rem"
                  >
                    <IconButton>
                      <FacebookIcon color="primary" />
                    </IconButton>
                    <IconButton>
                      <GoogleIcon color="primary" />
                    </IconButton>
                    <IconButton>
                      <LinkedInIcon color="primary" />
                    </IconButton>
                  </Box>
                )}

                {/* Submit Button */}
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLogin ? "LOGIN" : "REGISTER"}
                </Button>
                <Typography
                  align="center"
                  onClick={() => {
                    switchForm();
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
