import React, { useContext, useEffect, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShiftPopup from "./ShiftPopup";
import ShiftEditPopup from "./ShiftEditPopup";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";

export default function Shift() {
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext)
  const [shiftPopup, setShiftPopup] = useState(false);
  const [shiftEditPopup, setShiftEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const shiftValue = {
    shifts: "",
    shiftStart: "",
    shiftEnd: "",
    allowLateIn: "",
    allowEarlyOut: "",
    lunchStart: "",
    lunchEnd: "",
    hdHour: "",
  };

  const [shiftFormValue, setShiftFormValue] = useState(shiftValue);
  const [shiftFormError, setShiftFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setShiftPopup(true);

    setShiftFormValue(shiftValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {


    setShiftEditPopup(true);
    setTitleID(datas.ShiftID);
    setShiftFormValue({
      shifts: datas.Shift,
      shiftStart: datas.Start,
      shiftEnd: datas.Ends,
      allowLateIn: datas.AllowLateIn,
      allowEarlyOut: datas.AllowEarlyOut,
      lunchStart: datas.LunchStart,
      lunchEnd: datas.LunchEnd,
      hdHour: datas.HDHour,
    });
    // setShiftFormValue(datas)
  };

  //API to hit Department status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {


    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID.toString(),
      ShiftID: ID.toString(),
      Flag: "US",
      Status: IsActive.toString(),
      BranchID: User.BranchId.toString(),
      FiscalID: User.FiscalId.toString(),
      FetchURL: `${appURL}api/admin/shift`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = "0";
    } else {
      dataForm.Status = "1";
    }
    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {
        shftList();
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
      name: "Shift",
      // grow: 0,
      center: true,
      selector: (row) => row.Shift,
    },
    {
      name: "Start",
      center: true,
      // grow: 0,
      selector: (row) => row.Start,
    },
    {
      name: "End",
      // grow: 0,
      center: true,
      selector: (row) => row.Ends,
    },

    {
      name: "Allow Late In",
      // grow: 0,
      center: true,
      selector: (row) => row.AllowLateIn,
    },
    {
      name: "Allow Early Out",
      center: true,
      // grow: 0,
      selector: (row) => row.AllowEarlyOut,
    },
    {
      name: "Lunch Start",
      center: true,
      // grow: 0,
      selector: (row) => row.LunchStart,
    },
    {
      name: "Lunch End",
      center: true,
      // grow: 0,
      selector: (row) => row.LunchEnd,
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

                onClick={() => changeStatus(row.ShiftID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];


  //API to hit Shift list
  const [shiftList, setShiftList] = useState([]);

  useEffect(() => {
    shftList();
  }, []);

  const shftList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "S",
      Status: "-1",
      BranchID: User.BranchId.toString(),
      Type: "POST",
      FetchURL: `${appURL}api/admin/shift`,
    };


    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.ShiftList ? result.ShiftList : "";
        setShiftList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setShiftList([]);

      }
    });
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
            <div className="text-start  page-title">Shift</div>
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
                data={shiftList}
                customStyles={customStyles}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="370px"
                highlightOnHover
                pointerOnHover
                responsive
                dense
                striped
                subHeader
                subHeaderComponent={
                  <>
                    <div className="upper-dataTbl">
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
            )}
          </div>
        </>
      </div>
      {shiftPopup && (
        <ShiftPopup
          setShiftPopup={setShiftPopup}
          reload={reload}
          setReload={setReload}
          shftList={shftList}
          shiftFormValue={shiftFormValue}
          setShiftFormValue={setShiftFormValue}
          shiftFormError={shiftFormError}
          setShiftFormError={setShiftFormError}
        />
      )}

      {shiftEditPopup && (
        <ShiftEditPopup
          setShiftEditPopup={setShiftEditPopup}
          reload={reload}
          setReload={setReload}
          shftList={shftList}
          shiftFormValue={shiftFormValue}
          setShiftFormValue={setShiftFormValue}
          shiftFormError={shiftFormError}
          setShiftFormError={setShiftFormError}
          titleId={titleId}
        />
      )}
    </>
  );
}
