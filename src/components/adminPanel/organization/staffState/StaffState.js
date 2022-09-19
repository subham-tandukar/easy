import React, { useState, useEffect, useContext } from "react";
import StaffContext from "./StaffContext";
import { Fetchdata } from "../../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../../context/auth-context";
import UpperbarContext from "../../../context/upperbar-context";
import { defaultThemes } from "react-data-table-component";
// import { getBoundingClientObj } from "react-select/dist/declarations/src/utils";
import { GetEnglishDate } from "../../../hooks/dateConvertor";
function StaffState(props) {
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);

  const [staffPopup, setStaffPopup] = useState(false);
  const [staffEditPopup, setStaffEditPopup] = useState(false);
  const [currentStep, setStep] = useState(1);
  const [isSubmit, setIsSubmit] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const [editIsSubmit, setEditIsSubmit] = useState(false);
  const [editFinalSubmit, setEditFinalSubmit] = useState(false);

  const [originalList, setOriginalList] = useState(null);

  const [chooseDepartment, setChooseDepartment] = useState("");
  const [chooseSubDepartment, setChooseSubDepartment] = useState("");
  const [chooseDesignation, setChooseDesignation] = useState("");

  const [loading, setLoading] = useState(false);

  // for notification starts

  const initialvalue = {
    all: "",
    department: "",
    subDepartment: "",
    staff: "",
    designation: "",
    title: "",
    description: "",
    actionButton: "",
    actionUrl: "",
    pubDate: "",
  };

  const [notificationErrors, setNotificationErrors] = useState({});
  const [notificationValues, setNotificationValues] = useState(initialvalue);
  const [notificationPopup, setNotificationPopup] = useState(false);

  const [notificationList, setNotificationList] = useState([]);
  const [DFlag, setDFlag] = useState("N");
  const [notifyOriginalList, setNotifyOriginalList] = useState(null);

  const [chooseNotifyDepartment, setChooseNotifyDepartment] = useState("");
  const [chooseNotifySubDepartment, setChooseNotifySubDepartment] =
    useState("");
  const [chooseNotifyDesignation, setChooseNotifyDesignation] = useState("");
  const [chooseNotifyFlag, setChooseNotifyFlag] = useState("");

  useEffect(() => {
    notifyList();
  }, [
    chooseNotifyDepartment,
    chooseNotifySubDepartment,
    chooseNotifyDesignation,
    chooseNotifyFlag,
  ]);

  const notifyList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      Flag: "S",
      NFlag: chooseNotifyFlag,
      UserID: User.UID,
      DepartmentID: chooseNotifyDepartment,
      SubDepartmentID: chooseNotifySubDepartment,
      DesignationID: chooseNotifyDesignation,
      BranchID: User.BranchId,
      Status: "-1",
      FetchURL: `${appURL}api/admin/notification`,
      Type: "POST",
    };

    Fetchdata(params).then(function (resp) {
      console.log("res", resp);
      if (resp.StatusCode === 200) {
        const postResult = resp.NotificationList ? resp.NotificationList : "";
        setLoading(false);
        setNotificationList(postResult);
        setNotifyOriginalList(postResult);
        console.log("result", postResult);
      } else {
        setNotificationList([]);
        setLoading(false);
      }
    });
  };

  // sessionStorage.setItem("NotificationList", JSON.stringify(notificationList));
  // console.log("notify", notificationList);

  const [perID, setPerId] = useState();
  const [editPopup, setEditPopup] = useState(false);
  const handleEdit = (data) => {
    setPerId(data.NotificationID);
    setNotificationValues({
      title: data.Title,
      all: data.NFlag,
      department: data.DepartmentID,
      subDepartment: data.SubDepartmentID,
      designation: data.DesignationID,
      description: data.Description,
      actionButton: data.AcBtn,
      actionUrl: data.AcUrl,
      pubDate: data.PublishedDate,
    });
    setImage(data.Image);
    setEditPopup(true);
    console.log(perID);
  };

  // to edit notification
  const editdata = () => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      Flag: "U",
      NFlag: notificationValues.all !== " " ? notificationValues.all : " ",
      UserID: User.UID,
      NotificationID: perID,
      Title: notificationValues.title !== " " ? notificationValues.title : " ",
      Description:
        notificationValues.description !== " "
          ? notificationValues.description
          : " ",
      Image: image !== null ? image.split(",")[1] : "",
      AcBtn:
        notificationValues.actionButton !== " "
          ? notificationValues.actionButton
          : " ",
      AcUrl:
        notificationValues.actionUrl !== " "
          ? notificationValues.actionUrl
          : " ",
      PublishedDate:
        DFlag === "N"
          ? GetEnglishDate(notificationValues.pubDate)
          : notificationValues.pubDate,

      DepartmentID:
        notificationValues.department !== " "
          ? notificationValues.department
          : " ",
      SubDepartmentID:
        notificationValues.subDepartment !== " "
          ? notificationValues.subDepartment
          : " ",
      DesignationID:
        notificationValues.designation !== " "
          ? notificationValues.designation
          : " ",
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/notification`,
      Type: "POST",
    };
    Fetchdata(dataForm).then(function (resp) {
      console.log("data", resp);
      if (resp.StatusCode === 200) {
        setEditPopup(false);
        notifyList();
        toast(resp.Message, {
          style: {
            color: "green",
            fontSize: "13px",
          },
        });
      } else {
        toast("Error: " + resp.Message, {
          style: {
            color: "red",
            fontSize: "13px",
          },
        });
      }
    });
  };

  // to hit notification status
  const stat = [];
  const [newStatus, setNewStatus] = useState(stat);

  const deactivateNotify = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      NotificationID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/notification`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        notifyList();
        let statsN = JSON.parse(JSON.stringify(newStatus));
        let pitchStatus;

        if (dataForm.Status === 1) {
          pitchStatus = "Activated";
        } else if (dataForm.Status === 0) {
          pitchStatus = "Deactivated";
        }
        setNewStatus(statsN);
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

  // for notification ends

  const staffValue = {
    firstName: "",
    middleName: "",
    lastName: "",
    userID: "",
    userCode: "",
    deviceCode: "",
    mobileCode: "",
    userName: "",
    password: "",
    email: "",
    contact: "",
    phone: "",
    address: "",
    district: "",
    dateOfBirth: "",
    citizenshipNo: "",
    pan: "",
    gender: "",
    blood: "",
    religion: "",
    marital: "",
    enrollDate: "",
    leaveDate: "",
    jobType: "",
    selectShift: "",
    shiftType: "",
    grade: "",
    department: "",
    subDepartment: "",
    designation: "",
    days: "",
  };

  const [staffFormValue, setStaffFormValue] = useState(staffValue);
  const [staffFormError, setStaffFormError] = useState({});

  const [isUploaded, setIsUploaded] = useState(false);
  const [typeFile, setTypeFile] = useState("");
  const [image, setImage] = useState("");

  const [checkedList, setCheckedList] = useState([]);
  const [managerChecked, setManagerChecked] = useState(false);
  const [notWorking, setNotWorking] = useState(false);

  // css for table other than hami chhimeki, client management, espay and cooperative

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "10px",
          borderRightColor: defaultThemes.default.divider.default,
        },
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
    cells: {
      style: {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
    rows: {
      style: {
        height: "17px",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f2f0f0",
        borderBottomColor: "#FFFFFF",
        outline: "1px solid #FFFFFF",
        fontWeight: "650",
      },
    },
  };

  const customStylesForImage = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "10px",
          borderRightColor: defaultThemes.default.divider.default,
        },
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
    cells: {
      style: {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: defaultThemes.default.divider.default,
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "#f2f0f0",
        borderBottomColor: "#FFFFFF",
        outline: "1px solid #FFFFFF",
        fontWeight: "650",
      },
    },
  };

  //customstyles end

  //API to hit Staff list
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    stfList();
  }, [chooseDepartment, chooseSubDepartment, chooseDesignation]);

  const stfList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: "-1",
      Flag: "S",
      Department: chooseDepartment,
      SubDepartment: chooseSubDepartment,
      Designation: chooseDesignation,
      Status: -1,
      BranchID: User.BranchId,
      Type: "POST",
      FetchURL: `${appURL}api/admin/user`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.UserList ? result.UserList : "";
        setStaffList(postResult);
        setOriginalList(postResult);
        setLoading(false);
      } else {
        setLoading(false);
        setStaffList([]);
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
      } else {
      }
    });
  };

  // API to hit Sub-Department list
  const [subdepartmentList, setSubdepartmentList] = useState([]);

  useEffect(() => {
    subdeptList();
  }, [staffFormValue.department]);

  const subdeptList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: staffFormValue.department,
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

  //API to hit Designation list
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    desgList();
  }, [staffFormValue.department, staffFormValue.subDepartment]);

  const desgList = () => {
    const params = {
      ComID: User.CompanyId,
      StaffID: -1,
      DepartID: staffFormValue.department,
      SubDepartID: staffFormValue.subDepartment,
      Flag: "S",
      Type: "POST",
      Status: 1,
      BranchID: User.BranchId,
      FetchURL: `${appURL}api/admin/designation`,
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const postResult = result.DesignationList ? result.DesignationList : "";
        setDesignationList(postResult);
      } else {
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

  const [titleId, setTitleID] = useState();
  const editPop = (datas) => {
    setTitleID(datas.UID);
    setStaffEditPopup(true);
  };

  // API to get staff info

  const [staffInfoList, setStaffInfoList] = useState([]);

  useEffect(() => {
    easyList();
  }, [titleId]);

  const easyList = () => {
    const params = {
      ComID: User.CompanyId,
      UID: titleId,
      Flag: "si",
      FetchURL: `${appURL}api/admin/user`,
      Type: "POST",
    };

    Fetchdata(params).then(function (result) {
      if (result.StatusCode === 200) {
        const data = result.UserList[0] ? result.UserList[0] : "";
        setStaffFormValue({
          firstName: data.FirstName,
          middleName: data.MiddleName,
          lastName: data.LastName,
          userID: data.UserID,
          userCode: data.UserCode,
          deviceCode: data.DeviceCode,
          mobileCode: data.MobileID,
          userName: data.UserName,
          email: data.Email,
          contact: data.Contact,
          phone: data.Phone,
          address: data.Address,
          district: data.DistrictID,
          dateOfBirth: data.DateOfBirth,
          citizenshipNo: data.CitizenshipNo,
          pan: data.PAN,
          gender: data.GenderID,
          blood: data.BloodGroupID,
          religion: data.ReligionID,
          marital: data.MaritialStatusID,
          enrollDate: data.EnrollDate,
          leaveDate: data.LeaveDate,
          jobType: data.JobTypeID,
          selectShift: data.ShiftID,
          shiftType: data.ShiftTypeID,
          grade: data.GradeID,
          department: data.DepartmentID,
          subDepartment: data.SubDepartmentID,
          designation: data.DesignationID,
          days: data.WorkingDays,
        });

        setImage(data.Image);
        setManagerChecked(data.IsManager);
        setNotWorking(data.WorkingStatusID);
      } else {
      }
    });
  };

  //API to hit Staff status

  const stateInitial = [];
  const [newStat, setNewStat] = useState(stateInitial);

  const deactivateDepart = (ID, IsActive) => {
    const dataForm = {
      ComID: User.CompanyId,
      StaffID: User.UID,
      UID: ID,
      Flag: "US",
      Status: IsActive,
      BranchID: User.BranchId,
      FiscalID: User.FiscalId,
      FetchURL: `${appURL}api/admin/user`,
      Type: "POST",
    };
    if (IsActive === 1) {
      dataForm.Status = 0;
    } else {
      dataForm.Status = 1;
    }
    Fetchdata(dataForm).then(function (result) {
      if (result.StatusCode === 200) {
        stfList();
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

  return (
    <StaffContext.Provider
      value={{
        staffPopup,
        setStaffPopup,
        staffEditPopup,
        setStaffEditPopup,
        currentStep,
        setStep,
        staffFormValue,
        setStaffFormValue,
        staffFormError,
        setStaffFormError,
        staffValue,
        isUploaded,
        setIsUploaded,
        typeFile,
        setTypeFile,
        image,
        setImage,
        checkedList,
        setCheckedList,
        managerChecked,
        setManagerChecked,
        notWorking,
        setNotWorking,
        isSubmit,
        setIsSubmit,
        finalSubmit,
        setFinalSubmit,
        staffList,
        departmentList,
        designationList,
        subdepartmentList,
        editIsSubmit,
        setEditIsSubmit,
        editFinalSubmit,
        setEditFinalSubmit,
        editPop,
        titleId,
        deactivateDepart,
        stfList,
        originalList,
        setOriginalList,
        setStaffList,
        chooseDepartment,
        setChooseDepartment,
        chooseSubDepartment,
        setChooseSubDepartment,
        chooseDesignation,
        setChooseDesignation,
        shiftList,
        loading,
        setLoading,
        customStyles,
        customStylesForImage,
        notificationList,
        setNotificationList,
        notificationValues,
        setNotificationValues,
        notificationErrors,
        setNotificationErrors,
        notificationPopup,
        setNotificationPopup,
        notifyList,
        handleEdit,
        DFlag,
        setDFlag,
        editdata,
        setEditPopup,
        editPopup,
        deactivateNotify,
        chooseNotifyDepartment,
        chooseNotifySubDepartment,
        chooseNotifyDesignation,
        chooseNotifyFlag,
        setChooseNotifyDepartment,
        setChooseNotifyDesignation,
        setChooseNotifyFlag,
        setChooseNotifySubDepartment,
        notifyOriginalList,
        // fetchNotification,
        // image1,
        // setImage1,
      }}
    >
      {props.children}
    </StaffContext.Provider>
  );
}
export default StaffState;
