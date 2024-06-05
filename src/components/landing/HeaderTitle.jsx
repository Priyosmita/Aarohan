import React from "react";

const HeaderTitle = ({ title, description }) => {
  return (
    <>
      <div className="text-center mb-20 max-w-[400px] mx-auto">
        
        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-3xl font-semibold text-cyan-950"
        >
          {title}
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="400"
          className="text-md text-cyan-700 font-normal"
        >
          {description}
        </p>
      </div>
    </>
  );
};

export default HeaderTitle;