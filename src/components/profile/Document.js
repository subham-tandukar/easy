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

function Document() {
  const { customStyles } = useContext(StaffContext)
  const [loading, setLoading] = useState(true);
  const [documentList, setDocumentList] = useState([]);
  const { User } = useContext(AuthContext);
  const { appURL } = useContext(UpperbarContext);



  useEffect(() => {
    const params = {
      Type: "GET",
      FetchURL: `${appURL}api/doc-information?ComID=${User.CompanyId}&UserID=${User.UID}`,
    };

    Fetchdata(params)
      .then(function (result) {
        if (result.StatusCode === 200) {
          const postResult = result.Docs ? result.Docs : "";
          setDocumentList(postResult);
          setLoading(false);
        } else {
          setDocumentList([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setDocumentList([]);
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
      name: "Name",
      center: true,
      // grow: 0,
      selector: (row) => row.FileName,
    },
    {
      name: "Type",
      // grow: 0,
      center: true,
      selector: (row) => row.FileType,
    },
    {
      name: "Action",
      // grow: 0,
      center: true,
      selector: (row) => row.FilePath,
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
          data={documentList}
          customStyles={customStyles}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="410px"
          highlightOnHover
          pointerOnHover
          responsive
          progressPending={loading}
          dense
          striped
        />
      )}
    </>
  );
}

export default Document;
