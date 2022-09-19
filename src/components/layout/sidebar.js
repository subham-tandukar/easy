import { useContext, useEffect, useState } from "react";
import "./sidebar.css";
import companyIcon from "../../images/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import classes from "../../css/abs.css";
import { Menu, MenuItem, ProSidebar, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import {
  AiFillDashboard,
  AiOutlineSetting,
  AiOutlineClose,
} from "react-icons/ai";
import { BsFillPersonCheckFill } from "react-icons/bs";

import {
  MdNotificationsNone,
  MdPerson,
  MdOutlinePeopleAlt,
} from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa";

import { SiMicrosoftonenote } from "react-icons/si";
import UpperbarContext from "../context/upperbar-context";
import { ShowLogoutPopup } from "../settings/logoutPopup";
import ChangePassword from "../settings/changePassword";
import $ from "jquery";
import UsewindowDimension from "../hooks/UsewindowDimension";

export default function Sidebar({
  sidebarController,
  setSidebarController,
  userDetails,
  logoutAlert,
  setLogoutAlert,
}) {
  const {
    sidebarLogout,
    setSidebarLogout,
    changePassPopup,
    setChangePassPopup,
    padding,
    setPadding,
    sideMenu,
    setSideMenu,
    mode,
    sidePanelBg,
  } = useContext(UpperbarContext);
  const [hide, setHide] = useState(false);

  let navigate = useNavigate();

  const { width } = UsewindowDimension();
  const handleMenuChange = () => {
    if (width < 960) {
      setSideMenu(!sideMenu);
    } else {
      setSideMenu(sideMenu);
    }
  };

  // const handleDrawer = () => {
  //   if (windowWidth < 1100) {
  //     setSidebarController(false);
  //   } else {
  //     setSidebarController(true);
  //   }
  // };

  const showAlert = (e) => {
    setSidebarLogout(true);
  };

  const changePopup = (e) => {
    setChangePassPopup(true);
  };

  const handlePadding = () => {
    document.querySelectorAll(".side__content").forEach((el) => {
      el.classList.add("padding");
    });
  };

  useEffect(() => {
    if (hide) {
      document.querySelectorAll(".react-slidedown").forEach((el) => {
        el.classList.add("d-none");
      });
    } else {
      document.querySelectorAll(".react-slidedown").forEach((el) => {
        el.classList.remove("d-none");
      });
    }
  }, [hide]);

  useEffect(() => {
    if (padding) {
      document.querySelectorAll(".side__content").forEach((el) => {
        el.classList.remove("padding");
      });
    } else {
      document.querySelectorAll(".side__content").forEach((el) => {
        el.classList.add("padding");
      });
    }
  }, [padding]);

  const handleMouseOver = () => {
    setHide(false);
    setPadding(false);
    if (mode === "light") {
      $(".page-title").css({ color: "#656565" });
      $(".page-date").css({ color: "#656565" });
      $(".title-hr").css({ color: "#656565" });
    } else {
      $(".page-title").css({ color: "#fff" });
      $(".page-date").css({ color: "#fff" });
      $(".title-hr").css({ color: "#fff" });
    }
  };
  const handleMouseLeave = () => {
    setHide(!hide);
    setPadding(!padding);
  };

  return (
    <>
      <div
        className={`side__panel ${sideMenu ? "side-menu" : ""}`}
        style={sidePanelBg}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <div className="side-panel-list">
          {/* <div className="title-section">
            <img src={companyIcon} alt="logo" className="title-logo" />
            <span className="title-name">Easy Office</span>
            {windowWidth < 1100 && (
              <AiOutlineClose
                size={18}
                className="sidenav-close-icons"
                onClick={() => {
                  setSidebarController(false);
                }}
              />
            )}
          </div> */}
          {/* <div className="user-details">
            <div className="img-container">
              <img
                src={userDetails.UserImage}
                alt=""
                className="user-profile"
              />
            </div>
            <div className="user-info">
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
          </div> */}

          <div>
            <ProSidebar>
              <Menu>
                <MenuItem
                  icon={<AiFillDashboard size={18} />}
                  className="arrow "
                  activeclassname={classes.active}
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                >
                  Dashboard
                  <NavLink to="/" />
                </MenuItem>

                {userDetails.IsManager !== 0 && (
                  <SubMenu
                    title="Admin"
                    icon={<BsFillPersonCheckFill size={18} />}
                  >
                    <SubMenu
                      title="Attendance"
                      icon={<BsFillPersonCheckFill size={18} />}
                    >
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow"
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="admin-attendance">Report</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow"
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="admin-summary">Summary</NavLink>
                      </MenuItem>
                    </SubMenu>

                    <SubMenu
                      title="Organizations"
                      icon={<MdOutlinePeopleAlt size={18} />}
                    >
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-department">Department</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-subdepartment">
                          Sub-Department
                        </NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-designation">Designation</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-shift">Shift</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-product">Product</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-staff">Staff</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-document">Document</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-holiday">Holiday</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-branch">Branch</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-fiscal">Fiscal</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-bank">Bank</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-leave-type">Leave Type</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-follow-type">Follow Type</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        <NavLink to="/admin-job-information">
                          Job Information
                        </NavLink>
                      </MenuItem>
                    </SubMenu>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                    >
                      Cooperative
                      <NavLink to="/admin-cooperative" />
                    </MenuItem>

                    <SubMenu
                      title="ESPAY"
                      icon={<BsFillPersonCheckFill size={18} />}
                    >
                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        Commission Setup
                        <NavLink to="/admin-commission" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        Report
                        <NavLink to="/admin-report" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        Slider
                        <NavLink to="/slider" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                      >
                        Credit Management
                        <NavLink to="/credit-management" />
                      </MenuItem>
                    </SubMenu>

                    {/* <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                       onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                    >
                      Cooperative Summary
                      <NavLink to="/coop-summary" />
                    </MenuItem> */}

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                    >
                      Client Management
                      <NavLink to="/client-management" />
                    </MenuItem>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                    >
                      Hami Chhimeki
                      <NavLink to="/admin-hamichhimeki" />
                    </MenuItem>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                    >
                      Job
                      <NavLink to="/job" />
                    </MenuItem>
                  </SubMenu>
                )}

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<SiMicrosoftonenote size={18} />}
                >
                  Leave Note
                  <NavLink to="leave-note"></NavLink>
                </MenuItem>

                <SubMenu
                  title="Attendance"
                  icon={<BsFillPersonCheckFill size={18} />}
                >
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                  >
                    <NavLink to="report-attendance">Report</NavLink>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                  >
                    <NavLink to="attendance-summary">Summary</NavLink>
                  </MenuItem>
                </SubMenu>

                {userDetails.UserID === "ES01" ||
                userDetails.UserID === "ES02" ||
                userDetails.UserID === "ES04" ||
                userDetails.UserID === "ES15" ? (
                  <MenuItem
                    icon={<MdPerson size={18} />}
                    className="arrow"
                    activeclassname={classes.active}
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                  >
                    Lead List
                    <NavLink to="/lead-list" />
                  </MenuItem>
                ) : (
                  <> </>
                )}

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  Leads
                  <NavLink to="organization"></NavLink>
                </MenuItem>

                {/* <SubMenu title="Leeds" icon={<MdOutlinePeopleAlt size={18} />}>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                     onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  >
                    <NavLink to="organization">Organization</NavLink>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                     onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  >
                    <NavLink to="leeds">Leeds</NavLink>
                  </MenuItem>
                </SubMenu> */}

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  FollowUp
                  <NavLink to="followup"></NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  Customer Support
                  <NavLink to="customer-support"></NavLink>
                </MenuItem>

                {userDetails.IsManager !== 0 && (
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                    icon={<MdNotificationsNone size={18} />}
                  >
                    Notification
                    <NavLink to="notification"></NavLink>
                  </MenuItem>
                )}

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<FaUmbrellaBeach size={18} />}
                >
                  Holiday
                  <NavLink to="holiday"></NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  icon={<MdPerson size={18} />}
                >
                  User Activity
                  <NavLink to="user-activity"></NavLink>
                </MenuItem>

                {/*  */}

                <MenuItem
                  icon={<MdPerson size={18} />}
                  className="arrow"
                  activeclassname={classes.active}
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                >
                  Credit Management
                  <NavLink to="/credit" />
                </MenuItem>

                {/*  */}

                <SubMenu title="Setting" icon={<AiOutlineSetting size={18} />}>
                  <MenuItem
                    icon={<MdPerson size={18} />}
                    className="arrow"
                    activeclassname={classes.active}
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                  >
                    Profile
                    <NavLink to="profile" />
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    //  onMouseOverCapture={handlePadding}
                    // onClick={handleMenuChange}
                    //
                  >
                    <div onClick={changePopup}>Change Password</div>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    //  onMouseOverCapture={handlePadding}
                    // onClick={handleMenuChange}
                    //
                  >
                    <div onClick={showAlert}>Logout</div>
                  </MenuItem>
                </SubMenu>
              </Menu>
            </ProSidebar>

            {/* <ProSidebar>
              <Menu iconShape="square">
                <MenuItem
                  icon={<AiFillDashboard size={18} />}
                  className="arrow "
                  activeclassname={classes.active}
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                  key={reload}
                >
                  Dashboard
                  <NavLink to="/" />
                </MenuItem>

                {userDetails.IsManager !== 0 && (
                  <SubMenu
                    title="Admin"
                    icon={<BsFillPersonCheckFill size={18} />}
                  >
                    <SubMenu
                      title="Attendance"
                      icon={<BsFillPersonCheckFill size={18} />}
                    >
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="admin-attendance">Report</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="admin-summary">Summary</NavLink>
                      </MenuItem>
                    </SubMenu>

                    <SubMenu
                      title="Organizations"
                      icon={<MdOutlinePeopleAlt size={18} />}
                    >
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-department">Department</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-subdepartment">
                          Sub-Department
                        </NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-designation">Designation</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-shift">Shift</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-product">Product</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-staff">Staff</NavLink>
                      </MenuItem>
                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-document">Document</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-holiday">Holiday</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-branch">Branch</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-fiscal">Fiscal</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-bank">Bank</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-leave-type">Leave Type</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-follow-type">Follow Type</NavLink>
                      </MenuItem>

                      <MenuItem
                        activeclassname={classes.active}
                        className="arrow "
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        <NavLink to="/admin-job-information">
                          Job Information
                        </NavLink>
                      </MenuItem>
                    </SubMenu>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      
                    
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                     
                    >
                      Cooperative
                      <NavLink to="/admin-cooperative" />
                    </MenuItem>

                    <SubMenu
                      title="ESPAY"
                      icon={<BsFillPersonCheckFill size={18} />}
                    >
                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        
                      
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        Commission Setup
                        <NavLink to="/admin-commission" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        
                      
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        Report
                        <NavLink to="/admin-report" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        
                      
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        Slider
                        <NavLink to="/slider" />
                      </MenuItem>

                      <MenuItem
                        icon={<MdPerson size={18} />}
                        className="arrow"
                        
                      
                        activeclassname={classes.active}
                        onMouseOverCapture={handlePadding}
                        onClick={handleMenuChange}
                       
                      >
                        Credit Management
                        <NavLink to="/credit-management" />
                      </MenuItem>
                    </SubMenu>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      activeclassname={classes.active}
                       onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                    >
                      Cooperative Summary
                      <NavLink to="/coop-summary" />
                    </MenuItem>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      
                    
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                     
                    >
                      Client Management
                      <NavLink to="/client-management" />
                    </MenuItem>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      
                    
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                     
                    >
                      Hami Chhimeki
                      <NavLink to="/admin-hamichhimeki" />
                    </MenuItem>

                    <MenuItem
                      icon={<MdPerson size={18} />}
                      className="arrow"
                      
                    
                      activeclassname={classes.active}
                      onMouseOverCapture={handlePadding}
                      onClick={handleMenuChange}
                     
                    >
                      Job
                      <NavLink to="/job" />
                    </MenuItem>
                  </SubMenu>
                )}

                <MenuItem
                  icon={<MdPerson size={18} />}
                  className="arrow"
                  
                
                  activeclassname={classes.active}
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                >
                  Profile
                  <NavLink to="profile" />
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<SiMicrosoftonenote size={18} />}
                >
                  <NavLink to="leave-note">Leave Note</NavLink>
                </MenuItem>

                <SubMenu
                  title="Attendance"
                  icon={<BsFillPersonCheckFill size={18} />}
                >
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                   
                  >
                    <NavLink to="report-attendance">Report</NavLink>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                   
                  >
                    <NavLink to="attendance-summary">Summary</NavLink>
                  </MenuItem>
                </SubMenu>

                {userDetails.UserID === "ES01" ||
                userDetails.UserID === "ES02" ||
                userDetails.UserID === "ES04" ||
                userDetails.UserID === "ES15" ? (
                  <MenuItem
                    icon={<MdPerson size={18} />}
                    className="arrow"
                    
                  
                    activeclassname={classes.active}
                    onMouseOverCapture={handlePadding}
                    onClick={handleMenuChange}
                   
                  >
                    Lead List
                    <NavLink to="/lead-list" />
                  </MenuItem>
                ) : (
                  <> </>
                )}

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  <NavLink to="organization">Leads</NavLink>
                </MenuItem>

                <SubMenu title="Leeds" icon={<MdOutlinePeopleAlt size={18} />}>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                     onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  >
                    <NavLink to="organization">Organization</NavLink>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                     onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  >
                    <NavLink to="leeds">Leeds</NavLink>
                  </MenuItem>
                </SubMenu>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  <NavLink to="followup">FollowUp</NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<MdOutlinePeopleAlt size={18} />}
                >
                  <NavLink to="customer-support">Customer Support</NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<MdNotificationsNone size={18} />}
                >
                  <NavLink to="notification">Notification</NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<FaUmbrellaBeach size={18} />}
                >
                  <NavLink to="holiday">Holiday</NavLink>
                </MenuItem>

                <MenuItem
                  activeclassname={classes.active}
                  className="arrow "
                  onMouseOverCapture={handlePadding}
                  onClick={handleMenuChange}
                 
                  icon={<MdPerson size={18} />}
                >
                  <NavLink to="user-activity">User Activity</NavLink>
                </MenuItem>

                <SubMenu title="Setting" icon={<AiOutlineSetting size={18} />}>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                  
                  >
                    <div onClick={changePopup}>Change Password</div>
                  </MenuItem>
                  <MenuItem
                    activeclassname={classes.active}
                    className="arrow "
                   
                  >
                    <div onClick={showAlert}>Logout</div>
                  </MenuItem>
                </SubMenu>
              </Menu>
            </ProSidebar> */}
          </div>
        </div>
      </div>
      {sidebarLogout && <ShowLogoutPopup />}
      {changePassPopup && <ChangePassword />}
    </>
  );
}
