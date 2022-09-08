import React, { useContext, useEffect, useState } from "react";
import "./profile.css";
import DataTable from "react-data-table-component";
import AuthContext from "../context/auth-context";
import { Fetchdata } from "../hooks/getData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../loading/spinner";
import UpperbarContext from "../context/upperbar-context";
import StaffContext from "../adminPanel/organization/staffState/StaffContext";

function Bank() {
  const { customStyles } = useContext(StaffContext)
  const [loading, setLoading] = useState(true);
  const [bankList, setBankList] = useState([]);
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);
  // 

  useEffect(() => {
    const params = {
      Type: "GET",
      FetchURL: `${appURL}api/bank-information?ComID=${User.CompanyId}&UserID=${User.UID}`,
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.BankInfo ? result.BankInfo : "";
          setBankList(postResult);
          setLoading(false);
        } else {
          setBankList([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setBankList([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      name: "S.N.",
      grow: 0,
      center: true,
      cell: (row, index) => index + 1,
    },
    {
      name: "Account Name",
      center: true,
      grow: 1,
      selector: (row) => row.AcName,
    },
    {
      name: "Account Number",
      // grow: 0,
      center: true,
      selector: (row) => row.AcNumber,
    },
    {
      name: "Bank",
      // grow: 0,
      center: true,
      selector: (row) => row.BankName,
    },
    {
      name: "Branch",
      // grow: 0,
      center: true,
      selector: (row) => row.Branch,
    },
  ];

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
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <DataTable
          columns={columns}
          data={bankList}
          customStyles={customStyles}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="410px"
          highlightOnHover
          progressPending={loading}
          pointerOnHover
          responsive
          dense
          striped
        />
      )}
    </>
  );
}

export default Bank;
