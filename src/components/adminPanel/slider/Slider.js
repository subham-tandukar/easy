import React, { useContext, useEffect, useRef, useState } from "react";
import "../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
// import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ShowImgPreview } from "../../../hooks/imagePreview";
import Spinner from "../../loading/spinner";
import UpperbarContext from "../../context/upperbar-context";
import { ShowImgPreview } from "../../hooks/imagePreview";
import SliderContext from "../sliderState/SliderContext";
import SliderPopup from "./SliderPopup";
import DeletePop from "./DeletePop";
import StaffContext from "../organization/staffState/StaffContext";


export default function Slider() {
    const { fiscalYear, todayDate } = useContext(UpperbarContext);
    const { customStylesForImage } = useContext(StaffContext)

    const {
        popup, setPopup, originalList, sliderList, delPopup, handleDelete, handleDeleteTrue, handleDeleteFalse, setSliderFormValue, slidervalue, setSliderList, setIsUploaded, setImage
    } = useContext(SliderContext);

    const { User } = useContext(AuthContext);


    const [imgPrv, setImgPrv] = useState(false);
    const [imagePre, setImagePre] = useState("");

    const searchInput = useRef("");

    const addLeaveNote = (e) => {
        setPopup(true);

        setSliderFormValue(slidervalue);
        setIsUploaded(false);
        setImage("")
    };



    const columns = [
        {
            name: "S.N.",
            grow: 0,
            center: true,
            cell: (row, index) => index + 1,
        },

        {
            name: "Image",
            center: true,
            // grow: 0,
            selector: (row) => {
                return (
                    <>
                        <div className="staffContentLogo tl" ><div className="staffImg tl"><img src={row.imgPath}
                            alt=""
                            onClick={() => { setImagePre(row.imgPath); setImgPrv(true) }}

                        /></div></div>
                    </>
                )
            },
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
                                style={{
                                    background: "red",
                                    color: "white",
                                    width: "80px",
                                }}
                                onClick={() => { handleDelete(row.sliderID) }}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                );
            },
        },
    ];






    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();

        if (srchQuery) {

            let srchResult = originalList.filter((list) => {
                return list["imgPath"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setSliderList(srchResult);
            } else {
                setSliderList({});
            }
        } else {
            setSliderList(originalList);
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
                <div className="row mt-3">
                    <div className="page-header">
                        <div className="text-start  page-title">Slider</div>
                        <div className="page-date">
                            <div className="sec-content">
                                Today's Date : {todayDate} <span>|</span> Fiscal Year :{" "}
                                {fiscalYear.StartDate}
                                <span>-</span>
                                {fiscalYear.EndDate}
                            </div>
                        </div>
                    </div>
                    <hr className="title-hr" />
                </div>
                <>
                    <div className="sec-dataTable">
                        <div className="upper-dataTbl">
                            <div className="btn-addlnote mb-3">
                                <button
                                    type="button"
                                    class="btn btn-sm"
                                    style={{
                                        background: "var(--button-color)",
                                        color: "white",

                                    }}
                                    onClick={addLeaveNote}
                                >
                                    Add New
                                </button>
                            </div>
                        </div>

                        <DataTable
                            columns={columns}
                            data={sliderList}
                            customStyles={customStylesForImage}
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

                    </div>
                </>
            </div>

            {popup && <SliderPopup />}
            {delPopup.show && (
                <DeletePop
                    handleDeleteTrue={handleDeleteTrue}
                    handleDeleteFalse={handleDeleteFalse}
                />
            )}

            {imgPrv &&
                ShowImgPreview({
                    img: imagePre,
                    setTrigger: setImgPrv,
                })}
        </>
    );
}
