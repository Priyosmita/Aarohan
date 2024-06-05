import React from "react";
import Img1 from "../../assets/landing/sucess.png";
import Img2 from "../../assets/landing/doubt.png";
import Img3 from "../../assets/landing/mentor.png";
import HeaderTitle from "./HeaderTitle";
const ServicesData = [
  {
    id: 1,
    img: Img3,
    name: "Mentor Support",
    description:
      "Experience personalized guidance like never before with our Mentor Support feature. Our dedicated mentors are here to offer expert advice, clarify concepts, and provide invaluable support tailored to your learning journey.",
    aosDelay: "100",
  },
  {
    id: 2,
    img: Img1,
    name: "Community Engagement",
    description:
    "Join a vibrant learning community where collaboration fuels growth and innovation. Our Community Engagement feature brings together like-minded learners, fostering connections, discussions, and knowledge sharing.",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img2,
    name: "Doubt Clearing",
    description:
    "Say goodbye to confusion and welcome clarity with our Doubt Clearing feature. Get instant solutions to your questions, clarify concepts, and overcome learning hurdles with ease.",
    aosDelay: "300",
  },
];
const Services = () => {
  return (
   
    <div className="bg-cyan-50 ">
      <div className="py-12 lg:py-20 mx-16">
        <div className="container ">
          <HeaderTitle
            title="Services"
            
            description={
                "Empowerment through education, connection, and collaboration. Discover the possibilities with our virtual learning platform"
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 md:gap-5 place-items-center">
            {ServicesData.map((service) => (
              <div
                data-aos="fade-up"
                data-aos-delay={service.aosDelay}
                className="rounded-2xl bg-cyan-100 hover:bg-primary hover:text-white relative shadow-xl duration-high group max-w-[350px]"
              >
                <div className="max-h-fit">
                  <img
                    src={service.img}
                    alt=""
                    className="max-w-[250px] block mx-auto transform -translate-y-16
                   group-hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-2 text-center">
                  <h1 className="text-xl font-bold text-cyan-950  group-hover:text-cyan-600">{service.name}</h1>
                  <p className="text-cyan-800  group-hover:text-cyan-500 duration-high text-md ">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Services;