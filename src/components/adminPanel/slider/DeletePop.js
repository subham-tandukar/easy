import React, { useContext } from "react";
import CloseIcon from "../../../images/CloseIcon.svg"
import './DeletePop.css';


export default function DeletePop({ handleDeleteTrue, handleDeleteFalse }) {



    return (
        <>
            <div className="container confirm-popup">
                <div className="confirm-popup-inner ">
                    <div className="popUpHeader ps-0 pe-0">
                        <div className="popUpDelTitle">Easy Office</div>
                        <div className="popUpClose">
                            <img style={{ paddingRight: "10px", cursor: "pointer" }}
                                className="popUpCloseIcon"
                                src={CloseIcon}
                                alt="CloseIcon"
                                onClick={handleDeleteFalse}
                            />
                        </div>
                    </div>

                    <div className="confirm-body ps-3 pe-3">
                        <div className="row text-start ">
                            <div className="delText">Are you sure want to delete this?</div>
                        </div>
                    </div>

                    <div className="confirm-footer">
                        <div className="row  mt-2 mb-2">
                            <div>
                                <button
                                    type="button"
                                    class="btn btn-sm me-2"
                                    style={{ background: "#0079bf", color: "white" }}
                                    onClick={handleDeleteTrue}
                                >
                                    Okay
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-danger me-3"
                                    style={{ color: "white" }}
                                    onClick={handleDeleteFalse}
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
}

