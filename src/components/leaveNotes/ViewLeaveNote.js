import React, { useContext } from "react";
import UpperbarContext from "../context/upperbar-context";
import CloseIcon from "../../images/CloseIcon.svg";
import { GetNepaliDate } from "../hooks/dateConvertor";
const ViewLeaveNote = ({ note, setViewPopup, DFlag }) => {
  const { sidePanelBg } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setViewPopup(false);
  };

  const leave = [
    {
      title: "Leave Type",
      body: note.LeaveType,
    },
    {
      title: "Title",
      body: note.Title,
    },
    {
      title: "Cause",
      body: note.Cause,
    },
    {
      title: "From",
      body: DFlag === "N" ? GetNepaliDate(note.FromDate) : note.FromDate,
    },
    {
      title: "ToDate",
      body: DFlag === "N" ? GetNepaliDate(note.ToDate) : note.ToDate,
    },
    {
      title: "Days",
      body: note.TotalDays,
    },
    {
      title: "Status",
      body: note.LeaveStatus,
    },
    {
      title: "Verified By",
      body:
        note.LeaveVerified === "verified" ? note.VerifiedBy : "Not verified",
    },
  ];

  return (
    <>
      <div className="container viewNotifyPopup-wrapper">
        <div className="viewNotifyPopup-inner">
          <div className="popUpHeader ps-0 pe-0" style={sidePanelBg}>
            <div className="popUpTitle">View</div>
            <div className="popUpClose">
              <img
                className="popUpCloseIcon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={closePopUp}
              />
            </div>
          </div>
          <div className="viewNotifyPopupBody ps-3 pe-3">
            <div className="row text-start mt-2">
              <table className="table">
                <tbody>
                  {leave.map((props) => {
                    const { title, body } = props;
                    return (
                      <>
                        <tr>
                          <td
                            className="fw-bold"
                            style={{ width: "max-content" }}
                          >
                            {title}
                          </td>
                          <td
                            style={{
                              borderLeft: "1px solid rgb(225, 226, 227)",
                            }}
                          >
                            {body}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="viewNotifyPopupFooter">
            <div className="row  mt-1 mb-1">
              <div>
                {/* <button
                  type="button"
                  class="btn btn-sm me-2"
                  style={{ background: "var(--button-color)", color: "white" }}
                  onClick={handleSubmit}
                >
                  Submit
                </button> */}
                <button
                  type="button"
                  class="btn btn-sm btn-danger me-3"
                  style={{ color: "white" }}
                  onClick={closePopUp}
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

export default ViewLeaveNote;
