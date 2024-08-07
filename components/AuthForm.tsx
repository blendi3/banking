"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Loading from "./Loading";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CostumInput from "./CostumInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthanticated, setIsAuthenticated] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Appwrite

      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };
        const newUser = await signUp(userData);
        setUser(newUser);
        localStorage.setItem("showBanner", "true");
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          setIsAuthenticated(true);
          router.push("/");
        } else {
          form.setError("password", {
            type: "manual",
            message: "Invalid email or password. Please try again.",
          });
        }
      }
    } catch (error: any) {
      if (error.message === "user_already_exists") {
        form.setError("email", {
          type: "manual",
          message:
            "This email is already in use. Please use a different email.",
        });
      } else {
        form.setError("email", {
          type: "manual",
          message: "An error occurred. Please try again.",
        });
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoAccount = async () => {
    setIsLoading(true);
    try {
      const response = await signIn({
        email: "test123@test.com",
        password: "testtest",
      });
      if (response) {
        setIsAuthenticated(true);
        router.push("/");
      } else {
        console.error("Demo login failed");
      }
    } catch (error) {
      console.error("An error occurred during demo login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthanticated) {
    return <Loading />;
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/bank.png"
            width={32}
            height={32}
            alt="Payzen logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Payzen
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CostumInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CostumInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CostumInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CostumInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your City"
                  />
                  <div className="flex gap-4">
                    <CostumInput
                      control={form.control}
                      name="state"
                      label="State (Only US states*)"
                      placeholder="ex: NY"
                    />
                    <CostumInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 12050"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CostumInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CostumInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                  </div>
                </>
              )}
              <CostumInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              <CostumInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col w-full">
                <Button className="form-btn" disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign in"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>

          {type === "sign-in" && (
            <footer className="flex justify-center gap-1">
              <p className="text-14 font-normal text-gray-600">
                Want to try a demo?
              </p>
              <button className="form-link" onClick={loginDemoAccount}>
                Try the demo here
              </button>
            </footer>
          )}
        </>
      )}
    </section>
  );
};

export default AuthForm;
