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
          certification_number: data.certification_number ?? "",
          bio: data.bio ?? "",
        });
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        setError("Only mechanics can access this page.");
      } else {
        setError("Unable to load mechanic profile.");
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
        experience_years: Number(form.experience_years),
      };

      if (profile) {
        response = await mechanicProfileService.updateProfile(data);
      } else {
        response = await mechanicProfileService.createProfile(data);
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
          const firstError = Object.values(errors)[0]?.[0];
          setError(firstError || "Please check the form fields.");
        } else {
          setError(error.response.data.message || "Validation failed.");
        }
      } else {
        setError(
          error.response?.data?.message || "Unable to save mechanic profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatus = () => {
    if (!profile) return null;

    switch (profile.certification_status) {
      case "certified":
        return {
          label: "Certified",
          icon: CheckCircle,
          className: "bg-[#E6F4EA] text-[#065F46] border-[#065F46]/20",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-rose-50 text-rose-700 border-rose-200",
        };

      default:
        return {
          label: "Pending Verification",
          icon: Clock,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#E2ECE6] border-t-[#065F46]" />
          <p className="mt-4 text-xs font-medium text-[#5A6E63]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#111915]">
          Mechanic Profile
        </h1>
        <p className="mt-1 text-xs text-[#5A6E63]">
          Manage your professional experience, credentials, and contact details.
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-[#065F46]/20 bg-[#E6F4EA] px-4 py-3 text-xs font-semibold text-[#065F46]">
          {success}
        </div>
      )}

      {/* Certification Status Box */}
      {status && (
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm shadow-[#065F46]/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111915]">
                Verification Status
              </h2>
              <p className="mt-0.5 text-xs text-[#5A6E63]">
                Your official account validation state on CarCheck
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${status.className}`}
            >
              <status.icon size={15} />
              {status.label}
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E2ECE6] bg-white shadow-sm shadow-[#065F46]/5 overflow-hidden"
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-[#111915]">
              Professional Information
            </h2>
            <p className="mt-0.5 text-xs text-[#5A6E63]">
              Ensure your details match your certifications and area of service.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+212 6 XX XX XX XX"
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                City
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Beni Mellal"
                  required
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Specialization
              </label>
              <div className="relative">
                <Wrench
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="Engine, Brakes, Diagnostics..."
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Experience (Years)
              </label>
              <div className="relative">
                <BriefcaseBusiness
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
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
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* Certification Number */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Certification Number
              </label>
              <div className="relative">
                <Award
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8BA094]"
                />
                <input
                  type="text"
                  name="certification_number"
                  value={form.certification_number}
                  onChange={handleChange}
                  placeholder="Certification license number"
                  className="w-full rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>

            {/* Professional Bio */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#111915]">
                Professional Bio
              </label>
              <div className="relative">
                <FileText
                  size={16}
                  className="absolute left-3.5 top-3 text-[#8BA094]"
                />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="2000"
                  placeholder="Tell clients about your background, tools, and automotive domain expertise..."
                  className="w-full resize-none rounded-xl border border-[#E2ECE6] bg-white py-2.5 pl-10 pr-4 text-xs text-[#111915] placeholder-[#8BA094] outline-none transition focus:border-[#065F46] focus:ring-2 focus:ring-[#065F46]/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end border-t border-[#E2ECE6] bg-[#F0F7F2]/40 px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#065F46]/20 transition hover:bg-[#044734] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
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