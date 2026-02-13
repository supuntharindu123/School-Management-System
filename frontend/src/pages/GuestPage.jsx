import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/CommonElements/Button";
import ImageSlideshow from "../components/CommonElements/ImageSlideshow";

// assets
import logoPng from "../assets/logo.png";
import School01 from "../assets/school01.jpg";
import School02 from "../assets/school02.jpg";
import School03 from "../assets/school03.jpg";
import School04 from "../assets/school04.jpg";

export default function GuestPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // handle sticky header transparency effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* ================= sticky glass header ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-cyan-100 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-cyan-400/40 transition duration-500"></div>
              <img
                src={logoPng}
                alt="School Logo"
                className="relative h-12 w-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 drop-shadow-md"
              />
            </div>
            <div>
              <p
                className={`text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-cyan-950" : "text-white drop-shadow-lg"
                }`}
              >
                Rajapaksha Central College
              </p>
              <p
                className={`text-xs font-semibold tracking-widest uppercase ${
                  scrolled ? "text-cyan-600" : "text-cyan-50/90"
                }`}
              >
                Government School – Sri Lanka
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${scrolled ? "scale-100" : "scale-105"}`}
          >
            <Button
              label="Sign In Portal"
              onClick={() => navigate("/login")}
              bgcolor={
                scrolled
                  ? "bg-cyan-700"
                  : "bg-white/20 hover:bg-white/30 backdrop-blur-md"
              }
              textcolor={scrolled ? "text-white" : "text-white"}
            />
          </div>
        </div>
      </header>

      {/* ================= hero section ================= */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <ImageSlideshow
          className="w-full h-full"
          images={[
            { src: School01, alt: "Campus View" },
            { src: School02, alt: "Student Life" },
            { src: School03, alt: "Classroom Learning" },
            { src: School04, alt: "Sports Activities" },
          ]}
          intervalMs={5000}
          objectFit="cover"
          effect="fade"
          showIndicators={false}
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-cyan-950/80 via-cyan-900/40 to-white"></div>

        {/* hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-block px-6 py-2 mb-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">
                Established 1980 • Excellence In Education
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold font-serif  text-white drop-shadow-2xl leading-tight">
              Rajapaksha <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-white">
                Central College
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-cyan-50 font-medium leading-relaxed opacity-95">
              Where discipline meets knowledge. Join a community dedicated to
              academic excellence, moral integrity, and national service.
            </p>
            <div className="pt-4">
              <button
                onClick={() =>
                  window.scrollTo({ top: 800, behavior: "smooth" })
                }
                className="bg-white text-cyan-900 px-8 py-3 rounded-full font-bold shadow-xl hover:bg-cyan-50 transition-all hover:-translate-y-1"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= content layout ================= */}
      <section className="relative px-6 max-w-7xl mx-auto -mt-20 z-10 pb-24">
        {/* intro grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* principal's note */}
          <div className="md:col-span-8 bg-white rounded-[2rem] p-10 shadow-2xl border border-cyan-50 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group">
            {/* decorative background element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-50/50 rounded-bl-full -mr-12 -mt-12 z-0 group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10 w-full">
              <h2 className="text-3xl font-serif font-bold text-cyan-950 mb-4">
                Message From The Principal
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed italic font-light">
                "Welcome to Rajapaksha Central College. We believe that every
                child is a unique individual with the potential to change the
                world. Our mission is not just to teach, but to inspire."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                  MR
                </div>
                <div>
                  <p className="text-base font-bold text-cyan-950">
                    Mr. Rajapaksha
                  </p>
                  <p className="text-xs text-cyan-600 font-bold uppercase tracking-widest">
                    Principal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* quick stat card */}
          <div className="md:col-span-4 bg-linear-to-br from-cyan-700 to-cyan-900 text-white rounded-[2rem] p-10 shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h3 className="text-7xl font-black mb-2 relative z-10 text-white">
              40+
            </h3>
            <p className="text-cyan-200 font-bold uppercase tracking-[0.2em] text-xs relative z-10">
              Years Of History
            </p>
          </div>
        </div>

        {/* vision & mission section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <SectionHeader title="Our Philosophy" subtitle="Vision & Mission" />
            <div className="space-y-6">
              <ExpandableCard
                title="Our Vision"
                bg="bg-white border-l-8 border-cyan-400"
                content="To nurture disciplined, knowledgeable, and compassionate students who uphold Sri Lankan values while confidently facing global challenges."
              />
              <ExpandableCard
                title="Our Mission"
                bg="bg-white border-l-8 border-cyan-700"
                content="To provide a holistic and high-quality education that promotes academic excellence, discipline, and strong moral values, preserving cultural heritage while encouraging innovation."
              />
            </div>
          </div>

          {/* decorative image composition */}
          <div className="relative hidden lg:block h-[500px]">
            <div className="absolute inset-0 bg-cyan-100/30 rounded-full blur-3xl transform scale-90 animate-pulse"></div>

            <div className="absolute top-0 left-12 w-72 h-96 bg-white rounded-3xl rotate-3 shadow-2xl overflow-hidden border-[6px] border-white z-10">
              <img
                src={School02}
                alt="Students Of Rajapaksha"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition duration-700"
              />
            </div>
            <div className="absolute bottom-4 right-12 w-72 h-96 bg-white rounded-3xl -rotate-6 shadow-2xl overflow-hidden border-[6px] border-white z-20">
              <img
                src={School04}
                alt="School Sports"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= footer ================= */}
      <footer className="bg-cyan-950 text-cyan-100 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-cyan-400 via-cyan-500 to-white"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={logoPng}
                alt="Footer Logo"
                className="h-12 w-12 brightness-0 invert opacity-90"
              />
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Rajapaksha Central
              </span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed max-w-sm font-medium">
              Dedicated to molding the future generation through education,
              discipline, and cultural values. Since 1980, we have been a beacon
              of knowledge in Sri Lanka.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-white cursor-pointer transition-colors">
                Admission Procedures
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                News & Events
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Academic Calendar
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm font-medium opacity-80">
              <p>123 School Lane, City, Sri Lanka</p>
              <p className="text-cyan-400 font-bold">info@rajapakshacc.lk</p>
              <p>+94 11 234 5678</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-white/10 text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} Rajapaksha Central College • Ministry Of
          Education
        </div>
      </footer>
    </main>
  );
}

/* ================= sub-components ================= */

function SectionHeader({ title, subtitle, center }) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      <span className="text-cyan-600 font-black tracking-[0.2em] uppercase text-xs mb-3 block">
        {subtitle}
      </span>
      <h2 className="text-4xl md:text-5xl font-serif font-black text-cyan-950 relative inline-block">
        {title}
        <span className="absolute -right-4 bottom-2 text-cyan-400 text-5xl">
          .
        </span>
      </h2>
      <div
        className={`h-2 w-24 bg-cyan-500 rounded-full mt-6 ${center ? "mx-auto" : ""}`}
      ></div>
    </div>
  );
}

function ExpandableCard({ title, content, bg }) {
  return (
    <div
      className={`group p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 ${bg}`}
    >
      <h3 className="text-2xl font-bold text-cyan-950 mb-3 group-hover:text-cyan-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-base font-medium">
        {content}
      </p>
    </div>
  );
}
