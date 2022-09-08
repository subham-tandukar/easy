import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../profile/profile.css";
import DataTable, { defaultThemes } from "react-data-table-component";
import { Fetchdata } from "../../../hooks/getData";
import AuthContext from "../../../context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../loading/spinner";
import UpperbarContext from "../../../context/upperbar-context";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import CryptoJS from "crypto-js";
import CooperativeContext from "../../organization/cooperativeState/CooperativeContext";
import StaffContext from "../../organization/staffState/StaffContext";
import { Button } from "@material-ui/core";

export default function OperatorSummary() {
    const apisignature = process.env.REACT_APP_SIGNATURE;
    const { customStyles } = useContext(StaffContext)
    const [originalList, setOriginalList] = useState(null);
    const searchInput = useRef("");

    const { reactURL, cooperativeList } = useContext(CooperativeContext)

    const [loading, setLoading] = useState(true);



    const { User } = useContext(AuthContext);


    const [chooseCooperative, setChooseCooperative] = useState("")

    const [summaryList, setSummaryList] = useState([]);

    const [hideDirector, setHideDirector] = useState(false)


    useEffect(() => {
        OperatorSummary();
    }, [])



    const OperatorSummary = () => {
        const listForm = {

            CoOperativeCode: chooseCooperative,
            IsEncryptReq: "N",
            TimeStamp: "2022-05-02T01:35:44.345"

        };
        var key = CryptoJS.enc.Utf8.parse("D89035A6634F4C4786B947518F17A18A");
        var iv = CryptoJS.enc.Utf8.parse("EasyS0ftS0ftware");

        var encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(listForm),
            key, //dataForm
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );
        const dts = {
            EncrytedText: encrypted.toString(),
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Signature: apisignature,
            },
            body: JSON.stringify(dts)
        };
        fetch(`${reactURL}MblPayPanel/Reports/OperatorSummary`, requestOptions)
            .then((result) => {
                result.json().then((resp) => {

                    if (resp.statuS_CODE === "0") {
                        setSummaryList(resp.lstOperatorSummaryReport)
                        setOriginalList(resp.lstOperatorSummaryReport)
                        setLoading(false)
                    }
                    else {
                        setSummaryList([])
                        setLoading(false)

                    }
                })
            })
    };










    const columns = React.useMemo(
        () => [
            {
                name: "S.N.",
                grow: 0,
                center: true,
                cell: (row, index) => index + 1,
            },
            {
                name: "Operator",
                // grow: 0,
                center: true,
                selector: (row) => row.operatorName,
                omit: hideDirector
            },
            {
                name: "Transaction",
                center: true,
                // grow: 0,
                selector: (row) => row.noOfTxns,
            },
            {
                name: "Amount",
                center: true,
                // grow: 0,
                selector: (row) => row.sumOfAmount,
            },
            {
                name: "Commission Earned",
                center: true,
                // grow: 0,
                selector: (row) => row.coCommission.toFixed(2),
            },
        ],
        [hideDirector],
    );





    const searchHandler = (e) => {
        e.preventDefault();

        const srchQuery = searchInput.current.value.toLowerCase();
        if (srchQuery) {

            let srchResult = originalList.filter((list) => {
                return list["operatorName"].toLowerCase().includes(srchQuery);
            });

            if (srchResult) {

                setSummaryList(srchResult);
            } else {
                setSummaryList({});
            }
        } else {
            setSummaryList(originalList);
        }
    };



    const handleCooperative = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setChooseCooperative(value);
    }



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


                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <Button onClick={() => setHideDirector(!hideDirector)}>Hide Column</Button>
                            <DataTable
                                columns={columns}
                                data={summaryList}
                                customStyles={customStyles}
                                pagination
                                fixedHeader
                                fixedHeaderScrollHeight="350px"
                                highlightOnHover
                                pointerOnHover
                                responsive
                                dense
                                striped
                                subHeader
                                subHeaderComponent={
                                    <>
                                        <div className="upper-dataTbl me-2">
                                            <label style={{ fontSize: "14px", textAlign: "left", display: "block" }}>Cooperative</label>
                                            <select
                                                style={{ fontSize: "11px" }}
                                                name="snotifiaction"
                                                value={chooseCooperative}
                                                onChange={handleCooperative}
                                                className="form-select form-select-sm"
                                                aria-label="Default select example "
                                            >
                                                <option
                                                    value="0"
                                                    disabled
                                                    selected
                                                    style={{ fontSize: "11px" }}
                                                >
                                                    Select Cooperative
                                                </option>
                                                <option value="">All</option>
                                                {cooperativeList.map((item) => (
                                                    <option
                                                        key={item.cooperativeCode}
                                                        value={item.cooperativeCode}
                                                    >
                                                        {item.cooperativeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="upper-dataTbl">
                                            <div className="d-flex" style={{ paddingTop: "20px" }}>
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

                    )}

                </>
            </div>

        </>
    );
}
