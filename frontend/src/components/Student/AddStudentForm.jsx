import React, { useEffect, useState } from "react";
import { createStudent } from "../../features/adminFeatures/students/studentService";
import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../CommonElements/Button";
import Alert from "../CommonElements/Alert";
import Modal from "../modal";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";

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

  const gradesList = useSelector((state) => state.grades);
  const grades = gradesList.grades;
  const yearsList = useSelector((state) => state.years);
  const years = yearsList.years;

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getAllYears());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const gradeId = Number(form.GradeId) || 0;
        const cls = await getClassesByGrade(gradeId);
        setClasses(Array.isArray(cls) ? cls : []);
        if (
          !cls?.some(
            (c) =>
              String(
                c.classNameID ?? c.classNameId ?? c.ClassNameId ?? c.id,
              ) === String(form.ClassNameId),
          )
        ) {
          setForm((prev) => ({ ...prev, ClassNameId: "" }));
        }
      } catch {
        setClasses([]);
      }
    })();
  }, [form.GradeId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError({ open: false, msg: "" });
    setSuccess({ open: false, msg: "" });

    const requiredFields = [
      "Username",
      "Email",
      "PhoneNumber",
      "Password",
      "FullName",
      "BirthDay",
      "Address",
      "City",
      "Gender",
      "GradeId",
      "ClassNameId",
      "GuardianName",
      "GuardianDate",
    ];
    const missing = requiredFields.filter((f) => !String(form[f] || "").trim());
    if (missing.length) {
      setError({
        open: true,
        msg: `Please fill required fields: ${missing.join(", ")}`,
      });
      return;
    }

    const payload = {
      ...form,
      GradeId: Number(form.GradeId),
      ClassNameId: Number(form.ClassNameId),
      AcademicYearId: form.AcademicYearId
        ? Number(form.AcademicYearId)
        : undefined,
    };

    try {
      setLoading(true);
      const message = await createStudent(payload);
      setSuccess({ open: true, msg: message || "Student added successfully" });
      dispatch(GetAllStudents());
      // setForm((prev) => ({
      //   ...Object.fromEntries(Object.keys(prev).map((k) => [k, ""])),
      // }));
    } catch (err) {
      console.log(`error`, err.response.data);
      const msg =
        err?.response?.data || err?.message || "Failed to add student";
      setError({ open: true, msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal open={isOpen} onClose={isClose} title="Add Student">
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-medium text-neutral-800">Account</h3>
              <span className="text-xs text-neutral-500">Required</span>
            </header>
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Username*
                </label>
                <input
                  name="Username"
                  value={form.Username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  placeholder="e.g., johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Email*
                </label>
                <input
                  type="email"
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={form.PhoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  placeholder="e.g., +1 555 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Password*
                </label>
                <input
                  type="password"
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-medium text-neutral-800">Personal</h3>
              <span className="text-xs text-neutral-500">Required</span>
            </header>
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Full Name*
                </label>
                <input
                  name="FullName"
                  value={form.FullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Birth Day*
                </label>
                <input
                  type="date"
                  name="BirthDay"
                  value={form.BirthDay}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Address*
                </label>
                <input
                  name="Address"
                  value={form.Address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  City*
                </label>
                <input
                  name="City"
                  value={form.City}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Gender*
                </label>
                <select
                  name="Gender"
                  value={form.Gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-medium text-neutral-800">Academic</h3>
              <span className="text-xs text-neutral-500">Required</span>
            </header>
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Grade*
                </label>
                <select
                  name="GradeId"
                  value={form.GradeId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                >
                  <option value="">Select grade</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gradeName ?? g.GradeName ?? `Grade ${g.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Class*
                </label>
                <select
                  name="ClassNameId"
                  value={form.ClassNameId}
                  onChange={handleChange}
                  disabled={!form.GradeId}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option
                      key={c.id}
                      value={
                        c.classNameID ?? c.classNameId ?? c.ClassNameId ?? c.id
                      }
                    >
                      {c.name ??
                        c.className ??
                        c.ClassName ??
                        `Class ${c.classNameID ?? c.classNameId ?? c.ClassNameId ?? c.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Academic Year (optional)
                </label>
                <select
                  name="AcademicYearId"
                  value={form.AcademicYearId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                >
                  <option value="">Select academic year</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-medium text-neutral-800">Guardian</h3>
              <span className="text-xs text-neutral-500">Required</span>
            </header>
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Guardian Name*
                </label>
                <input
                  name="GuardianName"
                  value={form.GuardianName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Relation (optional)
                </label>
                <input
                  name="GuardianRelation"
                  value={form.GuardianRelation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  placeholder="Parent / Relative"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Guardian Date*
                </label>
                <input
                  type="date"
                  name="GuardianDate"
                  value={form.GuardianDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-2">
            <div className="flex-1">
              {error.open && (
                <Alert
                  variant="error"
                  message={error.msg}
                  onClose={() => setError({ open: false, msg: "" })}
                  className="mr-2"
                />
              )}
              {success.open && (
                <Alert
                  variant="success"
                  message={success.msg}
                  onClose={() => setSuccess({ open: false, msg: "" })}
                  className="mr-2"
                />
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              label={loading ? "Adding..." : "Add Student"}
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
