import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../loading/spinner";
import LeavePopup from "./LeavePopup";
import LeaveEditPopup from "./LeaveEditPopup";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";

export default function Leave() {
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext)
  const [leavePopup, setLeavePopup] = useState(false);
  const [leaveEditPopup, setLeaveEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const leaveValue = {
    name: "",
    balance: "",
    type: "",
    gender: "",
    description: "",
  };
  const [leaveFormValue, setLeaveFormValue] = useState(leaveValue);
  const [leaveFormError, setLeaveFormError] = useState({});
  const [isCarry, setIsCarry] = useState(0);

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setLeavePopup(true);

    setLeaveFormValue(leaveValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {

    setLeaveEditPopup(true);
    setTitleID(datas.LeaveID);
    setLeaveFormValue({
      name: datas.Name,
      balance: datas.Balance,
      type: datas.IsPaid,
      gender: datas.GenderID,
      description: datas.Description,
    });
    setIsCarry(datas.IsCarryable);
  };

  //API to hit Leave Type status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      LeaveID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/u-leave-type`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {
        leavList();
        let statsN = JSON.parse(JSON.stringify(newStat));
        let pitchStatus;

        if (dataForm.Status === 1) {
          pitchStatus = "Activated";
        } else if (dataForm.Status === 0) {
          pitchStatus = "Deactivated";
        }

        setNewStat(statsN);
        toast(result.Message, {
          style: {
            color: "green",
            fontSize: "13px",
          },
        });
      } else {
        toast("Error: " + result.Message, {
          style: {
            color: "red",
            fontSize: "13px",
          },
        });
      }
    });
  };

  const changeStatus = (ID, IsActive) => {
    deactivateDepart(ID, IsActive);
  };

  const checkStatus = (IsActive) => {
    if (IsActive === 1) {
      return "Deactivate";
    } else if (IsActive === 0) {
      return "Activate";
    }
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Name",
      // grow: 0,
      center: true,
      selector: (row) => row.Name,
    },
    {
      name: "Balance",
      center: true,
      // grow: 0,
      selector: (row) => row.Balance,
    },
    {
      name: "Is Paid",
      center: true,
      // grow: 0,
      selector: (row) => row.IsPaid,
    },
    {
      name: "Is Carryable",
      center: true,
      // grow: 0,
      selector: (row) => row.IsCarryable,
    },
    {
      name: "Gender",
      center: true,
      // grow: 0,
      selector: (row) => row.Gender,
    },
    {
      name: "Description",
      center: true,
      // grow: 0,
      selector: (row) => row.Description,
    },
    {
      name: "Action",
      // grow: 0,
      center: true,
      width: "200px",
      selector: (row) => {
        return (
          <>
            <div className="ln-verition d-flex">
              <button
                type="button"
                class="btn btn-sm editspan"
                onClick={() => editPop(row)}
              >
                View{" "}
              </button>{" "}

              <button
                type="button"
                class="btn btn-sm actvspan"
                onClick={() => changeStatus(row.LeaveID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit Leave Type list
  const [leaveList, setLeaveList] = useState([]);

  useEffect(() => {
    leavList();
  }, []);

  const leavList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "S",
      Type: "POST",
      BranchID: User.BranchId,
      Status: "-1",
      FetchURL: `${appURL}api/admin/u-leave-type`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.LeaveLst ? result.LeaveLst : "";
        setLeaveList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setLeaveList([]);
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {

      let srchResult = originalList.filter((list) => {
        return list["Designation"].toLowerCase().includes(srchQuery);
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
            <div className="text-start  page-title">Leave Type</div>
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
                  onClick={addLeaveNote}
                >
                  Add New
                </button>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <DataTable
                columns={columns}
                data={leaveList}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="340px"
                highlightOnHover
                pointerOnHover
                responsive
                dense
                striped
                subHeader
                subHeaderComponent={
                  <>
                    <div className="upper-dataTbl">
                      <div className="d-flex">
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
            )}
          </div>
        </>
      </div>
      {leavePopup && (
        <LeavePopup
          setLeavePopup={setLeavePopup}
          reload={reload}
          setReload={setReload}
          leavList={leavList}
          leaveFormValue={leaveFormValue}
          setLeaveFormValue={setLeaveFormValue}
          leaveFormError={leaveFormError}
          setLeaveFormError={setLeaveFormError}
          isCarry={isCarry}
          setIsCarry={setIsCarry}
        />
      )}

      {leaveEditPopup && (
        <LeaveEditPopup
          setLeaveEditPopup={setLeaveEditPopup}
          reload={reload}
          setReload={setReload}
          leavList={leavList}
          leaveFormValue={leaveFormValue}
          setLeaveFormValue={setLeaveFormValue}
          leaveFormError={leaveFormError}
          setLeaveFormError={setLeaveFormError}
          isCarry={isCarry}
          setIsCarry={setIsCarry}
          titleId={titleId}
        />
      )}
    </>
  );
}
