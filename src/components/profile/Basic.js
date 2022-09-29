import React from "react";
import { useContext } from "react";
import UpperbarContext from "../context/upperbar-context";
import "./profile.css";

function Basic({ userDetails }) {
  const { darkText } = useContext(UpperbarContext);
  const services = [
    {
      title: "Company ID",
      body:
        userDetails.CompanyId === null || userDetails.CompanyId === "-"
          ? "Not Mentioned"
          : userDetails.CompanyId,
    },
    {
      title: "Company",
      body: "Easy Software",
    },
    {
      title: "Device Code",
      body:
        userDetails.DeviceCode === null || userDetails.DeviceCode === "-"
          ? "Not Mentioned"
          : userDetails.DeviceCode,
    },
    {
      title: "User Code",
      body:
        userDetails.UID === null || userDetails.UID === "-"
          ? "Not Mentioned"
          : userDetails.UID,
    },
    {
      title: "Email",
      body:
        userDetails.Email === null || userDetails.Email === "-"
          ? "Not Mentioned"
          : userDetails.Email,
    },
    {
      title: "Contact",
      body:
        userDetails.Contact === null || userDetails.Contact === "-"
          ? "Not Mentioned"
          : userDetails.Contact,
    },
    {
      title: "Phone",
      body:
        userDetails.Phone === null || userDetails.Phone === "-"
          ? "Not Mentioned"
          : userDetails.Phone,
    },
    {
      title: "Date of Birth",
      body:
        userDetails.DateOfBirth === null || userDetails.DateOfBirth === "-"
          ? "Not Mentioned"
          : userDetails.DateOfBirth,
    },
    {
      title: "Gender",
      body:
        userDetails.Gender === null || userDetails.Gender === "-"
          ? "Not Mentioned"
          : userDetails.Gender,
    },
    {
      title: "Religion",
      body:
        userDetails.Religion === null || userDetails.Religion === "-"
          ? "Not Mentioned"
          : userDetails.Religion,
    },
    {
      title: "Blood Group",
      body:
        userDetails.BloodGroup === null || userDetails.BloodGroup === "-"
          ? "Not Mentioned"
          : userDetails.BloodGroup,
    },
    {
      title: "Marital Status",
      body:
        userDetails.MaritalStatus === null || userDetails.MaritalStatus === "-"
          ? "Not Mentioned"
          : userDetails.MaritalStatus,
    },
    {
      title: "PAN",
      body:
        userDetails.PAN === null || userDetails.PAN === "-"
          ? "Not Mentioned"
          : userDetails.PAN,
    },
    {
      title: "Citizenship No.",
      body:
        userDetails.CitizenshipNo === null || userDetails.CitizenshipNo === "-"
          ? "Not Mentioned"
          : userDetails.CitizenshipNo,
    },
    {
      title: "Address",
      body:
        userDetails.Address === null || userDetails.Address === "-"
          ? "Not Mentioned"
          : userDetails.Address,
    },
    {
      title: "District",
      body:
        userDetails.District === null || userDetails.District === "-"
          ? "Not Mentioned"
          : userDetails.District,
    },
    {
      title: "Branch",
      body:
        userDetails.BranchName === null || userDetails.BranchName === "-"
          ? "Not Mentioned"
          : userDetails.BranchName,
    },
  ];

  return (
    <div className="basic-center ">
      <div className="basic-dyno">
        {services.map((item, index) => {
          return (
            <article key={index} className="basic-info">
              <h6 className="basic-title" style={darkText}>
                {item.title}
              </h6>
              <p style={darkText}>{item.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Basic;
