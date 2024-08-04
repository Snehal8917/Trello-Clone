"use client";
import React from "react";
import Head from "next/head";
import { Layout1 } from "../layout";
import styles from "../../styles/Form.module.css";
import Link from "next/link";
import { HiAtSymbol, HiOutlineUser, HiFingerPrint } from "react-icons/hi";
import { toast } from "react-toastify";
import { useState } from "react";
import { useFormik } from "formik";
import registerSchema from "@/lib/registerValidate";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import axios from "axios";

const Register = () => {
  const { data: session } = useSession();
  if (session) redirect("/");
  const [show, setShow] = useState({ password: false, cpassword: true });
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: registerSchema,
    onSubmit,
  });
  async function onSubmit(values: any) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(values),
    };
    try {
      const response = await fetch(
        // "http://localhost:3000/api/auth/signup",
        `api/auth/signup`,
        options
      );
      if (response.ok) {
        toast.success(
          `New User with email:${values.email} Created, Redirecting to Login Page...`
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorText = await response.text(); // Convert the response body to text
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      toast.error(`Error: ${error as string}`);
    }
  }
  return (
    <Layout1>
      <Head>
        <title>Signup</title>
      </Head>
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-gray-800 dark:text-white text-4xl font-bold py-4">
            Register
          </h1>
          <p className="text-3xl dark:text-white/60 font-semibold text-center text-gray-800 mb-4">
            Please Register your self
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div
            className={`${
              formik.touched.username && formik.errors.username
                ? "border-rose-600"
                : ""
            }  flex border rounded-xl relative dark:bg-gray-800 bg-slate-50`}
          >
            <input
              type="text"
              placeholder="Username"
              className={`w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text} dark:bg-gray-800 dark:text-white`}
              {...formik.getFieldProps("username")}
            />
            <span className="icon flex items-center px-4">
              <HiOutlineUser size={25} />
            </span>
          </div>
          <div
            className={`${
              formik.touched.username && formik.errors.username
                ? "border-rose-600"
                : ""
            } flex border rounded-xl relative dark:bg-gray-800 bg-slate-50`}
          >
            <input
              type="email"
              placeholder="Email"
              className={` w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text} dark:bg-gray-800 dark:text-white`}
              {...formik.getFieldProps("email")}
            />
            <span className="icon flex items-center px-4">
              <HiAtSymbol size={25} />
            </span>
          </div>
          <div
            className={`${
              formik.touched.password && formik.errors.password
                ? "border-rose-600"
                : ""
            } flex border rounded-xl relative dark:bg-gray-800 bg-slate-50`}
          >
            <input
              type={`${show.password ? "text" : "password"}`}
              placeholder="password"
              className={`w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text} dark:bg-gray-800 dark:text-white`}
              {...formik.getFieldProps("password")}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShow({ ...show, password: !show.password })}
            >
              <HiFingerPrint size={25} />
            </span>
          </div>
          <div
            className={`${
              formik.touched.cpassword && formik.errors.cpassword
                ? "border-rose-600"
                : ""
            } flex border rounded-xl relative dark:bg-gray-800 dark:text-white`}
          >
            <input
              type={`${show.cpassword ? "text" : "password"}`}
              placeholder="Confirm Password"
              className={`w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text} dark:bg-gray-800 dark:text-white`}
              {...formik.getFieldProps("cpassword")}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
            >
              <HiFingerPrint size={25} />
            </span>
          </div>

          {/* login buttons */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradiant-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-gray-700 hover:border"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400">
          Have an account
          <Link className="text-blue-700 dark:text-blue-500" href={"/login"}>
            {" "}
            Sign In
          </Link>
        </p>
      </section>
    </Layout1>
  );
};
export default Register;
