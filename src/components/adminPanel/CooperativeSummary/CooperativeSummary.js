import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";
import UpperbarContext from "../../context/upperbar-context";
import { ShowImgPreview } from "../../hooks/imagePreview";
import SliderContext from "../sliderState/SliderContext";
import CooperativeContext from "../organization/cooperativeState/CooperativeContext";
import CryptoJS from "crypto-js";
import StaffContext from "../organization/staffState/StaffContext";

export default function CooperativeSummary() {
  const { fiscalYear, todayDate, darkText } = useContext(UpperbarContext);
  const { customStyles } = useContext(StaffContext);
  const apisignature = process.env.REACT_APP_SIGNATURE;

  const { reactURL, cooperativeList } = useContext(CooperativeContext);
  const [loading, setLoading] = useState(true);

  const { User } = useContext(AuthContext);

  const searchInput = useRef("");

  const [originalList, setOriginalList] = useState("");
  const [chooseCooperative, setChooseCooperative] = useState("");
  const handleCooperative = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setChooseCooperative(value);
  };

  const [dashboardList, setDashboardList] = useState([]);

  //API to hit Dashboard list

  useEffect(() => {
    getDashboardList();
  }, [chooseCooperative]);

  const getDashboardList = () => {
    const listForm = {
      CoOperativeCode: chooseCooperative,
      BranchID: "",
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
      `${reactURL}MblPayPanel/CoOperative/DashBoarData`,
      requestOptions
    ).then((result) => {
      result.json().then((resp) => {
        if (resp.statuS_CODE === "0") {
          setDashboardList(resp);
          setOriginalList(resp);
          setLoading(false);
        } else {
          setDashboardList({});
          setLoading(false);
        }
      });
    });
  };

  // const propertyNames = Object.entries(dashboardList).map((e) => ({ [e[0]]: e[1] }));

  //

  // const names = JSON.stringify(dashboardList)
  //
  const arrayResult = Object.keys(dashboardList).map((room) => {
    return { id: room, name: dashboardList[room] };
  });

  const newArr = arrayResult.slice(0, -2);
  const newArr2 = newArr.slice(2, 8);

  console.log(newArr2);

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },

    {
      name: "Particulars",
      center: true,
      grow: 1,
      selector: (row) => row.id,
    },

    {
      name: "Value",
      grow: 1,
      center: true,
      width: "250px",
      selector: (row) => row.name,
    },
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    const srchQuery = searchInput.current.value.toLowerCase();

    if (srchQuery) {
      let srchResult = originalList.filter((list) => {
        return list["imgPath"].toLowerCase().includes(srchQuery);
      });

      if (srchResult) {
        setDashboardList(srchResult);
      } else {
        setDashboardList({});
      }
    } else {
      setDashboardList(originalList);
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
        {/* <div className="row mt-3">
                    <div className="page-header">
                        <div className="text-start  page-title">Cooperative Summary</div>
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
                </div> */}
        <>
          <div className="sec-dataTable">
            <DataTable
              columns={columns}
              data={newArr2}
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
                  <div className="upper-dataTbl me-2">
                    <label className="d-block uk-text-left" style={darkText}>
                      Select Cooperative
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
                        value=""
                        disabled
                        selected
                        style={{ fontSize: "11px" }}
                      >
                        Select Cooperative
                      </option>

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
          </div>
        </>
      </div>
    </>
  );
}
