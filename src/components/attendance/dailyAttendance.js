import React, { useContext, useEffect, useRef, useState } from "react";
import "./dailyAttendance.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/auth-context";
import Spinner from "../loading/spinner";
import NepaliDate from "nepali-date-converter";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

export default function DailyAttendance({
  fromDate,
  toDate,
  DFlag,
  reload,
  appURL,
}) {
  const { customStyles } = useContext(StaffContext)
  const { User } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Date",
      center: true,
      selector: (row) => row.AttenDate,
    },

    {
      name: "Day",
      center: true,
      grow: 0,
      selector: (row) => {
        if (DFlag === "N") {
          const nDate = new NepaliDate(row.AttenDate).getBS();
          // 
          const day = nDate.day;
          return weekDay[day];
        } else {
          const day = new Date(row.AttenDate).getDay();

          return weekDay[day];
        }
      },
    },

    {
      name: "Check In",
      center: true,
      selector: (row) => row.CheckIn,
    },
    {
      name: "Check Out",
      center: true,
      selector: (row) => row.CheckOut,
    },
    {
      name: "Day Type",
      center: true,
      selector: (row) => row.DayType,
    },
    {
      name: "Remark",
      center: true,
      width: "250px",
      selector: (row) => {
        if (row.CheckIn === "No Check In" && row.CheckOut === "No Check Out") {
          if (row.LeaveID != "0") {
            return "On Leave";
          } else {
            return "Absent";
          }
        } else {
          if (row.IsVerified === 1) {
            const remark = row.InRemarks + " | " + row.OutRemarks;
            return remark;
          } else if (row.IsVerified === 0) {
            return "In review";
          } else {
            return "Rejected";
          }
        }
      },
    },
  ];

  useEffect(() => {
    if (Object.keys(User).length && fromDate && toDate) {
      const dataForm = {
        Type: "GET",
        FetchURL: `${appURL}api/attendance-report?ComID=${User.CompanyId}&UserID=${User.UID}&Flag=D&DFlag=${DFlag}&From=${fromDate}&To=${toDate}`,
      };

      Fetchdata(dataForm)
        .then(function (result) {

          if (result.StatusCode === 200) {

            const postResult = result.AttenRepMonth ? result.AttenRepMonth : "";
            setAttendanceList(postResult);
            setLoading(false);
          } else {
            setAttendanceList([]);
            setLoading(false);

          }
        })
        .catch((err) => {
          setAttendanceList([]);
          setLoading(false);
        });
    }
  }, [fromDate, toDate, reload]);

  return (
    <>
      <div>
        {loading ? (
          <>
            {/* <div
              className=" text-center d-flex flex-column justify-content-center align-items-center"
              style={{ margin: "10% auto", width: "120px" }}
            >
              <p className="initial-msg">Please provide input!</p>
            </div> */}
            <Spinner />
          </>
        ) : (
          <DataTable
            columns={columns}
            data={attendanceList}
            customStyles={customStyles}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="370px"
            highlightOnHover
            pointerOnHover
            responsive
            progressPending={loading}
            dense
            striped
          />
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </>
  );
}
