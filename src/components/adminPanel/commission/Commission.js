import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";
import UpperbarContext from "../../context/upperbar-context";
import CommissionContext from "../commissionState/CommissionContext";
import CommissionPopup from "./CommissionPopup";
import StaffContext from "../organization/staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Commission() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);

  const {
    setPopup,
    setCommissionFormValue,
    commissionvalue,
    originalList,
    popup,
    commissionList,
    setCommissionList,
    inputFields,
    setInputFields,
    chooseGateway,
    setChooseGateway,
    updatedata,
    setCatId,
  } = useContext(CommissionContext);

  const searchInput = useRef("");

  const addLeaveNote = (e) => {
    setPopup(true);

    setCommissionFormValue(commissionvalue);
  };
  const update = (e) => {
    e.preventDefault();

    updatedata();
  };

  const handleGateway = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseGateway(value);
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },

    {
      name: "Operator",
      // grow: 0,
      center: true,
      selector: (row) => row.operatorName,
    },

    {
      name: "Commission Type",
      // grow: 0,
      center: true,
      selector: (row) => (row.catType === "P" ? "Percentage" : "Flat"),
    },
    {
      name: "Rate",
      center: true,
      // grow: 0,
      cell: (row) => {
        let list = row.operatorName;

        return (
          <>
            <div>
              <input
                type="number"
                name={list}
                onChange={(e) => handleFormChange([row, e.target.value, e])}
                className="form-control form-control-sm"
                style={{ width: "70px" }}
                min="0"
                max={row.catType === "P" ? row.pRate : row.fRate}
                step="0.1"
                defaultValue={row.catType === "P" ? row.pRate : row.fRate}
              />
            </div>
          </>
        );
      },
    },
  ];

  const handleFormChange = (data) => {
    setCatId(data[0].categoryId);

    let getId = data[0].operatorName;
    let optName = getId;

    let indexList = inputFields
      ? inputFields.findIndex((list) => list.operatorName === optName)
      : -1;

    if (indexList < 0) {
      setInputFields([
        ...inputFields,
        {
          operatorName: optName,
          categoryType: data[0].catType,
          flatRate: data[0].catType === "F" ? data[1] : 0,
          percentageRate: data[0].catType === "P" ? data[1] : 0,
        },
      ]);
    } else {
      if (data[0].catType === "F") {
        inputFields[indexList].flatRate = data[1];
      } else if (data[0].catType === "P") {
        inputFields[indexList].percentageRate = data[1];
      }
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["operatorName"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setCommissionList(srchResult);
      } else {
        setCommissionList({});
      }
    } else {
      setCommissionList(originalList);
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
              Commission Setup
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
              data={commissionList}
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
                  <div className="upper-dataTbl mx-2">
                    <label style={darkText} className="d-block uk-text-left">
                      Gateway
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseGateway}
                      onChange={handleGateway}
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                    >
                      <option
                        value=""
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Gateway
                      </option>
                      <option value="ESWEA">eSewa</option>
                      <option value="PAYPOINT">Paypoint</option>
                      <option value="KHALTI">Khalti</option>
                      <option value="NEPS">Neps</option>
                    </select>
                  </div>

                  <div className="upper-dataTbl me-2">
                    <button
                      type="button"
                      class="btn btn-sm"
                      style={{
                        background: "var(--button-color)",
                        color: "white",
                      }}
                      onClick={update}
                    >
                      Update
                    </button>
                  </div>
                </>
              }
            />
          </div>
        </>
      </div>

      {popup && <CommissionPopup />}
    </>
  );
}
