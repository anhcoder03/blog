import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Field } from "../components/field";
import { IconEyeClose, IconEyeOpen } from "../components/icon";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { useAuth } from "../contexts/auth-context";
import AuthenticationPage from "./AuthenticationPage";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Your password must have at least 1 uppercase, 1 lowercase, 1 special character",
      }
    )
    .required("Please enter your password"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const handleSignIn = async (values) => {
    console.log(values);
    if (!isValid) return;
    await signInWithEmailAndPassword(auth, values.email, values.password);
    navigate("/");
  };
  // console.log(userInfo);
  // useEffect(() => {
  //   if (!userInfo.email) navigate("/");
  //   else navigate("/sign-in");
  // }, []);
  useEffect(() => {
    const arrayError = Object.values(errors);
    if (arrayError.length > 0) {
      toast.error(arrayError[0]?.message);
    }
  }, [errors]);
  useEffect(() => {
    document.title = "Sign In";
  });
  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="text"
            name="email"
            placeholder="Please enter you email address"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type={togglePassword ? "text" : "password"}
            name="password"
            placeholder="Please enter you password"
            control={control}
          >
            {!togglePassword ? (
              <IconEyeClose
                onClick={() => {
                  setTogglePassword((t) => !t);
                }}
              ></IconEyeClose>
            ) : (
              <IconEyeOpen
                onClick={() => {
                  setTogglePassword((t) => !t);
                }}
              ></IconEyeOpen>
            )}
          </Input>
        </Field>
        <Button
          type="submit"
          style={{
            maxWidth: 300,
            margin: "0 auto",
          }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
