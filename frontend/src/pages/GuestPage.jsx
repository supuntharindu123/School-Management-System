import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/CommonElements/Button";
import ImageSlideshow from "../components/CommonElements/ImageSlideshow";
import logoPng from "../assets/logo.png";
import School01 from "../assets/school01.jpg";
import School02 from "../assets/school02.jpg";
import School03 from "../assets/school03.jpg";
import School04 from "../assets/school04.jpg";

export default function GuestPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle sticky header transparency effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* ================= Sticky Glass Header ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-cyan-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-cyan-400/30 transition duration-500"></div>
              <img
                src={logoPng}
                alt="School logo"
                className="relative h-12 w-12 transition-transform duration-500 group-hover:rotate-6 drop-shadow-sm"
              />
            </div>
            <div>
              <p
                className={`text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-cyan-900" : "text-white drop-shadow-md"
                }`}
              >
                Rajapaksha Central College
              </p>
              <p
                className={`text-xs font-medium tracking-wider uppercase ${
                  scrolled ? "text-cyan-600" : "text-cyan-50 opacity-90"
                }`}
              >
                Government School – Sri Lanka
              </p>
            </div>
          </div>
          <div className={`${scrolled ? "" : "opacity-90 hover:opacity-100"}`}>
            {/* Suggest using a white/outline button variant here if available, otherwise default is fine */}
            <Button label="Sign In Portal" onClick={() => navigate("/login")} />
          </div>
        </div>
      </header>

      {/* ================= Hero Section ================= */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <ImageSlideshow
          className="w-full h-full"
          images={[
            { src: School01, alt: "Campus" },
            { src: School02, alt: "Students" },
            { src: School03, alt: "Classroom" },
            { src: School04, alt: "Sports" },
          ]}
          intervalMs={4000}
          objectFit="cover"
          effect="fade"
          showIndicators={false}
        />

        {/* Gradient Overlay - Adjusted to Cyan tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/70 via-cyan-900/50 to-cyan-900/80"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <div className="animate-fade-in-up space-y-4 max-w-4xl">
            <div className="inline-block px-4 py-1 mb-4 border border-cyan-200/30 rounded-full bg-cyan-900/30 backdrop-blur-sm">
              <span className="text-cyan-50 text-sm font-medium tracking-widest uppercase">
                Est. 1980 • Excellence in Education
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-white drop-shadow-xl leading-tight">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                Future Leaders
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-cyan-50 font-light leading-relaxed opacity-90">
              Where discipline meets knowledge. Join a community dedicated to
              academic excellence, moral integrity, and national service.
            </p>
          </div>
        </div>

        {/* Wave Divider (SVG) - CHANGED TO WHITE to match body */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg
            className="w-full h-16 md:h-24 text-white"
            viewBox="0 0 1440 320"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* ================= Content Layout ================= */}
      <section className="relative px-6 max-w-7xl mx-auto -mt-12 z-10 pb-20">
        {/* Intro Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Principal's Note */}
          <div className="md:col-span-8 bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(6,182,212,0.15)] border border-cyan-100 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden group hover:border-cyan-200 transition-colors">
            {/* Decorative BG Blob */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

            <div className="relative z-10 w-full">
              <h2 className="text-2xl font-serif font-bold text-cyan-900 mb-2">
                Message from the Principal
              </h2>
              <p className="text-slate-600 leading-relaxed italic">
                "Welcome to Rajapaksha Central College. We believe that every
                child is a unique individual with the potential to change the
                world. Our mission is not just to teach, but to inspire."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold text-cyan-900">
                    Mr. Rajapaksha
                  </p>
                  <p className="text-xs text-cyan-600 uppercase tracking-wider">
                    Principal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat */}
          <div className="md:col-span-4 bg-gradient-to-br from-cyan-600 to-cyan-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            {/* Hover Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

            <h3 className="text-5xl font-bold mb-1 relative z-10 drop-shadow-sm">
              40+
            </h3>
            <p className="text-cyan-100 font-medium uppercase tracking-widest text-sm relative z-10">
              Years of History
            </p>
          </div>
        </div>

        {/* Vision & Mission Split */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <SectionHeader title="Our Philosophy" subtitle="Vision & Mission" />
            <div className="space-y-5">
              <ExpandableCard
                title="Our Vision"
                bg="bg-white border-l-4 border-l-cyan-400"
                content="To nurture disciplined, knowledgeable, and compassionate students who uphold Sri Lankan values while confidently facing global challenges."
              />
              <ExpandableCard
                title="Our Mission"
                bg="bg-white border-l-4 border-l-cyan-600"
                content="To provide a holistic and high-quality education that promotes academic excellence, discipline, and strong moral values, preserving cultural heritage while encouraging innovation."
              />
            </div>
          </div>

          {/* Decorative Image Composition */}
          <div className="relative hidden lg:block h-[450px]">
            {/* Soft background blob behind images */}
            <div className="absolute inset-0 bg-cyan-50/50 rounded-full blur-3xl transform scale-90"></div>

            <div className="absolute top-4 left-8 w-64 h-80 bg-white rounded-2xl rotate-3 transform shadow-2xl overflow-hidden border-4 border-white ring-1 ring-cyan-100">
              <img
                src={School02}
                alt="Students"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="absolute bottom-8 right-8 w-64 h-80 bg-white rounded-2xl -rotate-6 transform shadow-2xl overflow-hidden border-4 border-white ring-1 ring-cyan-100 z-10">
              <img
                src={School04}
                alt="Sports"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="w-24 h-24 bg-white/90 backdrop-blur rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center text-4xl border border-cyan-50">
                🎓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Clean Cyan Footer ================= */}
      <footer className="bg-cyan-950 text-cyan-100 py-12 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logoPng}
                alt="Logo"
                className="h-10 w-10 brightness-0 invert opacity-90"
              />
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                Rajapaksha Central
              </span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs font-light">
              Dedicated to molding the future generation through education,
              discipline, and cultural values.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="hover:text-cyan-400 cursor-pointer transition flex items-center gap-2">
                <span className="opacity-50">›</span> Admission Procedures
              </li>
              <li className="hover:text-cyan-400 cursor-pointer transition flex items-center gap-2">
                <span className="opacity-50">›</span> News & Events
              </li>
              <li className="hover:text-cyan-400 cursor-pointer transition flex items-center gap-2">
                <span className="opacity-50">›</span> Academic Calendar
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 tracking-wide">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm font-light opacity-90">
              <p>123 School Lane, City, Sri Lanka</p>
              <p className="text-cyan-400">info@rajapakshacc.lk</p>
              <p>+94 11 234 5678</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-cyan-900 text-xs text-cyan-400/60 uppercase tracking-widest">
          © {new Date().getFullYear()} Rajapaksha Central College • Ministry of
          Education
        </div>
      </footer>
    </main>
  );
}

/* ================= Styled Sub-Components ================= */

function SectionHeader({ title, subtitle, center }) {
  return (
    <div className={center ? "flex flex-col items-center" : ""}>
      <span className="text-cyan-600 font-bold tracking-widest uppercase text-xs mb-2 block">
        {subtitle}
      </span>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-cyan-950 relative inline-block">
        {title}
        {/* Subtle decorative dot */}
        <span className="absolute -right-3 top-0 text-cyan-400 text-3xl leading-none">
          .
        </span>
      </h2>
      <div
        className={`h-1.5 w-20 bg-cyan-500 rounded-full mt-5 ${center ? "mx-auto" : ""}`}
      ></div>
    </div>
  );
}

function ExpandableCard({ title, content, icon, bg }) {
  return (
    <div
      className={`group p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ${bg}`}
    >
      <div className="flex items-start gap-4">
        <div>
          <h3 className="text-xl font-bold text-cyan-900 mb-2 group-hover:text-cyan-600 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}
