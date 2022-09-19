import React, { useContext } from "react";
import { FaUser } from "react-icons/fa";
// import SidebarContext from "../sidebarcontext/SidebarContext";

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
      <div className="total-employee uk-grid uk-child-width-1-2@m uk-child-width-1-1@s uk-grid-match uk-margin-medium-top">
        {employee.map((props) => {
          const { id, number } = props;
          return (
            <div key={id}>
              <div className="total-employee-box mb-5">
                <div className="icon">
                  <FaUser color="#0049ae" size="2rem" />
                </div>
                <div>
                  <h5 className="m-0">Total Employee</h5>
                  <p className="mt-2">{number}</p>
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
