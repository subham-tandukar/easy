import React, { useContext } from "react";
import UpperbarContext from "../context/upperbar-context";
import CloseIcon from "../../images/CloseIcon.svg";
const ViewLeaveNote = ({ note, setViewPopup, DFlag }) => {
  const { sidePanelBg } = useContext(UpperbarContext);
  const closePopUp = (e) => {
    setViewPopup(false);
  };
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
                  <tr>
                    <td className="fw-bold">Leave Type</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.LeaveType}
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-bold">Title</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.Title}
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-bold">Cause</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.Cause}
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-bold">From</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.FromDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">To</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.ToDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Days</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.TotalDays}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Status</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.LeaveStatus}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Verified By</td>
                    <td style={{ borderLeft: "1px solid rgb(225, 226, 227)" }}>
                      {note.LeaveVerified === "verified"
                        ? note.VerifiedBy
                        : "Not verified"}
                    </td>
                  </tr>
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
