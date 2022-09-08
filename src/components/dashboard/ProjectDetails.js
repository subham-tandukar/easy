import React from "react";

const projectDetails = [
  {
    id: 1,
    name: "Project Name",
    status: "Status",
    fontWeight: "uk-text-bold",
    background: "#E6EDF7",
  },
  {
    id: 2,
    name: "Project Name",
    status: "Completed",
    fontWeight: "uk-text-normal",
    background: "#fff",
  },
  {
    id: 3,
    name: "Project Name",
    status: "Completed",
    fontWeight: "uk-text-normal",
    background: "#E6EDF7",
  },
  {
    id: 4,
    name: "Project Name",
    status: "Completed",
    fontWeight: "uk-text-normal",
    background: "#fff",
  },
  {
    id: 5,
    name: "Project Name",
    status: "Completed",
    fontWeight: "uk-text-normal",
    background: "#E6EDF7",
  },
];

const ProjectDetails = () => {
  return (
    <>
      <section className="card-box uk-margin-large-bottom uk-padding-remove">
        <h4 className="card-title">Project Details</h4>
        {projectDetails.map((props) => {
          const { id, name, status, background, fontWeight } = props;
          return (
            <div key={id} uk-scrollspy="cls: uk-animation-scale-up; delay: 500; repeat: false">
              <div
                className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap project-details"
                style={{ background: background }}
              >
                <div>
                  <p className={fontWeight}>{name}</p>
                </div>
                <div>
                  <p className={fontWeight}>{status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ProjectDetails;
