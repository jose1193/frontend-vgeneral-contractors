"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import ButtonGoogle from "../components/ButtonGoogle";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import AccountCircle from "@mui/icons-material/AccountCircle";

const SignInSchema = Yup.object().shape({
  email: Yup.string().max(35).required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
});

export default function SignIn() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSignIn = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setSnackbar({
          open: true,
          message: "Invalid credentials",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Authentication successful!",
          severity: "success",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred during sign in",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth={false} sx={{ maxWidth: "600px" }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#ffffff"
              : theme.palette.background.paper,
          padding: { xs: 3, sm: 4, md: 5 },
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign in
        </Typography>
        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={SignInSchema}
          onSubmit={handleSignIn}
        >
          {({
            isSubmitting,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <Form>
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{ mb: 3 }}
                id="email"
                label="Email Or Username"
                name="email"
                autoComplete="off"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{ mb: 3 }}
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Field as={Checkbox} name="remember" color="primary" />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: 48 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link
                    href="auth/forgot-password"
                    variant="body2"
                    sx={{ textDecoration: "none" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <ButtonGoogle />
            </Form>
          )}
        </Formik>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 8, mb: 4 }}
      >
        {"Copyright © "}
        <Link
          sx={{ textDecoration: "none", fontWeight: "bold", p: 1 }}
          href="https://vgeneralcontractors.com/"
        >
          {process.env.NEXT_PUBLIC_COMPANY_NAME || "V General Contractors"}
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
