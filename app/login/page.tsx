"use client";
import React from "react";
import Head from "next/head";
import { Layout1 } from "../layout";
import Link from "next/link";
import styles from "../../styles/Form.module.css";
import Image from "next/image";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import loginSchema from "@/lib/loginvalidate";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();
  if (session) redirect("/");

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  async function onSubmit(values: any) {
    const userData = {
      email: values.email,
      password: values.password,
    };
    const res = await signIn("credentials", {
      redirect: false,
      email: userData.email,
      password: userData.password,
      callbackUrl: "/",
    });


    if (!res?.error) {
      toast.success("Sign In Successful, Redirecting to home Page...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      toast.error(res.error);
    }
  }
  //  google Handler fn
  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  }

  async function handleGithuSignin() {
    signIn("github", { callbackUrl: "http://localhost:3000" });
  }
  const [show, setShow] = useState(false);
  return (
    <Layout1>
      <Head>
        <title>Login</title>
      </Head>
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-gray-800 dark:text-white text-4xl font-bold py-4">
            Login
          </h1>
          {/* <p className="w-3/4 mx-auto text-gray-400 dark:text-white/60">
            Welcome Back
          </p> */}
          <h1 className="text-3xl dark:text-white/60 font-semibold text-center text-gray-800 mb-4">
            Welcome Back
          </h1>
        </div>
        <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
          <div className="flex border rounded-xl relative dark:bg-gray-800 bg-slate-50">
            <input
              type="email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              className={`w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text} dark:bg-gray-800 dark:text-white`}
            />
            <span className="icon flex items-center px-4">
              <HiAtSymbol size={25} />
            </span>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="flex border rounded-xl relative dark:bg-gray-800 bg-slate-50">
            <input
              type={`${show ? "text" : "password"}`}
              // name="password"
              placeholder="password"
              className={`w-full py-4 px-6  rounded-xl bg-slate-50  focus:outline-none border:none ${styles.input_text}  dark:bg-gray-800 dark:text-white`}
              {...formik.getFieldProps("password")}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShow(!show)}
            >
              <HiFingerPrint size={25} />
            </span>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : null}
          </div>
          {/* login buttons */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradiant-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-gray-700 hover:border "
            >
              Login
            </button>
          </div>
          <div className="input-button flex justify-center flex-col gap-5">
            <button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full border py-3 flex justify-center gap-2 hover:bg-gray-200 dark:bg-gray-800"
            >
              Sign in with Google{" "}
              <Image
                className=""
                alt="logo"
                src={"/assets/googlelogo.png"}
                width="20"
                height="20"
              />
            </button>
            <button
              type="button"
              onClick={handleGithuSignin}
              className="w-full border py-3 flex justify-center gap-2 hover:bg-gray-200 dark:bg-gray-800"
            >
              Sign in with Github
              <Image
                className="  "
                alt="logo"
                src={"/assets/githublogo.png"}
                width="20"
                height="20"
              />
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400">
          don't have an account yet?
          <Link className="text-blue-700 dark:text-blue-500" href="/register">
            {" "}
            Sign Up
          </Link>
        </p>
      </section>
    </Layout1>
  );
};

export default LoginPage;
