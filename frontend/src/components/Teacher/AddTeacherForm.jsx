import { useState } from "react";
import { createTeacher } from "../../features/adminFeatures/teachers/teacherService";
import Button from "../CommonElements/Button";
import Field from "../CommonElements/Field";
import Modal from "../modal";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";

export default function AddTeacherForm({ isOpen, isClose }) {
  const initialState = {
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    fullName: "",
    birthDay: "",
    address: "",
    city: "",
    gender: "",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    open: false,
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState({
    open: false,
    message: "",
  });

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
  };

  const validate = () => {
    const e = {};
    const req = [
      "username",
      "email",
      "phoneNumber",
      "password",
      "fullName",
      "birthDay",
      "address",
      "city",
      "gender",
    ];

    req.forEach((k) => {
      if (!form[k]?.trim()) e[k] = "This field is required";
    });

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email address";
    if (form.phoneNumber && !/^\+?[0-9\-\s]{7,}$/.test(form.phoneNumber))
      e.phoneNumber = "Invalid phone number format";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setErrorMessage({
        open: true,
        message: "Please correct the highlighted errors.",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await createTeacher(form);
      setSuccessMessage({
        open: true,
        message: res || "Teacher profile created successfully",
      });
      setForm(initialState); // reset form on success
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add teacher";
      setErrorMessage({ open: true, message: msg });
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all";

  return (
    <>
      <Modal open={isOpen} onClose={isClose} title="Register new teacher">
        <div className="space-y-6">
          {/* form sections */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <header className="bg-slate-50/50 px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                Personal & account details
              </h3>
            </header>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <Field label="Full name*" error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="e.g. John Doe"
                  className={inputClasses}
                />
              </Field>

              <Field label="Username*" error={errors.username}>
                <input
                  value={form.username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="johndoe_edu"
                  className={inputClasses}
                />
              </Field>

              <Field label="Email address*" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="teacher@school.com"
                  className={inputClasses}
                />
              </Field>

              <Field label="Phone number*" error={errors.phoneNumber}>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  placeholder="+94..."
                  className={inputClasses}
                />
              </Field>

              <Field label="Password*" error={errors.password}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="••••••••"
                  className={inputClasses}
                />
              </Field>

              <Field label="Date of birth*" error={errors.birthDay}>
                <input
                  type="date"
                  value={form.birthDay}
                  onChange={(e) => setField("birthDay", e.target.value)}
                  className={inputClasses}
                />
              </Field>

              <Field label="Gender*" error={errors.gender}>
                <select
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="City*" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="e.g. Colombo"
                  className={inputClasses}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Residential address*" error={errors.address}>
                  <input
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Enter full street address"
                    className={inputClasses}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={isClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={saving}
              label={saving ? "Saving profile..." : "Register teacher"}
              bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
            />
          </div>
        </div>
      </Modal>

      <SuccessAlert
        isOpen={successMessage.open}
        message={successMessage.message}
        onClose={isClose}
      />

      <ErrorAlert
        isOpen={errorMessage.open}
        message={errorMessage.message}
        onClose={() => setErrorMessage({ open: false, message: "" })}
      />
    </>
  );
}
