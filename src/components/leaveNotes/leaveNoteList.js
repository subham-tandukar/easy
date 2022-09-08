import React, { useContext, useEffect, useRef, useState } from "react";
import Spinner from "../loading/spinner";
import DataTable from "react-data-table-component";
import "./leaveNoteList.css";
import LeaveNotePopup from "./leaveNotePopup";
import { Fetchdata } from "../hooks/getData";
import AuthContext from "../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NepaliDate from "nepali-date-converter";
import ConfirmPopup from "../hooks/confirmPopup";
import UpperbarContext from "../context/upperbar-context";
import { GetEnglishDate, GetNepaliDate } from "../hooks/dateConvertor";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

export default function LeaveNoteList() {

  const { customStyles } = useContext(StaffContext)

  const [loading, setLoading] = useState(true);
  const [leavelist, setLeaveList] = useState([]);
  const [originalList, setOriginalList] = useState(null);
  const [leaveNotePopup, setLeaveNotePopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [DFlag, setDFlag] = useState("N");
  const searchInput = useRef("");
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [selected_note, setSelectedNote] = useState("");
  const { User } = useContext(AuthContext);
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);

  const columns = [
    {
      name: "S.N.",
      // grow: 0,
      width: "55px",
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Leave Type",
      // grow: 0,
      width: "190px",
      center: true,
      selector: (row) => row.LeaveType,
    },
    // { name: "Date", grow: 0, center: true, selector: (row) => row.LeaveTitle },
    { name: "Title", grow: 1, center: true, selector: (row) => row.Title },
    {
      name: "Cause",
      // grow: 2,
      width: "190px",
      selector: (row) => row.Cause,
    },
    {
      name: "From",
      grow: 0,
      center: true,
      selector: (row) => {
        return DFlag === "N" ? GetEnglishDate(row.FromDate) : row.FromDate;
      },
    },
    {
      name: "To",
      grow: 0,
      center: true,
      selector: (row) => {
        return DFlag === "N" ? GetEnglishDate(row.ToDate) : row.ToDate;
      },
    },
    {
      name: "Days",
      grow: 0,
      center: true,
      selector: (row) => row.TotalDays,
    },

    {
      name: "Status",
      center: true,
      width: "90px",
      cell: (row) => row.LeaveStatus,
      // <>
      //   <label
      //     class="leave-status"
      //     style={{ background: "#0079bf", color: "white" }}
      //   >
      //     {row.LeaveStatus}
      //   </label>
      // </>
    },
    {
      name: "Verified By",
      center: true,
      width: "150px",
      selector: (row) => {
        return row.LeaveVerified === "verified"
          ? row.VerifiedBy
          : "Not verified";
      },
    },
    {
      name: "Action",
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm editspan"
              // onClick={() => updateRequest(row)}
              >
                View
              </button>{" "}
              {/* <span className="pt-1">|</span> */}
              {row.LeaveVerified === "unverified" && (
                <button
                  type="button"
                  class="btn btn-sm actvspan"
                  onClick={() => updateRequest(row)}
                >
                  Delete
                </button>
              )}
            </div>
          </>
        );
      },
    },
  ];

  // const getNepaliDate = (date) => {
  //   const rDate = Date.parse(date);
  //   const nepDate = new NepaliDate(rDate).getBS();
  //   // const nepDate = new NepaliDate(new Date(newss));
  //   var cm = nepDate.month + 1;
  //   if (cm < 10) {
  //     cm = "0" + cm;
  //   }
  //   // 
  //   let strDate = nepDate.year + "/" + cm + "/" + nepDate.date;
  //   // 
  //   return strDate;
  // };

  const updateRequest = (row) => {

    setSelectedNote(row);
    setConfirmPopup(true);
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {

      let srchResult = originalList.filter((list) => {
        return list["LeaveTitle"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {

        setLeaveList(srchResult);
      } else {
        setLeaveList({});
      }
    } else {
      setLeaveList(originalList);
    }
  };

  useEffect(() => {
    const params = {
      FetchURL: `${appURL}api/leave-report?ComID=${User.CompanyId}&UserID=${User.UID}&LeaveTypeID=1`,
      Type: "GET",
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {

          const postResult = result.LeaveReports ? result.LeaveReports : "";
          setLeaveList(postResult);
          setOriginalList(postResult);
          setLoading(false);
        } else {
          setLeaveList([]);

          setLoading(false);
        }
      })
      .catch((err) => {
        setLeaveList([]);
        setLoading(false);
      });
  }, [reload]);

  const addLeaveNote = (e) => {
    setLeaveNotePopup(true);

  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />

      <div className="container-fluid leavenote-wrapper mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title">All Leavenote</div>
            <div className="page-date">
              <div className="sec-content">
                Today's Date : {todayDate} <span>|</span> Fiscal Year :{" "}
                {fiscalYear.StartDate}
                <span>-</span>
                {fiscalYear.EndDate}
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {" "}
            <div className="sec-dataTable">
              <DataTable
                columns={columns}
                data={leavelist}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="450px"
                highlightOnHover
                pointerOnHover
                progressPending={loading}
                responsive
                subHeader
                dense
                striped
                subHeaderComponent={
                  <>
                    <div className="upper-dataTbl">
                      <div className="btn-addlnote mb-3">
                        <button
                          type="button"
                          class="btn btn-sm"
                          style={{
                            background: "var(--button-color)",
                            color: "white",
                          }}
                          onClick={addLeaveNote}
                        >
                          Request Leave
                        </button>
                      </div>
                      {/* <div className="d-flex">
                        <p className="pe-2">Search</p>
                        <input
                          ref={searchInput}
                          type="text"
                          class="form-control form-control-sm searchField"
                          placeholder=""
                          onChange={searchHandler}
                        />
                      </div> */}
                    </div>
                  </>
                }
              />
            </div>
          </>
        )}
      </div>
      {leaveNotePopup && (
        <LeaveNotePopup
          setLeaveNotePopup={setLeaveNotePopup}
          reload={reload}
          setReload={setReload}
          DFlag={DFlag}
        />
      )}

      {confirmPopup &&
        selected_note &&
        ConfirmPopup({
          FormData: {
            ComID: User.CompanyId,
            UserID: User.UID,
            LeaveID: selected_note.LeaveID,
            Status: 0,
            FetchURL: "https://esnep.com/easyoffice/api/leave-status",
            Type: "POST",
          },
          reload: reload,
          setReload: setReload,
          setTrigger: setConfirmPopup,
          message: "Are you sure you want to delete this item ?",
        })}
    </>
  );
}
