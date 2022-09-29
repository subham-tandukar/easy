import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";

import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BankPopup from "./BankPopup";
import BankPopupEdit from "./BankPopupEdit";

import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Bank() {
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);
  const [bankPopup, setBankPopup] = useState(false);
  const [bankEditPopup, setBankEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const [chooseDepartment, setChooseDepartment] = useState("");
  const [chooseSubDepartment, setChooseSubDepartment] = useState("");
  const [chooseStaff, setChooseStaff] = useState("");

  const bankValue = {
    department: "",
    subDepartment: "",
    staff: "",
    bank: "",
    accountName: "",
    accountNo: "",
    branch: "",
  };
  const [bankFormValue, setBankFormValue] = useState(bankValue);
  const [bankFormError, setBankFormError] = useState({});

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setBankPopup(true);
    setBankFormValue(bankValue);
  };

  const handleDepartment = (e) => {
    setChooseStaff("");
    setChooseSubDepartment("");

    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseDepartment(value);
  };

  const handleSubDepartment = (e) => {
    setChooseStaff("");
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseSubDepartment(value);
  };

  const handleStaff = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseStaff(value);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setBankEditPopup(true);
    setTitleID(datas.BankID);
    setBankFormValue({
      // department: datas.,
      // subDepartment: datas.,
      // staff: datas.,
      bank: datas.BankName,
      accountName: datas.AcName,
      accountNo: datas.AcNo,
      branch: datas.Branch,
    });
  };

  //API to hit Bank status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      UserID: chooseStaff,
      BankID: ID,
      Flag: "US",
      Status: IsActive,
      FetchURL: `${appURL}api/admin/u-bank`,
      Type: "POST",
    };

    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        bnkList();
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

  // const changeStatus = (ID, IsActive) => {
  //     deactivateDepart(ID, IsActive);
  // };

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
      name: "Bank",
      center: true,
      // grow: 0,
      selector: (row) => row.BankName,
    },
    {
      name: "Account Name",
      center: true,
      // grow: 0,
      selector: (row) => row.AcName,
    },
    {
      name: "Account Number",
      // grow: 0,
      center: true,
      selector: (row) => row.AcNo,
    },
    {
      name: "Branch",
      // grow: 0,
      center: true,
      selector: (row) => row.Branch,
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
                onClick={() => deactivateDepart(row.BankID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit Bank list
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    bnkList();
  }, [chooseStaff]);

  const bnkList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      UserID: chooseStaff,
      Flag: "S",
      Type: "POST",
      Status: -1,
      // BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/u-bank`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.BankLst ? result.BankLst : "";
        setBankList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setBankList([]);
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
          list["BankName"].toLowerCase().includes(srchQuery) ||
          list["AcName"].toLowerCase().includes(srchQuery)
        );
      });

      if (srchResult) {
        setBankList(srchResult);
      } else {
        setBankList({});
      }
    } else {
      setBankList(originalList);
    }
  };

  //API to hit Department list
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    deptList();
  }, []);

  const deptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "S",
      Type: "POST",
      Status: 1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setDepartmentList(postResult);
      } else {
      }
    });
  };

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [chooseDepartment]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseDepartment,
      Flag: "S",
      Type: "POST",
      Status: 1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setSubdepartmentList(postResult);
      } else {
        setSubdepartmentList([]);
      }
    });
  };

  //API to get staff list

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const dataForm = {
      FetchURL: `${appURL}api/org-staff?ComID=${User.CompanyId}&BranchID=${User.BranchId}&DepartmentId=${chooseDepartment}&SubDepartmentId=${chooseSubDepartment}`,
      Type: "GET",
    };

    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.OrganizationStaffs;
        setStaffList(postResult);
      } else {
      }
    });
  }, [chooseDepartment, chooseSubDepartment]);

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
              Bank
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
              data={bankList}
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
                  <div className="upper-dataTbl me-2">
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseDepartment}
                      onChange={handleDepartment}
                      className="form-control form-control-sm searchField"
                    >
                      <option
                        value=""
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Department
                      </option>
                      {departmentList.map((item) => (
                        <option
                          key={item.DepartmentID}
                          value={item.DepartmentID}
                        >
                          {item.Department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="upper-dataTbl me-2">
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseSubDepartment}
                      onChange={handleSubDepartment}
                      className="form-control form-control-sm searchField"
                    >
                      <option
                        value=""
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Sub Department
                      </option>
                      {subdepartmentList.map((item) => (
                        <option key={item.SubDepartID} value={item.SubDepartID}>
                          {item.SubDepartName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="upper-dataTbl me-2">
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseStaff}
                      onChange={handleStaff}
                      className="form-control form-control-sm searchField"
                    >
                      <option
                        value=""
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Staff
                      </option>
                      {staffList.map((item) => (
                        <option key={item.StaffId} value={item.StaffId}>
                          {item.StaffName}
                        </option>
                      ))}
                    </select>
                  </div>
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
      {bankPopup && (
        <BankPopup
          setBankPopup={setBankPopup}
          reload={reload}
          setReload={setReload}
          bnkList={bnkList}
          bankFormValue={bankFormValue}
          setBankFormValue={setBankFormValue}
          bankFormError={bankFormError}
          setBankFormError={setBankFormError}
        />
      )}
      {bankEditPopup && (
        <BankPopupEdit
          setBankEditPopup={setBankEditPopup}
          reload={reload}
          setReload={setReload}
          bnkList={bnkList}
          bankFormValue={bankFormValue}
          setBankFormValue={setBankFormValue}
          bankFormError={bankFormError}
          setBankFormError={setBankFormError}
          chooseStaff={chooseStaff}
          titleId={titleId}
        />
      )}
    </>
  );
}
