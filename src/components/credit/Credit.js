import React, { useContext, useEffect, useRef, useState } from "react";
import "../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpperbarContext from "../context/upperbar-context";
import CooperativeContext from "../adminPanel/organization/cooperativeState/CooperativeContext";
import { ShowImgPreview } from "../hooks/imagePreview";
import CreditManagementContext from "../adminPanel/CreditManagementState/CreditManagementContext";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";
import CreditPopup from "./CreditPopup";
import { Fetchdata } from "../hooks/getData";

export default function Credit() {
  const { fiscalYear, todayDate, darkText } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);
  const [creditPopup, setCreditPopup] = useState(false);
  const [creditEditPopup, setCreditEditPopup] = useState(false);
  const { reactURL, cooperativeList } = useContext(CooperativeContext);
  const { User } = useContext(AuthContext);
  const [imgPrv, setImgPrv] = useState(false);
  const [imagePre, setImagePre] = useState("");
  const [reload, setReload] = useState(false);

  const searchInput = useRef("");

  const initalvalue = {
    creditAmt: "",
    remark: "",
  };
  const [creditErrors, setCreditErrors] = useState({});
  const [creditValues, setCreditValues] = useState(initalvalue);

  const addCredit = () => {
    setCreditPopup(true);
    setCreditValues("");
  };

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

  //API to hit Credit list
  const [creditLst, setCreditLst] = useState([]);
  const [chooseCooperative, setChooseCooperative] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    crList();
  }, [chooseCooperative, status]);

  const crList = () => {
    const params = {
      CoOperativeCode: chooseCooperative,
      UserName: User.Username,
      Flag: "s",
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
      FetchURL:
        "https://testing.esnep.com/MblPayPanel/CoOperative/CreditManagement",
    };

    Fetchdata(params).then(function (result) {
      if (result.statuS_CODE === "0") {
        const postResult = result.creditLst ? result.creditLst : "";
        setLoading(false);
        setCreditLst(postResult);
        console.log("result", postResult);
      } else {
        setCreditLst([]);
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["userName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setCreditLst(srchResult);
      } else {
        setCreditLst({});
      }
    } else {
      setCreditLst(originalList);
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
            <div className="page-date">
              <div className="sec-content" style={darkText}>
                Today's Date : {todayDate} <span>|</span> Fiscal Year :{" "}
                {fiscalYear.StartDate}
                <span>-</span>
                {fiscalYear.EndDate}
              </div>
            </div>
          </div>
          <hr className="title-hr" />
        </div>
        <>
          <div className="sec-dataTable">
            <div className="upper-dataTbl">
              <div className="btn-addlnote mb-3">
                <button
                  type="button"
                  class="btn btn-sm"
                  style={{
                    background: "var(--button-color)",
                    color: "white",
                  }}
                  onClick={addCredit}
                >
                  Add Credit
                </button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={creditLst}
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
      {/* {approvePopup.show && (
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
      )} */}

      {/* {imgPrv &&
        ShowImgPreview({
          img: imagePre,
          setTrigger: setImgPrv,
        })} */}

      {creditPopup && (
        <CreditPopup
          reload={reload}
          setReload={setReload}
          setCreditPopup={setCreditPopup}
          crList={crList}
          creditValues={creditValues}
          setCreditValues={setCreditValues}
          creditErrors={creditErrors}
          setCreditErrors={setCreditErrors}
          chooseCooperative={chooseCooperative}
        />
      )}
    </>
  );
}
