import React, { useState } from "react";
import { createTeacher } from "../../features/adminFeatures/teachers/teacherService";
import Button from "../CommonElements/Button";
import Alert from "../CommonElements/Alert";

export default function AddTeacherForm({ onSuccess, onSave }) {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("");
      setErrorMessage("Please fill in all required fields.");
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
        birthDay: form.birthDay, // YYYY-MM-DD
        address: form.address,
        city: form.city,
        gender: form.gender,
      };
      if (onSave) {
        await onSave(dto);
      } else {
        await createTeacher(dto);
      }
      setErrorMessage("");
      setSuccessMessage("Teacher added successfully");
      // Delegate close to parent handler
      onSuccess?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add teacher";
      setSuccessMessage("");
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
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
        <div className="flex-1">
          {errorMessage && (
            <Alert
              variant="error"
              message={errorMessage}
              onClose={() => setErrorMessage("")}
              className="mr-2"
            />
          )}
          {successMessage && (
            <Alert
              variant="success"
              message={successMessage}
              onClose={() => setSuccessMessage("")}
              className="mr-2"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSuccess}
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
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}
