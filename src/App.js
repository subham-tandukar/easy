import "./App.css";
import { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthContext from "./components/context/auth-context";
import Login from "./components/login";
import Layout from "./components/layout/layout";
import LeaveNoteList from "./components/leaveNotes/leaveNoteList";
import Notification from "./components/notification/notification";
import Summary from "./components/attendance/summary";
import Profile from "./components/profile/profile";
import ReportAttendance from "./components/attendance/reportAttendance";
import Holiday from "./components/holiday/holiday";
import Organization from "./components/organization/organization";
import NoMatchPage from "./components/pageNoFound";
import UserActivity from "./components/user/userActivity";
import FollowUp from "./components/followUp/followUp";
import CustomerSupport from "./components/customerSupport/customerSupport";
import Dashboard from "./components/dashboard/Dashboard";

// adminpanel
import AAttendanceReport from "./components/adminPanel/attendance/attendanceReport";
import AdminSummary from "./components/adminPanel/attendance/summary";
import StaffState from "./components/adminPanel/organization/staffState/StaffState";
import Department from "./components/adminPanel/organization/department/Department";
import Subdepartment from "./components/adminPanel/organization/subdepartment/Subdepartment";
import Designation from "./components/adminPanel/organization/designation/Designation";
import Product from "./components/adminPanel/organization/product/Product";
import Shift from "./components/adminPanel/organization/shift/Shift";
import Staff from "./components/adminPanel/organization/staff/Staff";
import AdminHoliday from "./components/adminPanel/organization/holiday/Holiday";
import Branch from "./components/adminPanel/organization/branch/Branch";
import Fiscal from "./components/adminPanel/organization/fiscal/Fiscal";
import Bank from "./components/adminPanel/organization/bank/Bank";
import Document from "./components/adminPanel/organization/document/Document";
import Leave from "./components/adminPanel/organization/leaveType/Leave";
import JobInformation from "./components/adminPanel/organization/jobInformation/JobInformation";
import FollowType from "./components/adminPanel/organization/followType/FollowType";
import Cooperative from "./components/adminPanel/organization/cooperative/Cooperative";
import CooperativeState from "./components/adminPanel/organization/cooperativeState/CooperativeState";
import HamiChhimekiState from "./components/adminPanel/hamichhimekiState/HamiChhimekiState";
import Chhimeki from "./components/adminPanel/hamichhimeki/Chhimeki";
import CommissionState from "./components/adminPanel/commissionState/CommissionState";
import Commission from "./components/adminPanel/commission/Commission";
import Report from "./components/adminPanel/report/Report";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { useLocation } from "react-router-dom";
import SliderState from "./components/adminPanel/sliderState/SliderState";
import Slider from "./components/adminPanel/slider/Slider";
import CooperativeSummary from "./components/adminPanel/CooperativeSummary/CooperativeSummary";
import CreditManagement from "./components/adminPanel/CreditManagement/CreditManagement";
import ClientManagement from "./components/adminPanel/ClientManagement/ClientManagement";
import ClientManagementState from "./components/adminPanel/clientManagementState/ClientManagementState";
import MainLead from "./components/adminPanel/leadList/MainLead";
import CreditManagementState from "./components/adminPanel/CreditManagementState/CreditManagementState";
import JobState from "./components/adminPanel/jobState/JobState";
import Job from "./components/adminPanel/job/Job";
import Complain from "./components/Complain";
import Credit from "./components/credit/Credit";
import StaffContext from "./components/adminPanel/organization/staffState/StaffContext";
import UserNotification from "./components/notification/UserNotification";

function App() {
  const { User } = useContext(AuthContext);
  const main_color = "#0049ae";

  //
  useEffect(() => {
    document.documentElement.style.setProperty("--main-color", main_color);
  }, []);

  return (
    <>
      <Routes>
        {!User && <Route path="*" element={<Login />} />}
        {User && <Route path="/login" element={<Navigate to="/" />} />}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/complain" element={<Complain />} />
      </Routes>
      <div className="App">
        {User && (
          <>
            <Layout>
              <StaffState>
                <JobState>
                  <CooperativeState>
                    <ClientManagementState>
                      <CreditManagementState>
                        <CommissionState>
                          <SliderState>
                            <HamiChhimekiState>
                              <Routes>
                                <Route index path="/" element={<Dashboard />} />
                                <Route path="profile" element={<Profile />} />
                                <Route
                                  path="notification"
                                  element={<Notification />}
                                />
                                <Route
                                  path="user-notification"
                                  element={<UserNotification />}
                                />
                                <Route
                                  path="attendance-summary"
                                  element={<Summary />}
                                />
                                <Route
                                  path="report-attendance"
                                  element={<ReportAttendance />}
                                />
                                <Route path="holiday" element={<Holiday />} />
                                <Route
                                  path="organization"
                                  element={<Organization />}
                                />
                                <Route path="followup" element={<FollowUp />} />
                                <Route
                                  path="leave-note"
                                  element={<LeaveNoteList />}
                                />
                                <Route
                                  path="user-activity"
                                  element={<UserActivity />}
                                />
                                <Route
                                  path="customer-support"
                                  element={<CustomerSupport />}
                                />
                                <Route path="credit" element={<Credit />} />

                                {/* Admin routes */}
                                <Route
                                  path="admin-attendance"
                                  element={<AAttendanceReport />}
                                />
                                <Route
                                  path="admin-summary"
                                  element={<AdminSummary />}
                                />
                                <Route
                                  path="/admin-department"
                                  element={<Department />}
                                />
                                <Route
                                  path="/admin-subdepartment"
                                  element={<Subdepartment />}
                                />
                                <Route
                                  path="/admin-designation"
                                  element={<Designation />}
                                />
                                <Route
                                  path="/admin-product"
                                  element={<Product />}
                                />
                                <Route
                                  path="/admin-shift"
                                  element={<Shift />}
                                />
                                <Route
                                  path="/admin-staff"
                                  element={<Staff />}
                                />
                                <Route
                                  path="/admin-holiday"
                                  element={<AdminHoliday />}
                                />
                                <Route
                                  path="/admin-branch"
                                  element={<Branch />}
                                />
                                <Route
                                  path="/admin-fiscal"
                                  element={<Fiscal />}
                                />
                                <Route path="/admin-bank" element={<Bank />} />
                                <Route
                                  path="/admin-document"
                                  element={<Document />}
                                />
                                <Route
                                  path="/admin-leave-type"
                                  element={<Leave />}
                                />
                                <Route
                                  path="/admin-follow-type"
                                  element={<FollowType />}
                                />
                                <Route
                                  path="/admin-cooperative"
                                  element={<Cooperative />}
                                />
                                <Route
                                  path="/admin-hamichhimeki"
                                  element={<Chhimeki />}
                                />
                                <Route
                                  path="/admin-commission"
                                  element={<Commission />}
                                />
                                <Route
                                  path="/admin-report"
                                  element={<Report />}
                                />
                                <Route
                                  path="/privacy-policy"
                                  element={<PrivacyPolicy />}
                                />
                                <Route path="/slider" element={<Slider />} />
                                <Route
                                  path="/coop-summary"
                                  element={<CooperativeSummary />}
                                />
                                <Route
                                  path="/credit-management"
                                  element={<CreditManagement />}
                                />
                                <Route
                                  path="/client-management"
                                  element={<ClientManagement />}
                                />
                                <Route path="/job" element={<Job />} />

                                {User.UserID === "ES01" ||
                                User.UserID === "ES02" ||
                                User.UserID === "ES04" ||
                                User.UserID === "ES15" ? (
                                  <Route
                                    path="/lead-list"
                                    element={<MainLead />}
                                  />
                                ) : (
                                  <></>
                                )}

                                <Route
                                  path="/admin-job-information"
                                  element={<JobInformation />}
                                />

                                {/* Page Not Found */}
                                <Route path="*" element={<NoMatchPage />} />
                              </Routes>
                            </HamiChhimekiState>
                          </SliderState>
                        </CommissionState>
                      </CreditManagementState>
                    </ClientManagementState>
                  </CooperativeState>
                </JobState>
              </StaffState>
            </Layout>
          </>
        )}
      </div>
    </>
  );
}

export default App;
