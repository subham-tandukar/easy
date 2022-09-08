import React from "react";
import img from "../../images/img.jpg"

const todayAbsent = [
  {
    id: 1,
    name: "Khulraj",
    leaveDate: "Leave Date",
    date: "2079/04/11",
    background: "#E6EDF7",
    color : "#000",
  },
  {
    id: 2,
    name: "Khulraj",
    leaveDate: "Leave Date",
    date: "2079/04/11",
    background: "#fff",
    color : "#000",
  },
  {
    id: 3,
    name: "Khulraj",
    leaveDate: "Leave Date",
    date: "2079/04/11",
    background: "#E6EDF7",
    color : "#000",
  },
];

const TodayAbsent = () => {
  return (
    <>
      <section className="card-box uk-padding-remove">
        <h4 className="card-title">Today Absent</h4>
        {todayAbsent.map((props) => {
          const { id, name, leaveDate, date, background,color } = props;

          return (
            <div
              className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap today-absent"
              style={{ background: background }}
              key={id}
              uk-scrollspy="cls: uk-animation-scale-up; delay: 500; repeat: false"
            >
              <div>
                <img src={img} alt="image" />
                <span className="uk-text-bold" style={{color:color}}>
                  {name}
                </span>
              </div>

              <div>
                <p className="uk-text-bold">{leaveDate}</p>
                <p>{date}</p>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default TodayAbsent;
