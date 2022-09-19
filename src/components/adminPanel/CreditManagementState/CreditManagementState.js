import React, { useState, useEffect, useContext } from "react";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
import CryptoJS from "crypto-js";
import CreditManagementContext from "./CreditManagementContext";
import AuthContext from "../../context/auth-context";

function CreditManagementState(props) {
  const apisignature = process.env.REACT_APP_SIGNATURE;
  const { reactURL } = useContext(CooperativeContext);
  const { User } = useContext(AuthContext);
  const [approveStatusFormError, setApproveStatusFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const approvestatusvalue = {
    remarks: "",
  };

  const [approveStatusFormValue, setApproveStatusFormValue] =
    useState(approvestatusvalue);

  const [rejectStatusFormError, setRejectStatusFormError] = useState({});
  const [rejectIsSubmit, setRejectIsSubmit] = useState(false);
  const rejectstatusvalue = {
    remarks: "",
  };

  const [rejectStatusFormValue, setRejectStatusFormValue] =
    useState(rejectstatusvalue);

  //All about credit Management List

  const [originalList, setOriginalList] = useState("");
  const [chooseCooperative, setChooseCooperative] = useState("");
  const [status, setStatus] = useState("");

  const [creditList, setCreditList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreditList();
  }, [chooseCooperative, status]);

  const getCreditList = () => {
    const dataForm = {
      CoOperativeCode: chooseCooperative,
      UserName: User.Username,
      isApprove: status,
      Flag: "s",
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForm),
    };
    fetch(
      `${reactURL}MblPayPanel/CoOperative/CreditManagement`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        console.log(resp);

        if (resp.statuS_CODE === "0") {
          const postResult = resp.creditLst ? resp.creditLst : "";
          setLoading(false);
          setCreditList(postResult);
        } else {
          setCreditList([]);
        }
      });
    });
  };

  //Everything to pop up and approve the slider list
  const [approvePopup, setApprovePopup] = useState({
    show: false, // initial values set to false and null
    data: null,
  });

  const [rejectPopup, setRejectPopup] = useState({
    show: false, // initial values set to false and null
    data: null,
  });

  // To approve the credit List

  const [Acdata, setACData] = useState();

  const handleApprove = async (data) => {
    setACData(data);

    setApprovePopup({
      show: true,
      data,
    });
  };

  // This will perform the approve and hide the Confirmation Box

  const handleApproveTrue = () => {
    const dataForm = {
      Flag: "a",
      CoOperativeCode: chooseCooperative,
      UserName: User.Username,
      isApprove: "1",
      Remarks: approveStatusFormValue.remarks,
      ApproveBy: User.Username,
      SerialNum: Acdata,
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };

    console.log(dataForm);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForm),
    };
    fetch(
      `${reactURL}MblPayPanel/CoOperative/CreditManagement`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          getCreditList();
          toast(resp.message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          toast(resp.message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      });
    });
    setApprovePopup({
      show: false,
      data: null,
    });
    setApproveStatusFormValue(approvestatusvalue);
    setApproveStatusFormError({});
  };

  // This will just hide the Confirmation Box when user clicks "No"/"Cancel"

  const handleApproveFalse = () => {
    setApprovePopup({
      show: false,
      data: null,
    });
    setApproveStatusFormValue(approvestatusvalue);
    setApproveStatusFormError({});
  };

  //Everything to pop up and approve the credit list ends

  // To reject the credit List

  const [bcdata, setBcData] = useState();

  const handleReject = async (data) => {
    setBcData(data);

    setRejectPopup({
      show: true,
      data,
    });
  };

  // This will perform the deletion and hide the Confirmation Box

  const handleRejectTrue = () => {
    const dataForm = {
      Flag: "a",
      CoOperativeCode: chooseCooperative,
      UserName: User.Username,
      isApprove: "2",
      Remarks: rejectStatusFormValue.remarks,
      ApproveBy: User.Username,
      SerialNum: bcdata,
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForm),
    };
    fetch(
      `${reactURL}MblPayPanel/CoOperative/CreditManagement`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          getCreditList();
          toast(resp.message, {
            style: {
              color: "green",
              fontSize: "13px",
            },
          });
        } else {
          toast(resp.message, {
            style: {
              color: "red",
              fontSize: "13px",
            },
          });
        }
      });
    });
    setRejectPopup({
      show: false,
      data: null,
    });
    setRejectStatusFormValue(rejectstatusvalue);
    setRejectStatusFormError({});
  };

  //
  // };

  // This will just hide the Confirmation Box when user clicks "No"/"Cancel"

  const handleRejectFalse = () => {
    setRejectPopup({
      show: false,
      data: null,
    });
    setRejectStatusFormValue(rejectstatusvalue);
    setRejectStatusFormError({});
  };

  return (
    <CreditManagementContext.Provider
      value={{
        // getCredit,
        getCreditList,
        approvePopup,
        setApprovePopup,
        handleApprove,
        handleApproveTrue,
        handleApproveFalse,
        handleRejectFalse,
        handleRejectTrue,
        handleReject,
        rejectPopup,
        originalList,
        setOriginalList,
        chooseCooperative,
        setChooseCooperative,
        status,
        setStatus,
        creditList,
        setCreditList,
        approveStatusFormError,
        setApproveStatusFormError,
        isSubmit,
        setIsSubmit,
        approvestatusvalue,
        approveStatusFormValue,
        setApproveStatusFormValue,
        rejectStatusFormError,
        setRejectStatusFormError,
        rejectIsSubmit,
        setRejectIsSubmit,
        rejectStatusFormValue,
        setRejectStatusFormValue,
        rejectstatusvalue,
        // formErrors,
        // setformErrors,
        // formValues,
        // setFormValues,
      }}
    >
      {props.children}
    </CreditManagementContext.Provider>
  );
}
export default CreditManagementState;
