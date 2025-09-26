"use client";
import { Lock, Mail, UserRound } from "lucide-react";
import { useFormik } from "formik";
import React, { useState } from "react";
import { AuthAnimationContext } from "@/app/Context/contextProvider";
import { useContext } from "react";
import { singUpSchema } from "@/app/Schemas/SignUp";
function SignUp() {
  const [authAnimation, setAuthAnimation] = useContext(AuthAnimationContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = useState(null);
  const initialValues = {
    Username: "",
    email: "",
    password: "",
  };
  const handleSubmit = async (Username, email, password) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/SignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username, email, password }),
      });
      const data = await response.json();
      if (!data.sucess) {
        setTimeout(() => {
          setError(data.message);
          setIsSubmitting(false);
        }, 2000);
        setTimeout(() => {
          setError(null);
        }, 6000);
      } else {
        setTimeout(() => {
          setAuthAnimation(!authAnimation);
          setIsSubmitting(false);
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        setError("Network Error please check your internet");
        setIsSubmitting(false);
      }, 2000);
      setTimeout(() => {
        setError(null);
      }, 6000);
    }
  };
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: singUpSchema,
    onSubmit: (value) => {
      const { Username, email, password } = value;
      handleSubmit(Username, email, password);
    },
    validateOnBlur: true, // Only validate when the field loses focus
    validateOnChange: false, // Only validate when the form is submitted
  });
  return (
    <div className="py-8 px-6 rounded-3xl bg-white  w-[360px]">
      <div className="text text-center text-3xl font-bold">Registration</div>
      <form
        className="flex justify-center items-center flex-col gap-3 py-5"
        onSubmit={Formik.handleSubmit}
      >
        <div className="flex  flex-col   w-fit bg-[#dbdbdb9a] h-fit  mt-3   rounded-md">
          <div className="flex justify-center items-center  w-[300px]  p-4 h-[42px]">
            {" "}
            <input
              type="Username"
              id="Username"
              value={Formik.values.Username}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              name="Username"
              className="border-none outline-none w-full bg-transparent placeholder:text-[#777777]"
              placeholder="Username"
              autoComplete="off"
              aria-describedby="Username-error"
            />
            <div className="text-[#777777]">
              <UserRound />
            </div>
          </div>{" "}
          {Formik.touched.Username && Formik.errors.Username ? (
            <p className="text-xs px-4 py-[2px] text-red-600">
              {Formik.errors.Username}
            </p>
          ) : null}
        </div>
        <div className="flex  flex-col   w-fit bg-[#dbdbdb9a] h-fit  mt-3   rounded-md">
          <div className="flex justify-center items-center w-[300px]  p-4 h-[42px]">
            {" "}
            <input
              type="email"
              id="email"
              value={Formik.values.email}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              name="email"
              className="border-none outline-none w-full bg-transparent placeholder:text-[#777777]"
              placeholder="Email"
              autoComplete="off"
              aria-describedby="email-error"
            />
            <div className="text-[#777777]">
              <Mail />
            </div>
          </div>{" "}
          {Formik.touched.email && Formik.errors.email ? (
            <p className="text-xs px-4 py-[2px] text-red-600">
              {Formik.errors.email}
            </p>
          ) : null}
        </div>
        <div className="flex  flex-col   w-fit bg-[#dbdbdb9a] h-fit  mt-3   rounded-md">
          <div className="flex justify-center items-center  w-[300px]  p-4 h-[42px]">
            {" "}
            <input
              type="password"
              id="password"
              value={Formik.values.password}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              name="password"
              className="border-none outline-none w-full bg-transparent placeholder:text-[#777777]"
              placeholder="Password"
              autoComplete="off"
              aria-describedby="password-error"
            />
            <div className="text-[#777777]">
              <Lock />
            </div>
          </div>{" "}
          {Formik.touched.password && Formik.errors.password ? (
            <p className="text-xs px-4 py-[2px] text-red-600">
              {Formik.errors.password}
            </p>
          ) : null}
        </div>
        {error && (
          <p className="text-xs text-center px-1 text-red-600">{error}</p>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-[#f44336] text-white w-[300px] h-[42px] mt-3 rounded-md hover:bg-[#9c2525] hover:translate-y-0 translate-y-[1px] transition-all duration-200 transform"
        >
          Sign Up
        </button>
        {isSubmitting && <span className="loader"></span>}
        <div className="text text-sm text-[#000000d0]">
          or other Sign Up methods
        </div>
        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#131313]  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 w-[300px] text-center inline-flex items-center dark:focus:ring-gray-500  "
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clipRule="evenodd"
            />
          </svg>
          Sign in with Github
        </button>
      </form>
    </div>
  );
}

export default SignUp;
