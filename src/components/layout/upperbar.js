import React, { useContext, useEffect, useRef, useState } from "react";
import "./upperbar.css";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/auth-context";
import CloseIcon from "../../images/CloseIcon.svg";
import logo from "../../images/logo.png";
import { FaRegBell } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { Fetchdata } from "../hooks/getData";
import {
  AiOutlineMenu,
  AiOutlinePoweroff,
  AiFillMessage,
} from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { Popover } from "@material-ui/core";
import UpperbarContext from "../context/upperbar-context";
import "../../css/abs.css";
import { AiOutlineClose } from "react-icons/ai";

export default function Upperbar({
  sidebarController,
  setSidebarController,
  windowWidth,
  userDetails,
}) {
  const {
    logoutDropdown,
    setLogoutDropdown,
    refreshLayout,
    setRefreshLayout,
    logoutAlert,
    setLogoutAlert,
    sidebarLogout,
    setSidebarLogout,
    darkText,
    darkBg,
    darkBg2,
    mode,
    themeText,
    toggletheme,
    sideMenu,
    setSideMenu,
    appURL,
  } = useContext(UpperbarContext);
  const { User } = useContext(AuthContext);

  // console.log(notificationList,"a");
  const [notificationList, setNotificationList] = useState([]);

  const [mobNav, setMobNav] = useState(true);

  const { logout } = useContext(AuthContext);
  let navigate = useNavigate();

  const showLogout = (e) => {
    setLogoutDropdown(e.currentTarget);
  };

  const showAlert = (e) => {
    setLogoutDropdown(null);
    setLogoutAlert(true);
  };

  const logoutHandler = (e) => {
    localStorage.clear();
    sessionStorage.clear();
    logout();
    setLogoutAlert(null);
    setLogoutDropdown(null);
    navigate("/login");
  };

  const handleMenuChange = () => {
    setSideMenu(!sideMenu);
    console.log("clicked");
  };

  // const notification = sessionStorage.getItem("NotificationList");
  // const notificationList = JSON.parse(notification);

  useEffect(() => {
    const params = {
      FetchURL: `${appURL}api/notification-list?ComID=${User.CompanyId}&UserID=21`,
      Type: "GET",
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.NotificationList
            ? result.NotificationList
            : "";

          setNotificationList(postResult);
          // setOriginalList(postResult);
          // console.log(notificationList, "A");
          // setLoading(false);
        } else {
          setNotificationList([]);
          // setLoading(false);
        }
      })
      .catch((err) => {
        setNotificationList([]);
        // setLoading(false);
      });
  }, []);

  const showLogoutPopup = () => {
    return (
      <>
        <div className="container-fluid p-0 logoutPopup-wrapper">
          <div className="logoutpopup-inner">
            <div className="row">
              <div className="col-md-12 col-lg-12 col-sm-12">
                <div className="popUpHeader ps-0 pe-0">
                  <div className="popUpTitle">Easy Software</div>
                  <div className="popUpClose">
                    <img
                      className="popUpCloseIcon"
                      src={CloseIcon}
                      alt="CloseIcon"
                      onClick={() => {
                        setLogoutAlert(false);
                      }}
                    />
                  </div>
                </div>

                <div className="logoutpopup-body text-start ps-3">
                  Do you want to Logout ?
                </div>
                <div className="logoutpopup-footer mt-4">
                  <button
                    type="button"
                    class="btn btn-sm ps-4 pe-4 me-2 ms-3"
                    style={{
                      backgroundColor: "var(--button-color)",
                      color: "white",
                    }}
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    class="btn btn-light btn-sm ps-4 pe-4 me-3 "
                    onClick={() => {
                      setLogoutAlert(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <nav className={!logoutAlert ? "nav" : "nav pushMainNav"} style={darkBg}>
        <div className="uk-grid uk-flex-middle uk-flex-between uk-width-1">
          <div className="logo">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                style={{ height: "50px" }}
                className="uk-margin-auto uk-display-block"
              />
            </Link>
            <div className="ham-menu">
              <span>
                <i>
                  <GiHamburgerMenu
                    className="ham-icon"
                    color={mode === "light" ? "#777" : "#fff"}
                    size="1.5rem"
                    onClick={handleMenuChange}
                  />
                </i>
              </span>
            </div>
          </div>

          <div className="uk-width-expand ps-3" id="large-nav">
            <div className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
              <div>
                <h3 style={darkText} className="text-start">
                  <span
                    className="uk-margin-remove"
                    style={{ color: mode === "light" ? "#004aad" : "#fff" }}
                  >
                    Easy
                  </span>{" "}
                  Office
                </h3>
                <p className="text-start" style={darkText}>
                  Head Office
                </p>
                <p style={darkText} className="text-start address">
                  Bharatpur Nepal, 027-400078
                </p>
              </div>

              <div className="uk-flex uk-flex-middle">
                <span>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    defaultChecked
                    onClick={toggletheme}
                  />
                  <span className="uk-margin-small-left" style={darkText}>
                    {themeText}
                  </span>
                </span>

                {/* <span>
                  <select onChange={(e) => setSelect(e.target.value)}>
                    {options.map((opt) => (
                      <option
                        onClick={translate1}
                        key={opt.code}
                        value={opt.code}
                      >
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </span> */}

                {userDetails.IsManager === 0 && (
                  <span className="notify me-5" uk-margin>
                    <button type="button" className="btn p-0">
                      <FaRegBell
                        size="1.3rem"
                        color={mode === "light" ? "#000" : "#fff"}
                      />
                      <span className="uk-badge">
                        {notificationList.length}
                      </span>
                    </button>
                    <div className="drop-box">
                      <h5>Notification</h5>

                      {notificationList.length > 0 && (
                        <div>
                          <div className="notify__wrapper">
                            {notificationList.map((item) => {
                              const { Image, Title, Description } = item;
                              return (
                                <>
                                  <Link to="user-notification">
                                    <div className="uk-flex uk-flex-middle notify-wrap">
                                      <div className="notify-img">
                                        <img src={Image} alt="dp" />
                                      </div>

                                      <div className="ms-3">
                                        <div className="notify-title">
                                          {Title}
                                        </div>
                                        <div className="notify-desc">
                                          {Description}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </>
                              );
                            })}
                          </div>

                          <div className="notify__footer">
                            <Link to="user-notification">
                              <p>Show all notifications</p>
                            </Link>
                          </div>
                        </div>
                      )}

                      {notificationList.length === 0 && (
                        <div className="py-2 bg-light">No notifications.</div>
                      )}
                    </div>
                  </span>
                )}

                <span>
                  <div
                    className="user-info text-start uk-margin-remove uk-padding-remove"
                    style={darkText}
                  >
                    {userDetails.MiddleName
                      ? userDetails.FirstName +
                        " " +
                        userDetails.MiddleName +
                        " " +
                        userDetails.LastName
                      : userDetails.FirstName + " " + userDetails.LastName}
                  </div>
                  <div className="info-designation text-start" style={darkText}>
                    {userDetails.DesignationName}
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div className="uk-flex uk-flex-wrap uk-padding-remove">
            {/* <span>
              <i
                className="fas fa-redo ms-3 pointer"
                onClick={handleRefresh}
                style={darkText}
                title="Refresh"
              ></i>
            </span> */}
            <span className="ms-3">
              <AiOutlinePoweroff
                size={18}
                className="nav-power-icons"
                onClick={showLogout}
                style={darkText}
              />
              <Popover
                open={Boolean(logoutDropdown)}
                anchorEl={logoutDropdown}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 62, left: 4500 }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                onClose={() => setLogoutDropdown(null)}
              >
                <div className="sec-logout" onClick={showAlert}>
                  <button type="button" class="btn-logout">
                    <AiOutlinePoweroff size={18} className="me-2" />
                    Logout
                  </button>
                </div>
              </Popover>

              {logoutAlert && showLogoutPopup()}
            </span>
            <div
              className="dots-icon"
              onClick={() => {
                setMobNav(!mobNav);
              }}
            >
              <BsThreeDotsVertical
                className="dots"
                color={mode === "light" ? "#000" : "#fff"}
              />
            </div>
          </div>
        </div>

        <div
          id="mob-nav"
          className={`${mobNav ? "mob-nav" : ""}`}
          style={darkBg2}
        >
          <div className="uk-margin-bottom">
            <h3 style={darkText} className="text-start">
              <span
                className="uk-margin-remove"
                style={{ color: mode === "light" ? "#004aad" : "#fff" }}
              >
                Easy
              </span>{" "}
              Office
            </h3>
            <p style={darkText} className="text-start">
              Head Office
            </p>
            <p style={darkText} className="text-start">
              Bharatpur Nepal, 027-400078
            </p>
          </div>

          <div className="uk-margin-bottom">
            <span className="uk-padding">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                defaultChecked
                onClick={toggletheme}
              />
              <span className="uk-margin-small-left" style={darkText}>
                {themeText}
              </span>
            </span>
          </div>

          <div className="uk-margin-bottom">
            <span
              className="user-info text-start uk-margin-remove  uk-padding-remove"
              style={darkText}
            >
              {userDetails.MiddleName
                ? userDetails.FirstName +
                  " " +
                  userDetails.MiddleName +
                  " " +
                  userDetails.LastName
                : userDetails.FirstName + " " + userDetails.LastName}
            </span>
            <span
              className="info-designation text-start d-block"
              style={darkText}
            >
              {userDetails.DesignationName}
            </span>
          </div>

          <div className="uk-margin-bottom text-start">
            {userDetails.IsManager === 0 && (
              <span className="notify me-5" uk-margin>
                <button type="button" className="btn p-0">
                  <FaRegBell
                    size="1.3rem"
                    color={mode === "light" ? "#000" : "#fff"}
                  />
                  <span className="uk-badge">{notificationList.length}</span>
                </button>
                <div className="drop-box">
                  <h5>Notification</h5>

                  {notificationList.length > 0 && (
                    <div>
                      <div className="notify__wrapper">
                        {notificationList.map((item) => {
                          const { Image, Title, Description } = item;
                          return (
                            <>
                              <Link to="user-notification">
                                <div className="uk-flex uk-flex-middle notify-wrap">
                                  <div className="notify-img">
                                    <img src={Image} alt="dp" />
                                  </div>

                                  <div className="ms-3">
                                    <div className="notify-title">{Title}</div>
                                    <div className="notify-desc">
                                      {Description}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </>
                          );
                        })}
                      </div>

                      <div className="notify__footer">
                        <Link to="user-notification">
                          <p>Show all notifications</p>
                        </Link>
                      </div>
                    </div>
                  )}

                  {notificationList.length === 0 && (
                    <div className="py-2 bg-light">No notifications.</div>
                  )}
                </div>
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* <div
        className={
          !logoutAlert && sidebarController ? "mainNav" : "mainNav pushMainNav"
        }
      >
        <div class="topnav">
          <div className="nav-left">
            {sidebarController ? (
              windowWidth > 1100 ? (
                <AiOutlineMenu
                  size={18}
                  className="nav-menu-icons"
                  onClick={() => {
                    setSidebarController(!sidebarController);
                  }}
                />
              ) : (
                <></>
              )
            ) : (
              <AiOutlineMenu
                size={18}
                className="nav-menu-icons"
                onClick={() => {
                  setSidebarController(!sidebarController);
                }}
              />
            )}
            <div className="nav-user-details">
              <img
                src={userDetails.Image}
                alt="ppic"
                className="nav-user-profile"
              />
              <div className="nav-user-info">
                <span className="info-name text-start">
                  {userDetails.MiddleName
                    ? userDetails.FirstName +
                      " " +
                      userDetails.MiddleName +
                      " " +
                      userDetails.LastName
                    : userDetails.FirstName + " " + userDetails.LastName}
                </span>
                <span className="info-designation text-start">
                  {userDetails.DesignationName}
                </span>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <BsSearch size={18} className="nav-search-icons" />
            <IoIosRefresh
              size={18}
              className="nav-icons"
              onClick={reloadLayout}
            />
            <AiFillMessage size={18} className="nav-icons" />
            <MdNotificationsNone size={18} className="nav-icons" />
            <AiOutlinePoweroff
              size={18}
              className="nav-power-icons"
              onClick={showLogout}
            />
            <Popover
              open={Boolean(logoutDropdown)}
              anchorEl={logoutDropdown}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 62, left: 4500 }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClose={() => setLogoutDropdown(null)}
            >
              <div className="sec-logout" onClick={showAlert}>
                <button type="button" class="btn-logout">
                  <AiOutlinePoweroff size={18} className="me-2" />
                  Logout
                </button>
              </div>
            </Popover>

            {logoutAlert && showLogoutPopup()}
          </div>
        </div>
      </div> */}
    </>
  );
}
