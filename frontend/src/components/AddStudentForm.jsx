import React, { useEffect, useState } from "react";
import { createStudent } from "../features/adminFeatures/students/studentApi";
import { getGrades } from "../features/class/gradeService";
import { getClassesByGrade } from "../features/class/classService";
import { getYears } from "../features/class/yearService";

export default function AddStudentForm({ onSuccess }) {
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
    CurrentGradeID: "",
    CurrentClassID: "",
    CurrentYearID: "",
    GuardianName: "",
    GuardianRelation: "",
    GuardianDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [g, y] = await Promise.all([getGrades(), getYears()]);
        setGrades(Array.isArray(g) ? g : []);
        setYears(Array.isArray(y) ? y : []);
      } catch {
        console.log("Failed to load grades or years");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const gradeId = Number(form.CurrentGradeID) || 0;
        const cls = await getClassesByGrade(gradeId);
        setClasses(Array.isArray(cls) ? cls : []);
        if (!cls?.some((c) => String(c.id) === String(form.CurrentClassID))) {
          setForm((prev) => ({ ...prev, CurrentClassID: "" }));
        }
      } catch {
        setClasses([]);
      }
    })();
  }, [form.CurrentGradeID]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      "CurrentGradeID",
      "CurrentClassID",
      "CurrentYearID",
      "GuardianName",
      "GuardianDate",
    ];
    const missing = requiredFields.filter((f) => !String(form[f] || "").trim());
    if (missing.length) {
      setError(`Please fill required fields: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      ...form,
      CurrentGradeID: Number(form.CurrentGradeID),
      CurrentClassID: Number(form.CurrentClassID),
      CurrentYearID: Number(form.CurrentYearID),
    };

    try {
      setLoading(true);
      const message = await createStudent(payload);
      setSuccess(
        typeof message === "string" ? message : "Student added successfully"
      );
      onSuccess?.(message);
      setForm((prev) => ({
        ...Object.fromEntries(Object.keys(prev).map((k) => [k, ""])),
      }));
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add student";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Gender*
            </label>
            <input
              name="Gender"
              value={form.Gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              placeholder="Male / Female"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-medium text-neutral-800">Academic</h3>
          <span className="text-xs text-neutral-500">Required</span>
        </header>
        <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Current Grade*
            </label>
            <select
              name="CurrentGradeID"
              value={form.CurrentGradeID}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              Current Class*
            </label>
            <select
              name="CurrentClassID"
              value={form.CurrentClassID}
              onChange={handleChange}
              disabled={!form.CurrentGradeID}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className ?? c.ClassName ?? `Class ${c.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Academic Year*
            </label>
            <select
              name="CurrentYearID"
              value={form.CurrentYearID}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year ?? y.Year}
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </form>
  );
}
