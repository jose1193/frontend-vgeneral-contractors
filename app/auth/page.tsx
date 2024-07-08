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

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
});

export default function SignIn() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccess(false);
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
          padding: {
            xs: 3, // Padding para xs (extra small)
            sm: "24px 24px", // Padding para sm (small)
            md: "45px 45px", // Padding para md (medium) y superiores
          },
          borderRadius: "16px", // Añadido bordes redondeados
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Opcional: añade una sombra suave
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 3, // Añade un margen inferior para separar los campos
          }}
        >
          Sign in
        </Typography>
        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const result = await signIn("credentials", {
              redirect: false,
              email: values.email,
              password: values.password,
            });

            setSubmitting(false);

            if (result?.error) {
              setError("Invalid credentials");
              setSnackbarOpen(true);
            } else {
              setSuccess(true);
              setSnackbarOpen(true);
              setTimeout(() => {
                router.push("/dashboard");
              }, 5000); // 5 segundos de retraso antes de redirigir
            }
          }}
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
                sx={{
                  mb: 3, // Añade un margen inferior para separar los campos
                }}
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{
                  mb: 3, // Añade un margen inferior para separar los campos
                }}
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
                <Grid item xs>
                  <Link
                    href="#"
                    style={{ textDecoration: "none" }}
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="#"
                    style={{ textDecoration: "none" }}
                    variant="body2"
                  >
                    {"Don't have an account? "}
                  </Link>
                </Grid>
              </Grid>
              <ButtonGoogle />
            </Form>
          )}
        </Formik>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={success ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {success ? "Authentication successful!" : error}
          </Alert>
        </Snackbar>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 8, mb: 4 }}
      >
        {"Copyright © "}
        <Link
          color="inherit"
          style={{ textDecoration: "none" }}
          href="https://vgeneralcontractors.com/"
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            ml: 1,
            mr: 1,
          }}
        >
          {process.env.NEXT_PUBLIC_COMPANY_NAME || "V General Contractors"}
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
