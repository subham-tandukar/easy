import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../context/auth-context";
import { Fetchdata } from "../../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../loading/spinner";
import NepaliDate from "nepali-date-converter";
import { GetCurrYear, GetEngCurrYear } from "../../hooks/dateConvertor";
import StaffContext from "../organization/staffState/StaffContext";

export default function AMonthlySummary({
  DFlag,
  month,
  year,
  department,
  subDepartment,
  appURL,
}) {

  const { customStyles } = useContext(StaffContext)
  const { User } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [mSummary, setMSummary] = useState([]);

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Name",
      center: true,
      selector: (row) => row.StaffName,
    },

    {
      name: "Present",
      center: true,
      selector: (row) => row.TotalPresent,
    },
    {
      name: "Absent",
      center: true,
      selector: (row) => row.TotalAbsent,
    },
    {
      name: "Working days",
      width: "120px",
      center: true,
      selector: (row) => row.TotalAbsent + row.TotalPresent,
    },
  ];

  useEffect(() => {
    if (Object.keys(User).length) {
      const dataForm = {
        ComID: User.CompanyId,
        DepartmentID: department,
        SubDepartmentID: subDepartment,
        Flag: "M",
        Value: `${GetCurrYear()}/${month}`,
        DFlag: DFlag,

        Type: "POST",
        FetchURL: `${appURL}api/admin/atten-summary`,
      };

      Fetchdata(dataForm)
        .then(function (result) {

          if (result.StatusCode === 200) {

            const postResult = result.AttenRes ? result.AttenRes : "";
            setMSummary(postResult);
            setLoading(false);
          } else {
            setMSummary([]);

            setLoading(false);
          }
        })
        .catch((err) => {
          setMSummary([]);
          setLoading(false);
        });
    }
  }, [month, department, subDepartment]);

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

      <div>
        {loading ? (
          <>
            {/* <div
              className=" text-center d-flex flex-column justify-content-center align-items-center"
              style={{ margin: "10% auto", width: "120px" }}
            >
              <p className="initial-msg">Please provide input!</p>
            </div> */}
            <Spinner />
          </>
        ) : (
          <DataTable
            columns={columns}
            data={mSummary}
            customStyles={customStyles}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="375px"
            progressPending={loading}
            highlightOnHover
            pointerOnHover
            responsive
            dense
            striped
          />
        )}
      </div>
    </>
  );
}
