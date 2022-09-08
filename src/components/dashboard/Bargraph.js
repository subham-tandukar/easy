import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Bargraph = () => {
  return (
    <>
      <section className="card-box py-lg-2 px-lg-5">
        <h4 className="card-title mb-4">Bar Graph</h4>
        <div>
          <Bar
            height={300}
            width={500}
            data={{
              labels: [0, 1, 2, 3, 4],
              datasets: [
                {
                  label: "Numbers",
                  data: [10, 15, 2, 5, 9],
                  backgroundColor: "#6C9BD1",
                  borderWidth: 1,
                },
                {
                  label: "Quantity",
                  data: [13, 12, 9, 7, 6],
                  backgroundColor: "#0049ae",
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </section>
    </>
  );
};

export default Bargraph;
