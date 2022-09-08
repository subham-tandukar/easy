import React from "react";
import { Link } from "react-router-dom";
import non from "../images/notfound.png";
import "../css/pageNotFound.css";

const NoMatchPage = () => {
  return (
    <>
      <div className="nomatch-maindiv">
        <div className="nomatch-div">
          <img src={non} alt="Not Found" height={180} width={400} />
          <h3>Oops! This Page Could Not Be Found </h3>
          <p>
            Sorry but the page you are looking for does not exist, have been
            removed, name changed or is temporarily notavailable.
          </p>
          <Link
            to="/"
            className="nomatch-button"
            style={{ textDecoration: "none" }}
          >
            {" "}
            Go to homepage{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NoMatchPage;
