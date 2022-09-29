import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../../context/upperbar-context";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
import { ShowImgPreview } from "../../hooks/imagePreview";
import CreditManagementContext from "../CreditManagementState/CreditManagementContext";
import ApprovePop from "./ApprovePop";
import RejectPop from "./RejectPop";
import StaffContext from "../organization/staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function CreditManagement() {
  const { fiscalYear, todayDate, darkText } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);

  const { reactURL, cooperativeList } = useContext(CooperativeContext);

  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");

  const [reload, setReload] = useState(false);

  const {
    approvePopup,
    handleApprove,
    handleApproveTrue,
    handleApproveFalse,
    handleRejectFalse,
    handleRejectTrue,
    handleReject,
    rejectPopup,
    originalList,
    setOriginalList,
    chooseCooperative,
    setChooseCooperative,
    status,
    setStatus,
    creditList,
    setCreditList,
  } = useContext(CreditManagementContext);

  const searchInput = useRef("");

  const handleCooperative = (e) => {
    const target = e.target;
    const value = target.value;
    setChooseCooperative(value);
  };

  const handleStatus = (e) => {
    const target = e.target;
    const value = target.value;
    setStatus(value);
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Username",
      // grow: 0,
      center: true,
      cell: (row) => row.userName,
    },
    {
      name: "Credit Amount",
      // grow: 0,
      center: true,
      cell: (row) => row.creditAmt.toFixed(2),
    },
    {
      name: "Remarks",
      // grow: 0,
      center: false,
      cell: (row) => row.remarks,
    },
    {
      name: "Attachment",
      // grow: 0,
      center: true,
      selector: (row) => {
        return (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span
                className="imagespan"
                src={row.attachment}
                alt="dp"
                onClick={() => {
                  setImagePre(row.attachment);
                  setImgPrv(true);
                }}
              >
                {" "}
                <p>View</p>
              </span>
            </div>
          </>
        );
      },
    },
    {
      name: "Status",
      // grow: 0,
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            {row.isApprove === "PENDING" ? (
              <div className="ln-verition d-flex">
                <button
                  type="button"
                  className="ln-verition btn btn-sm d-flex"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={() => handleApprove(row.serialNum)}
                >
                  Approve
                </button>{" "}
                <button
                  type="button"
                  className="ln-verition btn btn-sm d-flex"
                  style={{
                    background: "red",
                    color: "white",
                    marginLeft: "5px",
                  }}
                  onClick={() => handleReject(row.serialNum)}
                >
                  Reject
                </button>
              </div>
            ) : row.isApprove === "APPROVED" ? (
              "Approved"
            ) : row.isApprove === "DECLINED" ? (
              "Rejected"
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["userName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setCreditList(srchResult);
      } else {
        setCreditList({});
      }
    } else {
      setCreditList(originalList);
    }
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
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3">
          <div className="page-header">
            <div className="text-start  page-title" style={darkText}>
              Credit Management
            </div>

            <div className="d-flex align-items-center">
              <div className="page-date">
                <div className="sec-content" style={darkText}>
                  <FaRegCalendarAlt /> {todayDate} <span>|</span> Fiscal Year :{" "}
                  {fiscalYear.StartDate}
                  <span>-</span>
                  {fiscalYear.EndDate}
                </div>
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>
        <>
          <div className="sec-dataTable">
            <DataTable
              columns={columns}
              data={creditList}
              customStyles={customStyles}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="410px"
              highlightOnHover
              pointerOnHover
              responsive
              dense
              striped
              subHeader
              subHeaderComponent={
                <>
                  <div className="upper-dataTbl me-2">
                    <label style={darkText} className="text-left d-block">
                      Cooperative
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseCooperative}
                      onChange={handleCooperative}
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                    >
                      <option
                        value="0"
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Cooperative
                      </option>
                      <option value="">All</option>

                      {cooperativeList.map((item) => (
                        <option
                          key={item.cooperativeCode}
                          value={item.cooperativeCode}
                        >
                          {item.cooperativeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="upper-dataTbl me-2">
                    <label style={darkText} className="text-left d-block">
                      Status
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="status"
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                      value={status}
                      onChange={handleStatus}
                    >
                      <option
                        selected
                        disabled
                        value="0"
                        style={{ fontSize: "11px" }}
                      >
                        Select Status
                      </option>
                      <option value="">All</option>
                      <option value="1">Approve</option>
                      <option value="2">Decline</option>
                      <option value="3">Pending</option>
                    </select>
                  </div>

                  <div className="upper-dataTbl">
                    <div className="d-flex" style={{ paddingTop: "20px" }}>
                      <input
                        placeholder="Search"
                        ref={searchInput}
                        type="text"
                        className="form-control form-control-sm searchField"
                        onChange={searchHandler}
                      />
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </>
      </div>
      {approvePopup.show && (
        <ApprovePop
          handleApproveTrue={handleApproveTrue}
          handleApproveFalse={handleApproveFalse}
        />
      )}

      {rejectPopup.show && (
        <RejectPop
          handleRejectTrue={handleRejectTrue}
          handleRejectFalse={handleRejectFalse}
        />
      )}

      {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
