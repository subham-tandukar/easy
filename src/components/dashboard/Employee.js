import React, { useContext } from "react";
import { VscCalendar } from "react-icons/vsc";
import { FaUser } from "react-icons/fa";
// import SidebarContext from "../sidebarcontext/SidebarContext";

const todayDate = new Date().toLocaleDateString();

const employee = [
  {
    id: 1,
    number: 100,
  },
  {
    id: 2,
    number: 100,
  },
  {
    id: 3,
    number: 100,
  },
  {
    id: 4,
    number: 100,
  },
];

const Employee = () => {
//   const { mode } = useContext(SidebarContext);
  return (
    <>
      <div className="uk-flex uk-flex-between uk-flex-wrap uk-flex-middle head">
        <div className="uk-margin-right">
          <p className="uk-text-bold" >
            Welcome!
          </p>
        </div>

        <div className="uk-margin-left">
          <p>
            <VscCalendar /> {todayDate} | Fiscal Year: 2079-2080
          </p>
        </div>
      </div>

      <div className="total-employee uk-grid uk-child-width-1-4@m uk-child-width-1-2@s uk-grid-match uk-margin-medium-top">
        {employee.map((props) => {
          const { id, number } = props;
          return (
            <div key={id}>
              <div className="total-employee-box">
                <div className="icon">
                  <FaUser color="#0049ae" size="2rem" />
                </div>
                <div>
                  <h5 className="m-0 text-start">Total Employee</h5>
                  <p className="text-start">{number}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Employee;
