import "./imagePreview.css";
import CloseIcon from "../../images/CloseIcon.svg";

export const ShowImgPreview = (data) => {


  return (
    <>
      <div className="imgPrv-popup">
        <div className="imgPrv-popup-inner">
          <div className="ImgPreview">
            <img
              className="imgPrv-close-icon"
              src={CloseIcon}
              alt="CloseIcon"
              onClick={() => data.setTrigger(false)}
            />

            <img
              id="prv-image"
              src={data.img}
              draggable={false}
              alt="uploaded-img"
            />
          </div>
        </div>
      </div>
    </>
  );
};
