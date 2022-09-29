import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import CryptoJS from "crypto-js";
import CooperativeContext from "../../organization/cooperativeState/CooperativeContext";
import image from "../../../../images/download.png";
import ReversePop from "./ReversePop";
import StaffContext from "../../../adminPanel/organization/staffState/StaffContext";

export default function TopupReport() {
  const apisignature = process.env.REACT_APP_SIGNATURE;
  const { customStyles } = useContext(StaffContext);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const { darkText } = useContext(UpperbarContext);
  const { reactURL, cooperativeList } = useContext(CooperativeContext);

  const [loading, setLoading] = useState(true);

  const { User } = useContext(AuthContext);

  const [chooseOption, setChooseOption] = useState("");
  const [chooseCooperative, setChooseCooperative] = useState("");

  const [chooseMember, setChooseMember] = useState("");

  const reportvalue = {
    fromDate: "",
    toDate: "",
    status: "",
  };

  const [reportFormValue, setReportFormValue] = useState(reportvalue);

  const [reportList, setReportList] = useState([]);

  // API to get report list

  useEffect(() => {
    TopupList();
  }, [
    chooseCooperative,
    chooseMember,
    reportFormValue.fromDate,
    reportFormValue.toDate,
    reportFormValue.status ||
      reportFormValue.fromDate ||
      reportFormValue.toDate,
  ]);

  const TopupList = () => {
    const listForm = {
      CoOperativeCode: chooseCooperative,
      Username: chooseMember,
      FromDate: reportFormValue.fromDate,
      // FromDate: "2022-05-05",
      ToDate: reportFormValue.toDate,
      // ToDate: "2022-06-04",
      Status: reportFormValue.status,

      // Status: "SUCCESS",
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };
    var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
    var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

    var encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(listForm),
      key, //dataForm
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const dts = {
      EncrytedText: encrypted.toString(),
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Signature: apisignature,
      },
      body: JSON.stringify(dts),
    };
    fetch(
      `${reactURL}MblPayPanel/BalanceTransfer/TopupReport`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          setReportList(resp.lstGetTopUpData);
          setOriginalList(resp.lstGetTopUpData);
          setLoading(false);
        } else {
          setReportList([]);
          setLoading(false);
        }
      });
    });
  };

  // API to post Deposit User List / Member

  const [depoUserList, setDepoUserList] = useState([]);

  useEffect(() => {
    DepositorList();
  }, [chooseCooperative]);

  const DepositorList = () => {
    const listForm = {
      CoOperativeCode: chooseCooperative,
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };
    var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
    var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

    var encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(listForm),
      key, //dataForm
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const dts = {
      EncrytedText: encrypted.toString(),
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Signature: apisignature,
      },
      body: JSON.stringify(dts),
    };
    fetch(
      `${reactURL}MblPayPanel/UserMgnt/DepositorUserList`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          setDepoUserList(resp.lstDepositUser);
          setLoading(false);
        } else {
          setDepoUserList([]);
          setLoading(false);
        }
      });
    });
  };

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Transaction ID",
      // grow: 0,
      center: true,
      selector: (row) => row.tranID,
    },
    {
      name: "Member",
      center: true,
      // grow: 0,
      selector: (row) => row.userName,
    },
    {
      name: "Date",
      center: true,
      grow: 4,
      width: "200px",
      selector: (row) => row.tranDate,
    },
    {
      name: "Operator",
      center: true,
      grow: 4,
      selector: (row) => row.operator,
    },
    {
      name: "Status",
      center: true,
      grow: 4,
      selector: (row) => {
        return (
          <>
            {row.tranStatus}{" "}
            <span
              className={
                reportFormValue.status === "PROCESSING" ||
                row.tranStatus === "PROCESSING"
                  ? " "
                  : "d-none"
              }
              onClick={() => {
                handleDelete(row.tranID);
              }}
            >
              <img
                src={image}
                alt="reverse"
                style={{ height: "20px", width: "20px" }}
              />
            </span>
          </>
        );
      },
    },
    {
      name: "Amount",
      center: true,
      // grow: 0,
      selector: (row) => row.amount,
    },
    {
      name: "Balance",
      center: true,
      // grow: 0,
      selector: (row) => row.balance,
    },
    {
      name: "Commission Earned",
      center: true,
      // grow: 0,
      selector: (row) => row.balance,
    },
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return (
          list["userName"].toLowerCase().includes(srchQuery) ||
          list["operator"].toLowerCase().includes(srchQuery)
        );
      });

      if (srchResult) {
        setReportList(srchResult);
      } else {
        setReportList({});
      }
    } else {
      setReportList(originalList);
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseOption(value);
  };

  const handleChanges = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseMember(value);
  };

  const handleReport = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setReportFormValue({ ...reportFormValue, [name]: value });
  };

  const handleCooperative = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseCooperative(value);
  };

  const handleDate = ({ adDate }) => {
    setReportFormValue({ ...reportFormValue, fromDate: adDate });
  };
  const handleDate1 = ({ adDate }) => {
    setReportFormValue({ ...reportFormValue, toDate: adDate });
  };

  //Everything to pop up and delete the slider list
  const [delPopup, setDelPopup] = useState({
    show: false, // initial values set to false and null
    data: null,
  });

  const [Acdata, setACData] = useState();

  // To delete the Account List

  const handleDelete = async (data) => {
    setACData(data);

    setDelPopup({
      show: true,
      data,
    });
  };

  // This will perform the deletion and hide the Confirmation Box

  const handleDeleteTrue = async () => {
    const dataForm = {
      CoOperativeCode: chooseCooperative,
      ID: Acdata,
      IsEncryptReq: "N",
      TimeStamp: "2022-05-02T01:35:44.345",
    };

    var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
    var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

    var encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataForm),
      key, //dataForm
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const dts = {
      EncrytedText: encrypted.toString(),
    };
    console.log(dts);

    const response = await fetch(
      `${reactURL}MblPayPanel/BalanceTransfer/CheckProcessingTxns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Signature: apisignature,
        },
        body: JSON.stringify(dts), //dts
      }
    );
    const tole = await response.json();

    if (tole.statuS_CODE === "01") {
      TopupList();
      toast(tole.message, {
        style: {
          color: "green",
          fontSize: "13px",
        },
      });
    } else {
      toast("Error: " + tole.message, {
        style: {
          color: "red",
          fontSize: "13px",
        },
      });
    }
    setDelPopup({
      show: false,
      data: null,
    });
  };

  // This will just hide the Confirmation Box when user clicks "No"/"Cancel"

  const handleDeleteFalse = () => {
    setDelPopup({
      show: false,
      data: null,
    });
  };

  //Everything to pop up and delete the report list ends

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
        <>
          {loading ? (
            <Spinner />
          ) : (
            <DataTable
              columns={columns}
              data={reportList}
              customStyles={customStyles}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="350px"
              highlightOnHover
              pointerOnHover
              responsive
              dense
              striped
              subHeader
              subHeaderComponent={
                <>
                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      Cooperative
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseCooperative}
                      onChange={handleCooperative}
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                    >
                      <option
                        value="0"
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Cooperative
                      </option>
                      <option value="">All</option>

                      {cooperativeList.map((item) => (
                        <option
                          key={item.cooperativeCode}
                          value={item.cooperativeCode}
                        >
                          {item.cooperativeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      Choose Option
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="snotifiaction"
                      value={chooseOption}
                      onChange={handleChange}
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                    >
                      <option
                        value="0"
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Option
                      </option>
                      <option value="">All</option>
                      <option value="member">Member</option>
                    </select>
                  </div>

                  {chooseOption === "member" && (
                    <div className="upper-dataTbl me-2">
                      <label
                        style={{
                          fontSize: "14px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        Select Member
                      </label>
                      <select
                        style={{ fontSize: "11px" }}
                        name="snotifiaction"
                        value={chooseMember}
                        onChange={handleChanges}
                        className="form-select form-select-sm"
                        aria-label="Default select example "
                      >
                        <option
                          value=""
                          disabled
                          selected
                          style={{ fontSize: "11px" }}
                        >
                          Select Member
                        </option>
                        {depoUserList.map((item) => (
                          <option key={item.memID} value={item.userName}>
                            {item.userName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      From Date
                    </label>
                    <Calendar
                      className="form-control form-control-sm mb-1"
                      dateFormat="YYYY/MM/DD"
                      theme="default"
                      language="en"
                      values={reportFormValue.fromDate}
                      onChange={handleDate}
                    />
                  </div>

                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      To Date
                    </label>
                    <Calendar
                      className="form-control form-control-sm mb-1"
                      dateFormat="YYYY/MM/DD"
                      theme="default"
                      language="en"
                      values={reportFormValue.toDate}
                      onChange={handleDate1}
                    />
                  </div>

                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      Select Status
                    </label>
                    <select
                      style={{ fontSize: "11px" }}
                      name="status"
                      className="form-select form-select-sm"
                      aria-label="Default select example "
                      value={reportFormValue.status}
                      onChange={handleReport}
                    >
                      <option
                        selected
                        disabled
                        value="0"
                        style={{ fontSize: "11px" }}
                      >
                        Select Status
                      </option>
                      <option value="">All</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SUCCESS">Success</option>
                      <option value="FAIL">Failed</option>
                    </select>
                  </div>

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
                </>
              }
            />
          )}
        </>
      </div>
      {delPopup.show && (
        <ReversePop
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
        />
      )}
    </>
  );
}
