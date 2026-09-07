import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization, getMyOrganizations } from "../api";

type Organization = {
    id: number;
    name: string;
    description: string | null;
    logoUrl: string | null;
    role:
        | "MEMBER"
        | "CHECKIN_STAFF"
        | "EVENT_MANAGER"
        | "ORGANIZATION_ADMIN";
};

function Organizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getMyOrganizations();
                setOrganizations(data);
            } catch {
                setError("Failed to load organizations.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        try {
            setCreating(true);
            setError("");

            const organization = await createOrganization({
                name: name.trim(),
                description: description.trim() || undefined,
            });

            setOrganizations((current) => [
                ...current,
                {
                    ...organization,
                    role: "ORGANIZATION_ADMIN",
                },
            ]);

            setName("");
            setDescription("");
            setShowCreate(false);
        } catch {
            setError("Failed to create organization.");
        } finally {
            setCreating(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f8] px-6 py-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Workspace
                        </p>

                        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
                            Organizations
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Manage the organizations you belong to.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        + Create organization
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
                        Loading organizations...
                    </div>
                ) : organizations.length === 0 ? (
                    /* Empty state */
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            +
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-zinc-900">
                            No organizations yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                            Create an organization to start managing events
                            and members.
                        </p>

                        <button
                            onClick={() => setShowCreate(true)}
                            className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Create organization
                        </button>
                    </div>
                ) : (
                    /* Organization list */
                    <div className="grid gap-4 md:grid-cols-2">
                        {organizations.map((organization) => (
                            <div
                                key={organization.id}
                                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-semibold text-indigo-600">
                                            {organization.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-zinc-900">
                                                {organization.name}
                                            </h2>

                                            <p className="mt-1 text-xs text-zinc-400">
                                                Organization #{organization.id}
                                            </p>
                                        </div>
                                    </div>

                                    <RoleBadge role={organization.role} />
                                </div>

                                {organization.description && (
                                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-zinc-500">
                                        {organization.description}
                                    </p>
                                )}

                                <div className="mt-6 border-t border-zinc-100 pt-4">
                                    <button
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                        onClick={() => navigate(`/organizations/${organization.id}`)}
                                    >
                                        Open organization →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create organization modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Create organization
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Set up a new organization for your events.
                            </p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Organization name
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Campus Developers Club"
                                    maxLength={150}
                                    required
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="What is this organization about?"
                                    maxLength={5000}
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create organization"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

function RoleBadge({
    role,
}: {
    role: Organization["role"];
}) {
    const labels = {
        MEMBER: "Member",
        CHECKIN_STAFF: "Check-in Staff",
        EVENT_MANAGER: "Event Manager",
        ORGANIZATION_ADMIN: "Admin",
    };

    return (
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {labels[role]}
        </span>
    );
}

export default Organizations;