import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../loading/spinner";
import JobPopup from "./JobPopup";
import JobEditPopup from "./JobEditPopup";
import UpperbarContext from "../../../context/upperbar-context";
import StaffContext from "../staffState/StaffContext";

export default function JobInformation() {
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext)
  const [jobPopup, setJobPopup] = useState(false);
  const [jobEditPopup, setJobEditPopup] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const jobValue = {
    department: "",
    subDepartment: "",
    staff: "",
    designation: "",
    grade: "",
    job: "",
    startDate: "",
    endDate: "",
  };
  const [jobFormValue, setJobFormValue] = useState(jobValue);
  const [jobFormError, setJobFormError] = useState({});

  const [chooseDepartment, setChooseDepartment] = useState("");
  const [chooseSubDepartment, setChooseSubDepartment] = useState("");
  const [chooseStaff, setChooseStaff] = useState("");

  const [notWorking, setNotWorking] = useState(false);

  const { User } = useContext(AuthContext);

  const addLeaveNote = (e) => {
    setJobPopup(true);

    setJobFormValue(jobValue);
  };

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {

    setJobEditPopup(true);
    setTitleID(datas.JobID);
    setJobFormValue({
      department: datas.DepartmentID,
      subDepartment: datas.SubDepartmentID,
      designation: datas.DesignationID,
      staff: datas.UserID,
      grade: datas.GradeID,
      job: datas.JobID,
      startDate: datas.StartDate,
      endDate: datas.EndDate,
    });
    setNotWorking(datas.WorkingStatusID);
  };

  //API to hit Job Info status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      JobID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/u-job-inf`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {
        jobInfoList();
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
      center: true,
      // grow: 0,
      selector: (row) => row.SubDepartment,
    },
    {
      name: "Job Type",
      center: true,
      // grow: 0,
      selector: (row) => row.JobType,
    },
    {
      name: "Grade",
      center: true,
      // grow: 0,
      selector: (row) => row.Grade,
    },
    {
      name: "From Date",
      center: true,
      // grow: 0,
      selector: (row) => row.StartDate,
    },
    {
      name: "To Date",
      center: true,
      // grow: 0,
      selector: (row) => row.EndDate,
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

                onClick={() => changeStatus(row.JobID, row.Status)}
              >
                {checkStatus(row.Status)}
              </button>
            </div>
          </>
        );
      },
    },
  ];

  //API to hit Job list
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    jobInfoList();
  }, [chooseStaff]);

  const jobInfoList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      Flag: "S",
      UserID: chooseStaff,
      BranchiD: User.BranchId,
      Status: -1,
      Type: "POST",
      FetchURL: `${appURL}api/admin/u-job-inf`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.JobInfo ? result.JobInfo : "";
        setJobList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setJobList([]);
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
        setStaffList([]);

      }
    });
  }, [chooseDepartment, chooseSubDepartment]);

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {

      let srchResult = originalList.filter((list) => {
        return (
          list["Designation"].toLowerCase().includes(srchQuery) ||
          list["Department"].toLowerCase().includes(srchQuery) ||
          list["SubDepartment"].toLowerCase().includes(srchQuery)
        );
      });

      if (srchResult) {

        setJobList(srchResult);
      } else {
        setJobList({});
      }
    } else {
      setJobList(originalList);
    }
  };

  const handleChanges = (e) => {
    setChooseSubDepartment("");
    setChooseStaff("");
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseDepartment(value);
  };

  const handleChange = (e) => {
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
            <div className="text-start  page-title">Job Information</div>
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
                data={jobList}
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
            )}
          </div>
        </>
      </div>
      {jobPopup && (
        <JobPopup
          setJobPopup={setJobPopup}
          reload={reload}
          setReload={setReload}
          jobInfoList={jobInfoList}
          jobFormValue={jobFormValue}
          setJobFormValue={setJobFormValue}
          jobFormError={jobFormError}
          setJobFormError={setJobFormError}
          notWorking={notWorking}
          setNotWorking={setNotWorking}
        />
      )}

      {jobEditPopup && (
        <JobEditPopup
          setJobEditPopup={setJobEditPopup}
          reload={reload}
          setReload={setReload}
          jobInfoList={jobInfoList}
          jobFormValue={jobFormValue}
          setJobFormValue={setJobFormValue}
          jobFormError={jobFormError}
          setJobFormError={setJobFormError}
          titleId={titleId}
        />
      )}
    </>
  );
}
