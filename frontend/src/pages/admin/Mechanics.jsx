import { useEffect, useState } from "react";

import {
  Wrench,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Award,
  Star,
  Eye,
  X,
  Phone,
  FileText,
  Sparkles,
} from "lucide-react";

import adminMechanicService from "../../services/adminMechanicService";

const STATUS_STYLES = {
  certified: { bg: "bg-[#4ADE9A]/10 border-[#4ADE9A]/20", text: "text-[#4ADE9A]", icon: CheckCircle2, label: "Certified" },
  rejected: { bg: "bg-[#F2637A]/10 border-[#F2637A]/20", text: "text-[#F2637A]", icon: XCircle, label: "Rejected" },
  pending: { bg: "bg-[#F4A94A]/10 border-[#F4A94A]/20", text: "text-[#F4A94A]", icon: Clock3, label: "Pending" },
};

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  const loadMechanics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminMechanicService.getAll();

      setMechanics(response.data.mechanics || []);
    } catch (err) {
      console.error("Failed to load mechanics:", err);

      setError(
        err.response?.data?.message || "Failed to load mechanics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMechanics();
  }, []);

  const handleCertify = async (mechanic) => {
    const confirmed = window.confirm(
      `Are you sure you want to certify ${mechanic.name}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(mechanic.id);
      setError("");

      const response = await adminMechanicService.certify(mechanic.id);
      const updatedMechanic = response.data.mechanic;

      setMechanics((current) =>
        current.map((item) => (item.id === mechanic.id ? updatedMechanic : item))
      );

      if (selectedMechanic?.id === mechanic.id) {
        setSelectedMechanic(updatedMechanic);
      }
    } catch (err) {
      console.error("Failed to certify mechanic:", err);

      setError(
        err.response?.data?.message || "Failed to certify mechanic."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (mechanic) => {
    const confirmed = window.confirm(
      `Are you sure you want to reject ${mechanic.name}'s certification?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(mechanic.id);
      setError("");

      const response = await adminMechanicService.reject(mechanic.id);
      const updatedMechanic = response.data.mechanic;

      setMechanics((current) =>
        current.map((item) => (item.id === mechanic.id ? updatedMechanic : item))
      );

      if (selectedMechanic?.id === mechanic.id) {
        setSelectedMechanic(updatedMechanic);
      }
    } catch (err) {
      console.error("Failed to reject mechanic:", err);

      setError(
        err.response?.data?.message || "Failed to reject mechanic."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredMechanics = mechanics.filter((mechanic) => {
    const searchValue = search.toLowerCase();

    return (
      mechanic.name?.toLowerCase().includes(searchValue) ||
      mechanic.email?.toLowerCase().includes(searchValue) ||
      mechanic.mechanic_profile?.city?.toLowerCase().includes(searchValue) ||
      mechanic.mechanic_profile?.specialization?.toLowerCase().includes(searchValue)
    );
  });

  const getCertificationStatus = (mechanic) =>
    mechanic.mechanic_profile?.certification_status || "pending";

  const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon size={12} strokeWidth={1.75} />
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#37D6C4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Banner - Matching AdminDashboard Layout Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-7">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-white">
            Mechanics Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#8993A8] mt-1">
            Manage platform mechanics, verify identity, and review certification statuses.
          </p>
        </div>

        <div className="inline-flex self-start sm:self-auto items-center gap-2 rounded-xl border border-white/[0.06] bg-[#10151F] px-4 py-2.5 shadow-sm">
          <Wrench size={15} className="text-[#37D6C4]" />
          <div className="leading-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] block">Total</span>
            <span className="font-mono text-base font-semibold text-white">{mechanics.length}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-[#F2637A]/20 bg-[#F2637A]/10 p-4 text-xs font-medium text-[#F2637A]">
          {error}
        </div>
      )}

      {/* Search Bar Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            strokeWidth={1.75}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6478]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, city, or specialization..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0B0F18] py-2 pl-10 pr-4 text-xs text-[#E7ECF5] placeholder:text-[#5B6478] outline-none transition focus:border-[#37D6C4]/40 focus:ring-2 focus:ring-[#37D6C4]/10"
          />
        </div>
      </div>

      {/* Mechanics Data Table Panel */}
      <div className="bg-[#10151F] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-white/[0.06] bg-white/[0.01] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Verified & Pending Mechanics</h3>
            <p className="text-xs text-[#5B6478] mt-0.5">Filter and update mechanic credentials across the platform.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[750px] lg:min-w-[900px]">
            <thead className="bg-white/[0.01] border-b border-white/[0.06]">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478] text-left">
                <th className="px-5 py-3">Mechanic</th>
                <th className="px-5 py-3">Specialization</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Experience</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Certification</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredMechanics.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-xs text-[#5B6478]">
                    <Wrench size={24} strokeWidth={1.5} className="mx-auto text-[#5B6478] mb-2 opacity-60" />
                    <p className="font-semibold text-[#DCE1EB]">No mechanics found</p>
                    <p className="mt-0.5 text-[#5B6478]">Try adjusting your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredMechanics.map((mechanic) => {
                  const profile = mechanic.mechanic_profile;
                  const status = getCertificationStatus(mechanic);
                  const rating = Number(mechanic.received_reviews_avg_rating || 0);
                  const reviewCount = mechanic.received_reviews_count || 0;

                  return (
                    <tr
                      key={mechanic.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="px-5 py-3.5 font-medium text-[#E7ECF5]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] font-mono text-xs text-[#37D6C4]">
                            <Wrench size={14} />
                          </div>
                          <div className="min-w-0">
                            <span className="truncate block">{mechanic.name}</span>
                            <div className="flex items-center gap-1 font-mono text-xs text-[#8993A8] mt-0.5">
                              <Mail size={11} className="shrink-0 text-[#5B6478]" />
                              <span className="truncate">{mechanic.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-5 py-3.5 text-xs text-[#8993A8]">
                        {profile?.specialization || "—"}
                      </td>

                      {/* City */}
                      <td className="px-5 py-3.5 text-xs text-[#8993A8]">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} strokeWidth={1.75} className="text-[#5B6478] shrink-0" />
                          <span className="truncate">{profile?.city || "—"}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-5 py-3.5 font-mono text-xs text-[#8993A8]">
                        {profile?.experience_years ?? 0} yrs
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Star size={13} className="fill-[#F4A94A] text-[#F4A94A] shrink-0" />
                          <span className="font-mono text-xs font-semibold text-[#E7ECF5]">
                            {rating.toFixed(1)}
                          </span>
                          <span className="font-mono text-[10px] text-[#5B6478]">({reviewCount})</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedMechanic(mechanic)}
                            className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-[#C7CEDB] transition hover:bg-white/[0.06] hover:text-white"
                          >
                            <Eye size={12} strokeWidth={1.75} />
                            <span>View</span>
                          </button>

                          {status !== "certified" && (
                            <button
                              type="button"
                              onClick={() => handleCertify(mechanic)}
                              disabled={processingId === mechanic.id}
                              className="inline-flex items-center gap-1 rounded-md border border-[#37D6C4]/30 bg-[#37D6C4]/10 px-2.5 py-1 text-xs font-medium text-[#37D6C4] transition hover:bg-[#37D6C4]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingId === mechanic.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={12} strokeWidth={1.75} />
                              )}
                              <span>Certify</span>
                            </button>
                          )}

                          {status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => handleReject(mechanic)}
                              disabled={processingId === mechanic.id}
                              className="inline-flex items-center gap-1 rounded-md border border-[#F2637A]/30 bg-[#F2637A]/10 px-2.5 py-1 text-xs font-medium text-[#F2637A] transition hover:bg-[#F2637A]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={12} strokeWidth={1.75} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedMechanic && (
        <MechanicDetailsModal
          mechanic={selectedMechanic}
          onClose={() => setSelectedMechanic(null)}
        />
      )}
    </div>
  );
}

function MechanicDetailsModal({ mechanic, onClose }) {
  const profile = mechanic.mechanic_profile;
  const rating = Number(mechanic.received_reviews_avg_rating || 0);
  const reviewCount = mechanic.received_reviews_count || 0;
  const status = profile?.certification_status || "pending";
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const StatusIcon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-white/[0.08] bg-[#10151F] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#37D6C4]">Mechanic Profile</p>
            <h2 className="text-base font-semibold text-white tracking-tight mt-0.5">{mechanic.name}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#5B6478] transition-colors hover:bg-white/[0.06] hover:text-[#E7ECF5]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 p-5 text-xs">
          {/* Grid Info */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <InfoItem icon={Mail} label="Email Address" value={mechanic.email} />
            <InfoItem icon={MapPin} label="City / Location" value={profile?.city} />
            <InfoItem icon={Wrench} label="Specialization" value={profile?.specialization} />
            <InfoItem
              icon={Award}
              label="Experience"
              value={profile?.experience_years != null ? `${profile.experience_years} Years` : null}
            />
            <InfoItem
              icon={FileText}
              label="Certification No."
              value={profile?.certification_number}
            />
            <InfoItem
              icon={Star}
              label="Rating & Feedback"
              value={`${rating.toFixed(1)} / 5.0 (${reviewCount} Reviews)`}
            />
          </div>

          {/* Status Box */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">
              Certification Status
            </p>

            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
                <StatusIcon size={14} strokeWidth={1.75} />
                {status === "pending" ? "Pending Review" : style.label}
              </span>
            </div>
          </div>

          {/* Phone */}
          {profile?.phone && (
            <InfoItem icon={Phone} label="Contact Phone" value={profile.phone} />
          )}

          {/* Bio */}
          {profile?.bio && (
            <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B6478]">Biography</p>
              <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-[#8993A8]">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Document Upload Indicator */}
          {profile?.certification_document && (
            <div className="rounded-xl border border-[#37D6C4]/20 bg-[#37D6C4]/10 p-3.5">
              <div className="flex items-start sm:items-center gap-3">
                <Award size={16} strokeWidth={1.75} className="text-[#37D6C4] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="font-semibold text-[#E7ECF5]">Certification Document Attached</p>
                  <p className="mt-0.5 text-[11px] text-[#8993A8]">
                    Verification file submitted by the mechanic for evaluation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/[0.06] bg-white/[0.01] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#E7ECF5] transition-colors hover:bg-white/[0.1]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0B0F18] p-3.5">
      <div className="flex items-center gap-1.5 text-[#5B6478]">
        <Icon size={13} strokeWidth={1.75} className="shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1 font-medium text-[#E7ECF5] truncate">{value || "—"}</p>
    </div>
  );
}