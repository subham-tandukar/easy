import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { Fetchdata } from "../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../loading/spinner";
import NepaliDate from "nepali-date-converter";

export default function MonthlySummary({
  year,
  DFlag,
  loading,
  setLoading,
  appURL,
}) {
  const { User } = useContext(AuthContext);
  // const [loading, setLoading] = useState(true);
  const [mSummary, setMSummary] = useState([]);

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Month",
      center: true,
      selector: (row) => row.Name,
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
    if (Object.keys(User).length && year) {
      const dataForm = {
        Type: "GET",
        FetchURL: `${appURL}api/atten-summary?ComID=${User.CompanyId}&UserID=${User.UID}&Flag=M&DFlag=${DFlag}&Values=${year}`,
      };

      Fetchdata(dataForm)
        .then(function (result) {

          if (result.StatusCode === 200) {

            const postResult = result.AttenSummary ? result.AttenSummary : "";
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
  }, [year]);

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
            pagination
            fixedHeader
            fixedHeaderScrollHeight="410px"
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
