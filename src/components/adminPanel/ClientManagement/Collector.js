import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";

import ClientManagementContext from "../clientManagementState/ClientManagementContext";


export default function Collector() {

    const { setCollectorFormValue, collectorvalue, popup, setPopup
    } = useContext(ClientManagementContext);

    // const { User } = useContext(AuthContext);


    // const [imgPrv, setImgPrv] = useState(false);
    // const [imagePre, setImagePre] = useState("");

    const searchInput = useRef("");





    const columns = [
        {
            name: "S.N.",
            grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },

        {
            name: "Logo",
            center: true,
            // grow: 0,
            selector: (row) => {
                return (
                    <>
                        <div className="staffContentLogo tl" ><div className="staffImg tl"><img src={row.Logo}
                            alt=""
                        // onClick={() => { setImagePre(row.Logo); setImgPrv(true) }}

                        /></div></div>
                    </>
                )
            },
        },
        {
            name: "Code",
            // grow: 0,
            center: true,
            selector: (row) => row.Name,
        },
        {
            name: "Name",
            // grow: 0,
            center: true,
            selector: (row) => row.Name,
        },

        {
            name: "Balance Option",
            // grow: 0,
            center: true,
            selector: (row) => row.Address,
        },
        {
            name: "Approve Status",
            center: true,
            // grow: 0,
            selector: (row) => row.Contact,
        },
        {
            name: "Expiry Date",
            center: true,
            // grow: 0,
            selector: (row) => row.NoOfUser,
        },
        {
            name: "App Access",
            center: true,
            // grow: 0,
            selector: (row) => row.CreatedDate,
        },


        {
            name: "Action",
            grow: 1,
            center: true,
            width: "250px",
            selector: (row) => {
                return (
                    <>
                        <div className="ln-verition d-flex">
                            <button
                                type="button"
                                class="btn btn-sm"
                                style={{ background: "var(--button-color)", color: "white" }}
                            // onClick={() => handleEdit(row)}
                            >
                                View{" "}
                            </button>{" "}
                            |
                            <button
                                type="button"
                                class="btn btn-sm"
                                style={{
                                    background: "red",
                                    color: "white",
                                    width: "80px",
                                }}
                            // onClick={() => changeStatus(row.ChhimekiID, row.Status)}
                            >
                                {/* {checkStatus(row.Status)} */}
                            </button>

                        </div>
                    </>
                );
            },
        },
    ];

    // const changeStatus = (ID, IsActive) => {
    //     deactivateDepart(ID, IsActive);
    // };

    // const checkStatus = (IsActive) => {
    //     if (IsActive === 1) {
    //         return "Deactivate";
    //     } else if (IsActive === 0) {
    //         return "Activate";
    //     }
    // };



    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();
        // 
        if (srchQuery) {

            // let srchResult = originalList.filter((list) => {
            //     return list["Name"].toLowerCase().includes(srchQuery);
            // });

            // if (srchResult) {
            //     
            //     setChhimekiList(srchResult);
            // } else {
            //     setChhimekiList({});
            // }
        } else {
            // setChhimekiList(originalList);
        }
    };



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
            <div className="container-fluid classatten-wrapper  mt-3 ps-4 pe-4">
                <>



                    <DataTable
                        columns={columns}
                        // data={chhimekiList}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="410px"
                        highlightOnHover
                        pointerOnHover
                        responsive
                        dense
                        striped
                        subHeader
                        subHeaderComponent={
                            <>

                                <div className="upper-dataTbl">
                                    <div className="d-flex">
                                        <input
                                            placeholder="Search"
                                            ref={searchInput}
                                            type="text"
                                            className="form-control form-control-sm searchField"
                                            onChange={searchHandler}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    />


                </>
            </div>



            {/* {editPop && <ChhimekiEditPopup />}
            {imgPrv &&
                ShowImgPreview({
                    img: imagePre,
                    setTrigger: setImgPrv,
                })} */}
        </>
    );
}
