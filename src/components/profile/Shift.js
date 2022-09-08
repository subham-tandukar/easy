import React from "react";
import "./profile.css";

function Shift({ userDetails }) {


  const services = [
    {
      title: "Shift",
      body:
        userDetails.ShiftName === null || userDetails.ShiftName === "-"
          ? "Not Mentioned"
          : userDetails.ShiftName,
    },
    {
      title: "Type",
      body:
        userDetails.ShiftType === null || userDetails.ShiftType === "-"
          ? "Not Mentioned"
          : userDetails.ShiftType,
    },
    {
      title: "Shift Start",
      body:
        userDetails.ShiftStart === null || userDetails.ShiftStart === "-"
          ? "Not Mentioned"
          : userDetails.ShiftStart,
    },
    {
      title: "Shift End",
      body:
        userDetails.ShiftEnd === null || userDetails.ShiftEnd === "-"
          ? "Not Mentioned"
          : userDetails.ShiftEnd,
    },
    {
      title: "Lunch Start",
      body:
        userDetails.LaunchStart === null || userDetails.LaunchStart === "-"
          ? "Not Mentioned"
          : userDetails.LaunchStart,
    },
    {
      title: "Lunch End",
      body:
        userDetails.LaunchEnd === null || userDetails.LaunchEnd === "-"
          ? "Not Mentioned"
          : userDetails.LaunchEnd,
    },
    {
      title: "Allowed Late In",
      body:
        userDetails.AllowedLateIn === null || userDetails.AllowedLateIn === "-"
          ? "Not Mentioned"
          : userDetails.AllowedLateIn,
    },
    {
      title: "Allowed Early Out",
      body:
        userDetails.AllowedEarlyOut === null ||
          userDetails.AllowedEarlyOut === "-"
          ? "Not Mentioned"
          : userDetails.AllowedEarlyOut,
    },
  ];

  return (
    <div className="basic-center">
      <div className="shift-basic-dyno">
        {services.map((item, index) => {
          return (
            <article key={index} className="basic-info">
              <h6 className="basic-title">{item.title}</h6>
              <p style={{ fontSize: "14px" }}>{item.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Shift;
