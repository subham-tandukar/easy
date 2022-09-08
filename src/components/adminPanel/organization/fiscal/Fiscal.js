import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";

import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FiscalPopup from "./FiscalPopup";
import FiscalPopupEdit from "./FiscalPopupEdit";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";

export default function Fiscal() {
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext)
  const [fiscalPopup, setFiscalPopup] = useState(false);
  const [fiscalEditPopup, setFiscalEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isCurrent, setIsCurrent] = useState(false);

  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const fiscalValue = {
    fiscal: "",
    start: "",
    end: "",
  };
  const [fiscalFormValue, setFiscalFormValue] = useState(fiscalValue);
  const [fiscalFormError, setFiscalFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setFiscalPopup(true);

    setFiscalFormValue(fiscalValue);
    setIsCurrent(false);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {

    setFiscalEditPopup(true);
    setTitleID(datas.FID);
    setFiscalFormValue({
      fiscal: datas.FiscalYear,
      start: datas.StartDate,
      end: datas.EndDate,
    });
    setIsCurrent(datas.IsCurrent);
  };

  //API to hit Holiday status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      FID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/fiscal`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {
        fscList();
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
      name: "Fiscal Year",
      center: true,
      // grow: 0,
      selector: (row) => row.FiscalYear,
    },
    {
      name: "Start Date",
      center: true,
      // grow: 0,
      selector: (row) => row.StartDate,
    },
    {
      name: "End Date",
      // grow: 0,
      center: true,
      selector: (row) => row.EndDate,
    },
    {
      name: "Current",
      // grow: 0,
      center: true,
      selector: (row) => row.IsCurrent,
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

                onClick={() => changeStatus(row.FID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit fiscal year list
  const [fiscalList, setFiscalList] = useState([]);

  useEffect(() => {
    fscList();
  }, []);

  const fscList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      Flag: "S",
      Type: "POST",
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/fiscal`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.FiscalYearlst ? result.FiscalYearlst : "";
        setFiscalList(postResult);
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
        return (
          list["Address"].toLowerCase().includes(srchQuery) ||
          list["Name"].toLowerCase().includes(srchQuery)
        );
      });

      if (srchResult) {

        setFiscalList(srchResult);
      } else {
        setFiscalList({});
      }
    } else {
      setFiscalList(originalList);
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
            <div className="text-start  page-title">Fiscal</div>
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

            <DataTable
              columns={columns}
              data={fiscalList}
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
      {fiscalPopup && (
        <FiscalPopup
          setFiscalPopup={setFiscalPopup}
          reload={reload}
          setReload={setReload}
          fscList={fscList}
          fiscalFormValue={fiscalFormValue}
          setFiscalFormValue={setFiscalFormValue}
          fiscalFormError={fiscalFormError}
          setFiscalFormError={setFiscalFormError}
          isCurrent={isCurrent}
          setIsCurrent={setIsCurrent}
        />
      )}
      {fiscalEditPopup && (
        <FiscalPopupEdit
          setFiscalEditPopup={setFiscalEditPopup}
          reload={reload}
          setReload={setReload}
          fscList={fscList}
          fiscalFormValue={fiscalFormValue}
          setFiscalFormValue={setFiscalFormValue}
          fiscalFormError={fiscalFormError}
          setFiscalFormError={setFiscalFormError}
          titleId={titleId}
          isCurrent={isCurrent}
          setIsCurrent={setIsCurrent}
        />
      )}
    </>
  );
}
