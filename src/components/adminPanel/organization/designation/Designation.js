import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DesignationPopup from "./DesignationPopup";
import DesignationEditPopup from "./DesignationEditPopup";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function Designation() {
  const { customStyles } = useContext(StaffContext);
  const { fiscalYear, todayDate, appURL, darkText } =
    useContext(UpperbarContext);
  const [designationPopup, setDesignationPopup] = useState(false);
  const [designationEditPopup, setDesignationEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const designationValue = {
    department: "",
    subdepartment: "",
    designation: "",
    maxSalary: "",
    minSalary: "",
  };
  const [designationFormValue, setDesignationFormValue] =
    useState(designationValue);
  const [designationFormError, setDesignationFormError] = useState({});

  const [chooseDepartment, setChooseDepartment] = useState("");
  const [chooseSubDepartment, setChooseSubDepartment] = useState("");

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setDesignationPopup(true);

    setDesignationFormValue(designationValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setDesignationEditPopup(true);
    setTitleID(datas.DesignationID);
    setDesignationFormValue({
      department: datas.DepartID,
      subdepartment: datas.SubDepartID,
      designation: datas.Designation,
      maxSalary: datas.MaxSal,
      minSalary: datas.MinSal,
    });
  };

  //API to hit Designation status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      DesigID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/designation`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        desgList();
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
      name: "Designation",
      // grow: 0,
      center: true,
      selector: (row) => row.Designation,
    },
    {
      name: "Department",
      center: true,
      // grow: 0,
      selector: (row) => row.Department,
    },
    {
      name: "Sub Department",
      grow: 1,
      center: true,
      selector: (row) => row.SubDepartment,
    },

    {
      name: "Staff",
      // grow: 0,
      center: true,
      selector: (row) => row.NoOfStaff,
    },
    {
      name: "Max. Sal",
      center: true,
      // grow: 0,
      selector: (row) => row.MaxSal,
    },
    {
      name: "Min. Sal",
      center: true,
      // grow: 0,
      selector: (row) => row.MinSal,
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
                onClick={() => changeStatus(row.DesignationID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit Designation list
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    desgList();
  }, [chooseDepartment, chooseSubDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: chooseDepartment,
      SubDepartID: chooseSubDepartment,
      Flag: "S",
      Status: -1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/designation`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.DesignationList ? result.DesignationList : "";
        setDesignationList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setDesignationList([]);
      }
    });
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
        setLoading(false);
      } else {
        setLoading(false);
        setDepartmentList([]);
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
      Status: 1,
      Type: "POST",
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setLoading(false);
        setSubdepartmentList(postResult);
      } else {
        setLoading(false);
        setSubdepartmentList([]);
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
        setDesignationList(srchResult);
      } else {
        setDesignationList({});
      }
    } else {
      setDesignationList(originalList);
    }
  };

  const handleChanges = (e) => {
    setChooseSubDepartment("");
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseDepartment(value);
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseSubDepartment(value);
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
              Designation
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

            {loading ? (
              <Spinner />
            ) : (
              <DataTable
                columns={columns}
                data={designationList}
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
                        onChange={handleChanges}
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
                        onChange={handleChange}
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
                          <option
                            key={item.SubDepartID}
                            value={item.SubDepartID}
                          >
                            {item.SubDepartName}
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
            )}
          </div>
        </>
      </div>
      {designationPopup && (
        <DesignationPopup
          setDesignationPopup={setDesignationPopup}
          reload={reload}
          setReload={setReload}
          desgList={desgList}
          designationFormValue={designationFormValue}
          setDesignationFormValue={setDesignationFormValue}
          designationFormError={designationFormError}
          setDesignationFormError={setDesignationFormError}
        />
      )}

      {designationEditPopup && (
        <DesignationEditPopup
          setDesignationEditPopup={setDesignationEditPopup}
          reload={reload}
          setReload={setReload}
          desgList={desgList}
          designationFormValue={designationFormValue}
          setDesignationFormValue={setDesignationFormValue}
          designationFormError={designationFormError}
          setDesignationFormError={setDesignationFormError}
          titleId={titleId}
        />
      )}
    </>
  );
}
