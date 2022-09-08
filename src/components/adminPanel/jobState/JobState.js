import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import JobContext from "./JobContext";
import AuthContext from "../../context/auth-context";
import UpperbarContext from "../../context/upperbar-context";


function JobState(props) {
  // const chhimekiURL = process.env.REACT_APP_URL_TWO;
  const { appURL } = useContext(UpperbarContext);

  const { User } = useContext(AuthContext);
  const [popup, setPopup] = useState(false);
  const [applicantPop, setApplicantPop] = useState(false);
  const [editPop, setEditPop] = useState(false);
  const [jobFormError, setJobFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEditSubmit, setIsEditSubmit] = useState(false);
  const [loading, setLoading] = useState(true);


  const jobvalue = {
    department: "",
    subDepartment: "",
    designation: "",
    shifts: "",
    shiftType: "",
    jobType: "",
    title: "",
    description: "",
    responsibility: "",
    position: "",
    education: "",
    experience: "",
    startDate: "",
    endDate: "",
    salary: "",
    interviewDate: "",
  };

  const [jobFormValue, setJobFormValue] = useState(jobvalue);
  const [image, setImage] = useState("")
  const [isUploaded, setIsUploaded] = useState(false);
  const [typeFile, setTypeFile] = useState("");

  const [originalList, setOriginalList] = useState(null);
  const [searchList, setSearchList] = useState(null);
  const [negotiable, setNegotiable] = useState(false);


  const [chooseDepartment, setChooseDepartment] = useState("-1");
  const [chooseSubDepartment, setChooseSubDepartment] = useState("-1");
  const [chooseDesignation, setChooseDesignation] = useState("-1");
  const [chooseShift, setChooseShift] = useState("-1");
  const [chooseShiftType, setChooseShiftType] = useState("-1");
  const [chooseJobType, setChooseJobType] = useState("-1");

  const [jobStatus, setJobStatus] = useState("")


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
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/department`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.list ? result.list : "";
        setLoading(false);
        setDepartmentList(postResult);
        setOriginalList(postResult);
      } else {
        setLoading(false);

      }
    });
  };


  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [jobFormValue.department]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: jobFormValue.department,
      Flag: "S",
      Type: "POST",
      Status: -1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/sub-department`,
    };

    Fetchdata(params).then(function (result) {

      if (result.StatusCode === 200) {
        const postResult = result.SubDepList ? result.SubDepList : "";
        setLoading(false);
        setSubdepartmentList(postResult);
        setOriginalList(postResult);
      } else {
        setLoading(false);
        setSubdepartmentList([]);

      }
    });
  };


  //API to hit Designation list
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    desgList();
  }, [jobFormValue.department, jobFormValue.subDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: jobFormValue.department,
      SubDepartID: jobFormValue.subDepartment,
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
      Status: "1",
      BranchID: User.BranchId.toString(),
      Type: "POST",
      FetchURL: `${appURL}api/admin/shift`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.ShiftList ? result.ShiftList : "";
        setShiftList(postResult);
      } else {
        setShiftList([]);

      }
    });
  };





















  //API to hit Job List


  const [jobList, setJobList] = useState([])

  useEffect(() => {
    getJobList();
  }, [chooseDepartment, chooseSubDepartment, chooseDesignation, chooseShift, chooseShiftType, chooseJobType]);

  const getJobList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "S",
      DepartID: chooseDepartment,
      SubDepartID: chooseSubDepartment,
      DesignationID: chooseDesignation,
      ShiftID: chooseShift,
      ShiftTypeID: chooseShiftType,
      JobTypeID: chooseJobType,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      Type: "POST",
      FetchURL: `${appURL}api/admin/job`,
    };
    console.log(params)

    Fetchdata(params).then(function (result) {
      console.log(result)

      if (result.StatusCode === 200) {
        const postResult = result.JobInfo ? result.JobInfo : "";
        setLoading(false);
        setJobList(postResult);
        setOriginalList(postResult);
      } else {
        setJobList([]);
      }
    });
  }

  const [titleId, setTitleID] = useState()

  const handleEdit = (datas) => {
    setEditPop(true);
    setTitleID(datas.JobID)
    easyList();
  }

  //API to hit Job Info

  // const [staffInfoList, setStaffInfoList] = useState([])

  useEffect(() => {
    easyList();
  }, [titleId]);

  const easyList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "SI",
      JobID: titleId,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/job`,
      Type: "POST"
    };
    console.log(params)

    Fetchdata(params).then(function (result) {
      console.log("info info", result)
      if (result.StatusCode === 200) {
        const data = result.JobInfo[0] ? result.JobInfo[0] : "";

        setJobFormValue({
          department: data.DepartID,
          subDepartment: data.SubDepartID,
          designation: data.DesignationID,
          shifts: data.ShiftID,
          shiftType: data.ShiftTypeID,
          jobType: data.JobTypeID,
          title: data.Title,
          description: data.Description,
          responsibility: data.Responsibility,
          position: data.NoPos,
          education: data.Education,
          experience: data.Experience,
          startDate: data.StartDate,
          endDate: data.EndDate,
          salary: data.Salary,
          interviewDate: data.InterviewDate,
        })
        // setImage(data.Banner)
        setNegotiable(data.IsNegID)

      } else {


      }
    });
  }


  //API to hit Job status


  const changeStatus = (data) => {
    console.log(data)
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      Flag: "UJS",
      JobID: data[0],
      JobStatus: data[1],
      FetchURL: `${appURL}api/admin/job`,
      Type: "POST",
    }

    console.log(dataForm)
    Fetchdata(dataForm).then(function (result) {

      if (result.StatusCode === 200) {
        getJobList();

        // toast(result.Message, {
        //   style: {
        //     color: "green",
        //     fontSize: "13px",
        //   },
        // });

      }
      // else {
      //   toast("Error: " + result.Message, {
      //     style: {
      //       color: "red",
      //       fontSize: "13px",
      //     },
      //   });

      // }
    });
  }


  const [forID, setForID] = useState("")

  const addApplicant = (datas) => {
    setApplicantPop(true);
    setForID(datas)
  };

  // API to hit applicant list

  const [applicantList, setApplicantList] = useState([])

  useEffect(() => {
    getApplicantList();
  }, [forID]);

  const getApplicantList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "S",
      JobID: forID,
      Type: "POST",
      FetchURL: `${appURL}api/admin/job-applicant`,
    };
    console.log(params)

    Fetchdata(params).then(function (result) {
      console.log(result)

      if (result.StatusCode === 200) {
        const postResult = result.JobApplicantlst ? result.JobApplicantlst : "";
        setLoading(false);
        setApplicantList(postResult);
        setSearchList(postResult);
      } else {
        setApplicantList([]);
      }
    });
  }




  return (
    <JobContext.Provider
      value={{
        jobFormValue, setJobFormValue, jobvalue, popup, setPopup, jobFormError, setJobFormError, isSubmit, setIsSubmit, loading, setLoading, applicantPop, setApplicantPop, applicantList,
        image, setImage, isUploaded, setIsUploaded, typeFile, setTypeFile,
        negotiable, setNegotiable, editPop, setEditPop, isEditSubmit, setIsEditSubmit, originalList, setOriginalList, departmentList, subdepartmentList, designationList, shiftList, jobList, getJobList, handleEdit, titleId, changeStatus, setJobList, setApplicantList, searchList,
        chooseDepartment, setChooseDepartment, chooseSubDepartment, setChooseSubDepartment,
        chooseDesignation, setChooseDesignation, chooseShift, setChooseShift, chooseShiftType, setChooseShiftType, chooseJobType, setChooseJobType, addApplicant, jobStatus, setJobStatus
      }}
    >
      {props.children}
    </JobContext.Provider>
  );
}
export default JobState;
