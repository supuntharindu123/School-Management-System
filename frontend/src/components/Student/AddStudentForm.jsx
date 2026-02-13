import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStudent } from "../../features/adminFeatures/students/studentService";
import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";

import Button from "../CommonElements/Button";
import Modal from "../modal";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";

export default function AddStudentForm({ isOpen, isClose }) {
  const [form, setForm] = useState({
    Username: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    FullName: "",
    BirthDay: "",
    Address: "",
    City: "",
    Gender: "",
    GradeId: "",
    ClassNameId: "",
    AcademicYearId: "",
    GuardianName: "",
    GuardianRelation: "",
    GuardianDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, msg: "" });
  const [success, setSuccess] = useState({ open: false, msg: "" });
  const [classes, setClasses] = useState([]);

  const dispatch = useDispatch();
  const grades = useSelector((state) => state.grades.grades);
  const years = useSelector((state) => state.years.years);

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getAllYears());
  }, [dispatch]);

  useEffect(() => {
    if (form.GradeId) {
      (async () => {
        try {
          const cls = await getClassesByGrade(Number(form.GradeId));
          setClasses(Array.isArray(cls) ? cls : []);
          setForm((prev) => ({ ...prev, ClassNameId: "" }));
        } catch {
          setClasses([]);
        }
      })();
    }
  }, [form.GradeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      GradeId: Number(form.GradeId),
      ClassNameId: Number(form.ClassNameId),
      AcademicYearId: form.AcademicYearId
        ? Number(form.AcademicYearId)
        : undefined,
    };

    try {
      const message = await createStudent(payload);
      setSuccess({
        open: true,
        msg: message || "Student enrolled successfully",
      });
      dispatch(GetAllStudents());
    } catch (err) {
      const msg =
        err?.response?.data || err?.message || "Failed to add student";
      setError({ open: true, msg });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-700 ml-1";

  return (
    <>
      <Modal open={isOpen} onClose={isClose} title="Enroll new student">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* account section */}
          <section className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <header className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Account security
              </h3>
              <span className="text-sm font-medium text-cyan-600">
                Step 1 of 4
              </span>
            </header>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div>
                <label className={labelClasses}>Username*</label>
                <input
                  name="Username"
                  value={form.Username}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="johndoe123"
                />
              </div>
              <div>
                <label className={labelClasses}>Email*</label>
                <input
                  type="email"
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className={labelClasses}>Phone number*</label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={form.PhoneNumber}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="071 234 5678"
                />
              </div>
              <div>
                <label className={labelClasses}>Password*</label>
                <input
                  type="password"
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>

          {/* personal section */}
          <section className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <header className="bg-slate-50/50 px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                Personal information
              </h3>
            </header>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClasses}>Full name*</label>
                <input
                  name="FullName"
                  value={form.FullName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Birth day*</label>
                <input
                  type="date"
                  name="BirthDay"
                  value={form.BirthDay}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Gender*</label>
                <select
                  name="Gender"
                  value={form.Gender}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Home address*</label>
                <input
                  name="Address"
                  value={form.Address}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {/* academic section */}
          <section className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <header className="bg-slate-50/50 px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                Academic placement
              </h3>
            </header>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div>
                <label className={labelClasses}>Grade*</label>
                <select
                  name="GradeId"
                  value={form.GradeId}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="">Select grade</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gradeName || `Grade ${g.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Class*</label>
                <select
                  name="ClassNameId"
                  value={form.ClassNameId}
                  onChange={handleChange}
                  disabled={!form.GradeId}
                  className={inputClasses}
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.classNameId || c.id}>
                      {c.className || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={isClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              label={loading ? "Enrolling..." : "Enroll student"}
              bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
            />
          </div>
        </form>
      </Modal>

      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={() => {
          setSuccess({ open: false, msg: "" });
          isClose();
        }}
      />

      <ErrorAlert
        isOpen={error.open}
        message={error.msg}
        onClose={() => setError({ open: false, msg: "" })}
      />
    </>
  );
}
