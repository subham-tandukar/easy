import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";

import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HolidayPopup from "./HolidayPopup";
import HolidayPopupEdit from "./HolidayPopupEdit";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function AdminHoliday() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);
  const [holidayPopup, setHolidayPopup] = useState(false);
  const [holidayEditPopup, setHolidayEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const holidayValue = {
    event: "",
    eventDate: "",
  };
  const [holidayFormValue, setHolidayFormValue] = useState(holidayValue);
  const [holidayFormError, setHolidayFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setHolidayPopup(true);

    setHolidayFormValue(holidayValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setHolidayEditPopup(true);
    setTitleID(datas.HolidayID);
    setHolidayFormValue({
      event: datas.Name,
      eventDate: datas.EnglishDate,
    });
  };

  //API to hit Holiday status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      HolidayID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/holiday`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        holiList();
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
      name: "Date",
      center: true,
      // grow: 0,
      selector: (row) => row.EnglishDate,
    },
    {
      name: "Holiday",
      center: true,
      // grow: 0,
      selector: (row) => row.Name,
    },
    {
      name: "Days Remaning",
      // grow: 0,
      center: true,
      selector: (row) => row.DaysRemaining,
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
                onClick={() => changeStatus(row.HolidayID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit holiday list
  const [holidayList, setHolidayList] = useState([]);

  useEffect(() => {
    holiList();
  }, []);

  const holiList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      Flag: "S",
      Type: "POST",
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/holiday`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.Holidays ? result.Holidays : "";
        setHolidayList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["Name"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setHolidayList(srchResult);
      } else {
        setHolidayList({});
      }
    } else {
      setHolidayList(originalList);
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
              Holiday
            </div>
            <div className="page-date">
              <div className="sec-content" style={darkText}>
                <FaRegCalendarAlt /> {todayDate} <span>|</span> Fiscal Year :{" "}
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

            <DataTable
              columns={columns}
              data={holidayList}
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
          </div>
        </>
      </div>
      {holidayPopup && (
        <HolidayPopup
          setHolidayPopup={setHolidayPopup}
          reload={reload}
          setReload={setReload}
          holiList={holiList}
          holidayFormValue={holidayFormValue}
          setHolidayFormValue={setHolidayFormValue}
          holidayFormError={holidayFormError}
          setHolidayFormError={setHolidayFormError}
        />
      )}
      {holidayEditPopup && (
        <HolidayPopupEdit
          setHolidayEditPopup={setHolidayEditPopup}
          reload={reload}
          setReload={setReload}
          holiList={holiList}
          holidayFormValue={holidayFormValue}
          setHolidayFormValue={setHolidayFormValue}
          holidayFormError={holidayFormError}
          setHolidayFormError={setHolidayFormError}
          titleId={titleId}
        />
      )}
    </>
  );
}
