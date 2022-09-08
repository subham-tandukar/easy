import React, { useContext, useEffect, useState } from "react";
import "./profile.css";
import Basic from "./Basic";
import Shift from "./Shift";
import Service from "./Service";
import Bank from "./Bank";
import Document from "./Document";
import UpperbarContext from "../context/upperbar-context";
import { ShowImgPreview } from "../hooks/imagePreview";
import AuthContext from "../context/auth-context";
import { Fetchdata } from "../hooks/getData";

export default function Profile() {
  const { User } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState("");
  const [imgPrv, setImgPrv] = useState(false);
  const [ImgPreview, setImgPreview] = useState("");
  const { fiscalYear, todayDate, appURL } = useContext(UpperbarContext);

  useEffect(() => {
    // const cur_user = localStorage.getItem("token");
    // 
    // cur_user.length && setUserDetails(JSON.parse(cur_user));

    const dataForm = {
      ComID: User.CompanyId,
      UID: User.UID,
      NotificationToken: "265b357b6100dfe8",
      DeviceId: "265b357b6100dfe8",
      FetchURL: `${appURL}api/checksession`,
      Type: "POST",
    };

    Fetchdata(dataForm)
      .then(function (result) {

        if (result.StatusCode === 200) {

          const postResult = result.Logins[0] ? result.Logins[0] : "";
          if (postResult) {
            postResult.CompanyId = "ES25";
            postResult.Username = User.UserName;
            setUserDetails(postResult);
          } else {
            const cur_user = localStorage.getItem("token");

            cur_user.length && setUserDetails(JSON.parse(cur_user));
          }
        } else {

          const cur_user = localStorage.getItem("token");

          cur_user.length && setUserDetails(JSON.parse(cur_user));
        }
      })
      .then((res) => {
        // 
      });
  }, []);

  const [activeTab, setActiveTab] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
  });

  const handleTab1 = () => {
    setActiveTab({
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
      tab5: false,
    });
  };
  const handleTab2 = () => {
    setActiveTab({
      tab1: false,
      tab2: true,
      tab3: false,
      tab4: false,
      tab5: false,
    });
  };
  const handleTab3 = () => {
    setActiveTab({
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false,
      tab5: false,
    });
  };
  const handleTab4 = () => {
    setActiveTab({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
      tab5: false,
    });
  };
  const handleTab5 = () => {
    setActiveTab({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: false,
      tab5: true,
    });
  };

  const name =
    userDetails.FirstName +
    " " +
    userDetails.MiddleName +
    " " +
    userDetails.LastName;
  // 

  //Initiate date object
  const dt_date1 = new Date();
  const dt_date2 = new Date(userDetails.EnrollDate);
  //Get the Timestamp
  var date1 = dt_date1.getTime();
  var date2 = dt_date2.getTime();

  var calc;
  //Check which timestamp is greater
  if (date1 > date2) {
    calc = new Date(date1 - date2);
  } else {
    calc = new Date(date2 - date1);
  }
  //Retrieve the date, month and year
  var calcFormatTmp =
    calc.getDate() + "-" + (calc.getMonth() + 1) + "-" + calc.getFullYear();
  //Convert to an array and store
  var calcFormat = calcFormatTmp.split("-");
  //Subtract each member of our array from the default date
  var days_passed = parseInt(Math.abs(calcFormat[0]) - 1);
  var months_passed = parseInt(Math.abs(calcFormat[1]) - 1);
  var years_passed = parseInt(Math.abs(calcFormat[2] - 1970));

  return (
    <>
      <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
        <div className="row mt-3 ">
          <div className="page-header">
            <div className="text-start  page-title">Profile </div>
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
        <div className="sec-dataTable">
          <div className="profile-info">
            <div className="contentLogo tl">
              <div className="mgmtImg tl">
                <img
                  src={userDetails.UserImage}
                  alt="dp"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setImgPreview(userDetails.UserImage);
                    setImgPrv(true);
                  }}
                />
              </div>
            </div>
            <div>
              <h6 style={{ paddingLeft: "10px", textAlign: "left" }}>{name}</h6>
              <p style={{ textAlign: "left", paddingLeft: "10px" }}>
                {userDetails.DesignationName} <br />
                {userDetails.DepartmentName}, {userDetails.SubDepartmentName}
                <br />
                Service Period: {years_passed} years {months_passed} months{" "}
                {days_passed} days
              </p>
            </div>
          </div>

          <div className="insidePopup">
            <ul>
              <li
                className={activeTab.tab1 === true ? "active" : ""}
                onClick={handleTab1}
              >
                <i className="fa fa-user icon"></i>Basic Information{" "}
              </li>
              <li
                className={activeTab.tab2 === true ? "active" : ""}
                onClick={handleTab2}
              >
                <i className="fas fa-sliders icon"></i>Shift Information{" "}
              </li>
              <li
                className={activeTab.tab3 === true ? "active" : ""}
                onClick={handleTab3}
              >
                <i className="fas fa-sliders icon"></i>Service Information{" "}
              </li>
              <li
                className={activeTab.tab4 === true ? "active" : ""}
                onClick={handleTab4}
              >
                <i className="fas fa-home icon"></i>Bank Information{" "}
              </li>
              <li
                className={activeTab.tab5 === true ? "active" : ""}
                onClick={handleTab5}
              >
                <i className="fas fa-users icon"></i>Document Information{" "}
              </li>
            </ul>
          </div>
          <div>
            {activeTab.tab1 && <Basic userDetails={userDetails} />}
            {activeTab.tab2 && <Shift userDetails={userDetails} />}
            {activeTab.tab3 && <Service userDetails={userDetails} />}
            {activeTab.tab4 && <Bank />}
            {activeTab.tab5 && <Document />}
          </div>
        </div>
      </div>
      {imgPrv &&
        ShowImgPreview({
          img: ImgPreview,
          setTrigger: setImgPrv,
        })}
    </>
  );
}
