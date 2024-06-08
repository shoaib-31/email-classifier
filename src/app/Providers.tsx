"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <RecoilRoot>
      {children}
      <ToastContainer position="bottom-right" />
    </RecoilRoot>
  );
};

export default Providers;
