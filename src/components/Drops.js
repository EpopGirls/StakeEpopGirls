import { Fragment } from "react";
import Timeline from "./Timeline";

const Drops = () => {
  const dropData = [
    {
      img: "img/drops/1.png",
      title: "Epop Girl #1",
    },
    {
      img: "img/drops/2.png",
      title: "Epop Girl #2",
    },
    {
      img: "img/drops/3.png",
      title: "Epop Girl #3",
    },
    {
      img: "img/drops/4.png",
      title: "Epop Girl #4",
    },
    {
      img: "img/drops/5.png",
      title: "Epop Girl #5",
    },
    {
      img: "img/drops/6.png",
      title: "Epop Girl #6",
    },
  ];

  return (
    <Fragment>
      {/* Drops Section */}
      <section id="drop">
        <div className="container">
          <Timeline />
        </div>
      </section>
      {/* !Drops Section */}
    </Fragment>
  );
};

export default Drops;
