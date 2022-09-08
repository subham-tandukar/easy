import React from "react";

const statistics = [
  {
    id: 1,
    title: "Statistics",
    width: "25%",
    background: "#0049ae",
  },
  {
    id: 2,
    title: "Statistics",
    width: "90%",
    background: "#A600F4",
  },
  {
    id: 3,
    title: "Statistics",
    width: "50%",
    background: "#00FF19",
  },
  {
    id: 4,
    title: "Statistics",
    width: "10%",
    background: "#FF0000",
  },
];

const Statistics = () => {
  return (
    <>
      <section className="card-box pt-0">
        <h4 className="card-title">
          Statistics
        </h4>

        {statistics.map((props) => {
          const { id, title, width, background } = props;

          return (
            <div key={id} className="statistics">
              <div className="uk-flex uk-flex-between uk-flex-middle">
                <p>{title}</p>
                <p>{width}</p>
              </div>
              <div className="progress" uk-scrollspy="cls: uk-animation-slide-left; delay: 500; repeat: false">
                <div
                  className="progress-bar"
                  style={{ width: width, background: background }}
                ></div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Statistics;
