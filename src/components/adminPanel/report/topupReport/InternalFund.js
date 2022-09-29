import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
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
import InternalReversePop from "./InternalReversePop";
import image from "../../../../images/download.png";
import StaffContext from "../../organization/staffState/StaffContext";

export default function InternalFund() {
  const apisignature = process.env.REACT_APP_SIGNATURE;
  const { customStyles } = useContext(StaffContext);
  const [originalList, setOriginalList] = useState(null);
  const searchInput = useRef("");

  const { darkText } = useContext(UpperbarContext);
  const { reactURL, cooperativeList } = useContext(CooperativeContext);

  const [loading, setLoading] = useState(true);

  const { User } = useContext(AuthContext);

  const [chooseCooperative, setChooseCooperative] = useState("");

  const [chooseMember, setChooseMember] = useState("");

  const internalvalue = {
    fromDate: "",
    toDate: "",
    status: "",
  };

  const [internalFormValue, setInternalFormValue] = useState(internalvalue);

  const [reportList, setReportList] = useState([]);

  // API to get report list

  useEffect(() => {
    TopupList();
  }, [
    chooseCooperative,
    chooseMember,
    internalFormValue.status ||
      internalFormValue.fromDate ||
      internalFormValue.toDate,
  ]);

  const TopupList = () => {
    const listForm = {
      CoOperativeCode: chooseCooperative,
      userName: chooseMember,
      fromDate: internalFormValue.fromDate,
      toDate: internalFormValue.toDate,
      Status: internalFormValue.status,
      OperatorID: "1",
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
      `${reactURL}MblPayPanel/MoneyTransfer/MoneyTransferReport`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          setReportList(resp.lstMoneyTransferReport);
          setOriginalList(resp.lstMoneyTransferReport);
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
      name: "Date",
      center: true,
      grow: 3,
      width: "200px",
      selector: (row) => row.txnDate,
    },
    {
      name: "From (Account No.)",
      center: true,
      grow: 3,
      width: "200px",
      selector: (row) => row.senderAccountNum,
    },
    {
      name: "To (Account No.)",
      center: true,
      grow: 3,
      width: "200px",
      selector: (row) => row.destAccountNum,
    },
    {
      name: "Amount",
      center: true,
      grow: 1,
      selector: (row) => row.amount,
    },
    {
      name: "Remarks",
      center: true,
      grow: 3,
      selector: (row) => row.remarks,
    },
    {
      name: "Status",
      center: true,
      grow: 3,
      selector: (row) => {
        return (
          <>
            {row.status}
            <span
              className={
                internalFormValue.status === "PENDING" ||
                row.status === "PENDING"
                  ? " "
                  : "d-none"
              }
              onClick={() => {
                handleReverse(row.tranID);
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
  ];

  // const customStyles = {
  //     // rows: {
  //     //     style: {
  //     //         height: '20px',
  //     //         // override the row height
  //     //     },
  //     // },

  //     header: {
  //         style: {
  //             minHeight: '56px',
  //         },
  //     },
  //     headRow: {
  //         style: {
  //             borderTopStyle: 'solid',
  //             borderTopWidth: '1px',
  //             borderTopColor: defaultThemes.default.divider.default,
  //             // borderLeftStyle: 'solid',
  //             // borderLeftWidth: '1px',
  //             // borderLeftColor: defaultThemes.default.divider.default,
  //         },
  //     },
  //     headCells: {
  //         style: {
  //             '&(:last-of-type)': {
  //                 borderRightStyle: 'solid',
  //                 borderRightWidth: '10px',
  //                 borderRightColor: defaultThemes.default.divider.default,
  //             },
  //             // '&:not(:last-of-type)': {
  //             borderLeftStyle: 'solid',
  //             borderLeftWidth: '1px',
  //             borderLeftColor: defaultThemes.default.divider.default,
  //             // },
  //         },
  //     },
  //     cells: {
  //         style: {
  //             // '&:not(:last-of-type)': {
  //             borderLeftStyle: 'solid',
  //             borderLeftWidth: '1px',
  //             borderLeftColor: defaultThemes.default.divider.default,
  //             // },

  //         },
  //     },
  //     rows: {
  //         style: {
  //             height: '17px',
  //         },
  //         highlightOnHoverStyle: {

  //             backgroundColor: '#f2f0f0',
  //             borderBottomColor: '#FFFFFF',
  //             // borderRadius: '25px',
  //             outline: '1px solid #FFFFFF',
  //             fontWeight: '650',

  //         },
  //     },

  // };

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();
    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["senderAccountNum"].toLowerCase().includes(srchQuery);
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
    setInternalFormValue({ ...internalFormValue, [name]: value });
  };

  const handleDate = ({ adDate }) => {
    setInternalFormValue({ ...internalFormValue, fromDate: adDate });
  };
  const handleDate1 = ({ adDate }) => {
    setInternalFormValue({ ...internalFormValue, toDate: adDate });
  };

  const handleCooperative = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseCooperative(value);
  };

  //Everything to pop up and delete the slider list
  const [reversePopup, setReversePopup] = useState({
    show: false, // initial values set to false and null
    data: null,
  });

  const [Acdata, setACData] = useState();

  // To delete the Account List

  const handleReverse = async (data) => {
    setACData(data);

    setReversePopup({
      show: true,
      data,
    });
  };

  // This will perform the deletion and hide the Confirmation Box

  const handleReverseTrue = async () => {
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
    setReversePopup({
      show: false,
      data: null,
    });
  };

  // This will just hide the Confirmation Box when user clicks "No"/"Cancel"

  const handleReverseFalse = () => {
    setReversePopup({
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
                        value="0"
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Member
                      </option>
                      <option value="">All</option>
                      {depoUserList.map((item) => (
                        <option key={item.memID} value={item.userName}>
                          {item.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      From Date
                    </label>
                    <Calendar
                      className="form-control form-control-sm mb-1"
                      dateFormat="YYYY/MM/DD"
                      theme="default"
                      language="en"
                      values={internalFormValue.fromDate}
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
                      values={internalFormValue.toDate}
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
                      value={internalFormValue.status}
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
                      <option value="COMPLETED">Completed</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>

                  <div className="upper-dataTbl">
                    <div className="d-flex" style={{ paddingTop: "22px" }}>
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
      {reversePopup.show && (
        <InternalReversePop
          handleReverseTrue={handleReverseTrue}
          handleReverseFalse={handleReverseFalse}
        />
      )}
    </>
  );
}
