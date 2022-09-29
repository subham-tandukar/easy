import React, { useContext, useEffect, useState } from "react";
import "./profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import Spinner from "../loading/spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NepaliDate from "nepali-date-converter";
import { GetNepaliDate } from "../hooks/dateConvertor";
import UpperbarContext from "../context/upperbar-context";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

function Service({ userDetails }) {
  const { customStyles } = useContext(StaffContext);

  const [DFlag, setDFlag] = useState("N");
  const services = [
    {
      title: "Designation",
      body:
        userDetails.DesignationName === null ||
        userDetails.DesignationName === "-"
          ? "Not Mentioned"
          : userDetails.DesignationName,
    },
    {
      title: "Department",
      body:
        userDetails.DepartmentName === null ||
        userDetails.DepartmentName === "-"
          ? "Not Mentioned"
          : userDetails.DepartmentName,
    },
    {
      title: "Sub department",
      body:
        userDetails.SubDepartmentName === null ||
        userDetails.SubDepartmentName === "-"
          ? "Not Mentioned"
          : userDetails.SubDepartmentName,
    },
    {
      title: "Grade",
      body:
        userDetails.GradeName === null || userDetails.GradeName === "-"
          ? "Not Mentioned"
          : userDetails.GradeName,
    },
    {
      title: "Type",
      body:
        userDetails.JobType === null || userDetails.JobType === "-"
          ? "Not Mentioned"
          : userDetails.JobType,
    },
  ];

  const [loading, setLoading] = useState(true);
  const [jobInfo, setJobinfo] = useState([]);
  const { User } = useContext(AuthContext);
  const { appURL, darkText } = useContext(UpperbarContext);

  useEffect(() => {
    const params = {
      Type: "GET",
      FetchURL: `${appURL}api/job-information?ComId=${User.CompanyId}&UserID=${User.UID}`,
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.JobInfo ? result.JobInfo : "";
          setJobinfo(postResult);
          setLoading(false);
        } else {
          setJobinfo([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setJobinfo([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Designation",
      center: true,
      grow: 1,
      selector: (row) => row.Designation,
    },
    {
      name: "Department",
      // grow: 0,
      center: true,
      selector: (row) => row.Department,
    },
    {
      name: "From Date",
      // grow: 0,
      center: true,
      selector: (row) => {
        return DFlag === "N" ? GetNepaliDate(row.StartDate) : row.StartDate;
      },
    },
    {
      name: "To Date",
      // grow: 0,
      center: true,
      selector: (row) => {
        return DFlag === "N" ? GetNepaliDate(row.Enddate) : row.Enddate;
      },
    },
  ];

  return (
    <>
      {" "}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <div className="service-content">
        <div className="service-center">
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

        <h4 style={darkText} className="uk-text-left fs-6">
          Service History <hr />
        </h4>
        {loading ? (
          <>
            {" "}
            <Spinner />
          </>
        ) : (
          <DataTable
            columns={columns}
            data={jobInfo}
            customStyles={customStyles}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="410px"
            highlightOnHover
            pointerOnHover
            responsive
            dense
            striped
            progressPending={loading}
          />
        )}
      </div>
    </>
  );
}

export default Service;
