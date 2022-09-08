import React from "react";
import loading from "./loading.gif";

export default function Spinner() {
  return (
    <div
      className=" text-center d-flex flex-column justify-content-center align-items-center"
      style={{ margin: "10% auto", width: "120px" }}
    >
      <img src={loading} alt="" />
    </div>
  );
}
