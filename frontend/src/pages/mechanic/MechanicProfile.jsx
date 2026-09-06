import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Wrench,
  Award,
  BriefcaseBusiness,
  FileText,
  Save,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import mechanicProfileService from "../../services/mechanicProfileService";

export default function MechanicProfile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    city: "",
    specialization: "",
    experience_years: "",
    certification_number: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await mechanicProfileService.getProfile();

      const data = response.data.profile;

      setProfile(data);

      if (data) {
        setForm({
          phone: data.phone ?? "",
          city: data.city ?? "",
          specialization: data.specialization ?? "",
          experience_years: data.experience_years ?? "",
          certification_number:
            data.certification_number ?? "",
          bio: data.bio ?? "",
        });
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        setError(
          "Only mechanics can access this page."
        );
      } else {
        setError(
          "Unable to load mechanic profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let response;

      const data = {
        ...form,
        experience_years:
          Number(form.experience_years),
      };

      if (profile) {
        response =
          await mechanicProfileService.updateProfile(
            data
          );
      } else {
        response =
          await mechanicProfileService.createProfile(
            data
          );
      }

      setProfile(response.data.profile);

      setSuccess(
        profile
          ? "Profile updated successfully."
          : "Profile created successfully."
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;

        if (errors) {
          const firstError =
            Object.values(errors)[0]?.[0];

          setError(
            firstError ||
              "Please check the form fields."
          );
        } else {
          setError(
            error.response.data.message ||
              "Validation failed."
          );
        }
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to save mechanic profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatus = () => {
    if (!profile) {
      return null;
    }

    switch (profile.certification_status) {
      case "certified":
        return {
          label: "Certified",
          icon: CheckCircle,
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          label: "Pending",
          icon: Clock,
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Wrench size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Mechanic Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your professional information
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Certification Status */}
      {status && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Certification Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your mechanic account verification status
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${status.className}`}
            >
              <status.icon size={17} />

              {status.label}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >

        {/* Personal Information */}
        <div className="border-b border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Professional Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide accurate information about your
              mechanic experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+212 6 XX XX XX XX"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Beni Mellal"
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Specialization
              </label>

              <div className="relative">
                <Wrench
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="Engine, Brakes, Diagnostics..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Experience (years)
              </label>

              <div className="relative">
                <BriefcaseBusiness
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="experience_years"
                  value={form.experience_years}
                  onChange={handleChange}
                  min="0"
                  max="60"
                  required
                  placeholder="5"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Certification Number */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Certification Number
              </label>

              <div className="relative">
                <Award
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="certification_number"
                  value={form.certification_number}
                  onChange={handleChange}
                  placeholder="Certification number"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Professional Bio
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="5"
                  maxLength="2000"
                  placeholder="Tell clients about your experience and expertise..."
                  className="w-full resize-none rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end bg-slate-50 px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : profile
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}