import React from "react";
import Slider from "react-slick";
import HeaderTitle from "./HeaderTitle";

const settings = {
  dots: false,
  arrows: false,
  loop: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  mobileFirst: true,
  autoplaySpeed: 3000,
  cssEase: "linear",
  pauseOnHover: true,
};
const TestimonialData = [
  {
    id: 1,
    name: "Kavita",
    role: "Student",
    testimonial:
      "The Student Dashboard has been a game-changer for me. It's so easy to keep track of my courses, assignments, and progress all in one place. Plus, having quick access to mentor support whenever I need it has been incredibly helpful. Highly recommend!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 1,
    name: "Hitesh",
    role: "Teacher",
    testimonial:
      "I've been teaching for years, and the Teacher Dashboard has completely transformed my classroom experience. It streamlines administrative tasks, allowing me to dedicate more time to teaching and engaging with my students. The ability to create and share content seamlessly has also enhanced the learning experience for everyone involved. I can't imagine teaching without it now.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 1,
    name: "Arjun",
    role: "Student",
    testimonial:
      "As someone with a busy schedule, the Student Dashboard has been a lifesaver. It helps me stay organized and focused on my studies. I love being able to see my progress and track my goals. It truly makes learning more manageable and enjoyable.",
    img: "https://picsum.photos/103/103",
  },
];
const Testimonial = () => {
  return (
    <>
      <div className="py-10 bg-cyan-50 text-center">
        <div className="container ">
          {/* Header  */}
          <HeaderTitle
            title="Testimonial"
            subtitle="What our customers say"
            description={
              "Don't just take our word for it. Hear what our customers have to say about their experience with our platform."
            }
          />
          {/* testimonial */}
          <div className="max-w-[600px] mx-auto">
            <Slider {...settings}>
              {TestimonialData.map((data) => (
                <div data-aos="fade-up" key={data.id}>
                  <div className="text-center bg-cyan-100 shadow-lg p-4 rounded-xl space-y-3 my-8 mx-5">
                    <img
                      className="rounded-full block mx-auto"
                      src={data.img}
                      alt=""
                    />
                    <p className=" text-md font-medium font-poppins text-cyan-700">{data.testimonial}</p>
                    <h1 className="text-2xl text-cyan-950 font-bold">{data.name}</h1>
                    <h1 className="text-xl text-cyan-900 font-normal">{data.role}</h1>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;