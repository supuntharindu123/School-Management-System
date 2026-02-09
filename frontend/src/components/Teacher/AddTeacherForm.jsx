import { useState } from "react";
import { createTeacher } from "../../features/adminFeatures/teachers/teacherService";
import Button from "../CommonElements/Button";
import Field from "../CommonElements/Field";
import Modal from "../modal";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";

export default function AddTeacherForm({ isOpen, isClose }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    fullName: "",
    birthDay: "",
    address: "",
    city: "",
    gender: "",
  });
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

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
      if (!form[k]) e[k] = "Required";
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Invalid email";
    if (form.phoneNumber && !/^\+?[0-9\-\s]{7,}$/.test(form.phoneNumber))
      e.phoneNumber = "Invalid phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setSuccessMessage({ open: false, message: "" });
      setErrorMessage({
        open: true,
        message: "Please fill in all required fields.",
      });
      return;
    }
    setSaving(true);
    try {
      const dto = {
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        fullName: form.fullName,
        birthDay: form.birthDay,
        address: form.address,
        city: form.city,
        gender: form.gender,
      };

      const res = await createTeacher(dto);

      setErrorMessage({ open: false, message: "" });
      setSuccessMessage({
        open: true,
        message: res || "Teacher added successfully",
      });
    } catch (err) {
      const msg =
        err?.response?.data || err?.message || "Failed to add teacher";
      setSuccessMessage({ open: false, message: "" });
      setErrorMessage({ open: true, message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal open={isOpen} onClose={isClose} title="Add Teacher">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Username" error={errors.username}>
              <input
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Full Name" error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Phone Number" error={errors.phoneNumber}>
              <input
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Birth Day" error={errors.birthDay}>
              <input
                type="date"
                value={form.birthDay}
                onChange={(e) => setField("birthDay", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Address" error={errors.address}>
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="City" error={errors.city}>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
            </Field>
            <Field label="Gender" error={errors.gender}>
              <select
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <button
                type="cancel"
                className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
              >
                Cancel
              </button>
              <Button
                type="submit"
                onClick={handleSave}
                bgcolor="bg-cyan-800"
                disabled={saving}
                label={saving ? "Saving..." : "Save"}
              />
            </div>
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
