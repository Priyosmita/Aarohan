import React from "react";
import Student from "../../assets/landing/Student.png";
import { MdCastForEducation } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";

const Banner = () => {
  return (
    <>
      <div className="min-h-[550px] bg-cyan-50">
        <div className="min-h-[550px] flex justify-center items-center backdrop-blur-xl py-12 sm:py-0 ">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image section */}
              <div data-aos="flip-up">
                <img
                  src={Student}
                  alt="biryani img"
                  className="max-w-[430px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)]"
                />
              </div>
              {/* text content section */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0">
                <h1
                  data-aos="fade-up"
                  className="text-3xl sm:text-4xl font-semibold text-cyan-950"
                >
                  Empowerment through education, connection, and collaboration.
                </h1>
                <p
                  data-aos="fade-up"
                  className="text-md text-cyan-700  font-normal tracking-wide leading-5"
                >
                  Discover the possibilities with our virtual learning platform.
                  <br />
                  <br />
                  Join a vibrant learning community where collaboration fuels
                  growth and innovation. Our Community Engagement feature brings
                  together like-minded learners, fostering connections,
                  discussions, and knowledge sharing.
                </p>
                <div className="flex gap-6">
                  <div data-aos="fade-up">
                    <MdCastForEducation className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-cyan-400 text-white" />
                  </div>
                  <div data-aos="fade-up" data-aos-delay="200">
                    <PiStudentFill className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-cyan-400 text-white" />
                  </div>
                  <div data-aos="fade-up" data-aos-delay="400">
                    <GiTeacher className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-cyan-400 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-cyan-950">
                    Ready to get started?
                  </h1>
                  <p className="text-md text-cyan-700">
                    Sign up now and start your learning journey!  
                  </p>
                  <br />
                  <a href="/Login">
                  <button className=" bg-transparent text-cyan-950 py-2 px-4 rounded-md shadow-xl font-semibold hover:shadow-md border-cyan-900 border-2 transform
                   hover:scale-105 duration-300">
                    Get Started
                  </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;