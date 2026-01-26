import React, { useState } from "react";

export default function AddTeacherDialog({ onClose, onSave }) {
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
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        fullName: form.fullName,
        birthDay: form.birthDay, // YYYY-MM-DD
        address: form.address,
        city: form.city,
        gender: form.gender,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">Add Teacher</p>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Username" error={errors.username}>
              <input
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Full Name" error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Phone Number" error={errors.phoneNumber}>
              <input
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Birth Day" error={errors.birthDay}>
              <input
                type="date"
                value={form.birthDay}
                onChange={(e) => setField("birthDay", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Address" error={errors.address}>
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="City" error={errors.city}>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </Field>
            <Field label="Gender" error={errors.gender}>
              <select
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-lg px-3 py-2 text-sm ${saving ? "bg-teal-300 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
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
