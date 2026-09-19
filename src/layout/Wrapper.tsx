"use client";

import { ToastContainer } from "react-toastify";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="oc-page">
      {children}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Wrapper;
