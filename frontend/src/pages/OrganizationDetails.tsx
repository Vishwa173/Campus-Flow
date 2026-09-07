import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyOrganizations, getOrganizationEvents } from "../api";
import {
    canManageEvents,
    canManageMembers,
    canManageOrganization,
    type OrganizationRole,
} from "../auth/permissions";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

type Event = {
    id: number;
    organizationId: number;
    categoryId: number;
    title: string;
    description: string | null;
    venue: string;
    startTime: string;
    endTime: string;
    capacity: number;
    status: EventStatus;
    bannerUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

function OrganizationDetails() {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState<OrganizationRole | null>(null);

    useEffect(() => {
        async function loadOrganizationData() {
            if (!organizationId) return;

            try {
                setLoading(true);
                setError("");

                const [eventsData, organizationsData] = await Promise.all([
                    getOrganizationEvents(Number(organizationId)),
                    getMyOrganizations(),
                ]);

                setEvents(eventsData);

                const organization = organizationsData.find(
                    (org: {
                        id: number;
                        role: OrganizationRole;
                    }) => org.id === Number(organizationId)
                );

                if (organization) {
                    setRole(organization.role);
                }
            } catch {
                setError("Failed to load organization data.");
            } finally {
                setLoading(false);
            }
        }

        loadOrganizationData();
    }, [organizationId]);

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTime(date: string) {
        return new Date(date).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function getStatusStyle(status: EventStatus) {
        switch (status) {
            case "PUBLISHED":
                return "bg-emerald-50 text-emerald-700";

            case "DRAFT":
                return "bg-amber-50 text-amber-700";

            case "CANCELLED":
                return "bg-red-50 text-red-700";

            case "COMPLETED":
                return "bg-zinc-100 text-zinc-600";
        }
    }

    const canManageEvent = role ? canManageEvents(role) : false;
    const canManageMember = role ? canManageMembers(role) : false;
    const canManageOrg = role ? canManageOrganization(role) : false;

    return (
        <main className="min-h-screen bg-[#f7f7f8]">
            {/* Header */}
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                            <svg
                                className="h-4 w-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="17"
                                    rx="2"
                                />
                                <path d="M8 2v4M16 2v4M3 9h18" />
                            </svg>
                        </div>

                        <span className="font-semibold tracking-tight text-zinc-900">
                            CampusFlow
                        </span>
                    </div>

                    <button
                        onClick={() => navigate("/organizations")}
                        className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                    >
                        ← Organizations
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-6xl px-6 py-10">
                {/* Organization heading */}
                <section className="mb-10">
                    <p className="text-sm font-medium text-indigo-600">
                        Organization
                    </p>

                    <div className="mt-2 flex items-start justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                                Organization #{organizationId}
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                                Manage events, members, and organization
                                activity from this workspace.
                            </p>

                            {role && (
                                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Role: {role.replace("_", " ")}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Workspace sections */}
                <section className="grid gap-4 md:grid-cols-3">
                    {/* Events */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.025)]">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <svg
                                className="h-5 w-5 text-indigo-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="17"
                                    rx="2"
                                />
                                <path d="M8 2v4M16 2v4M3 9h18" />
                            </svg>
                        </div>

                        <h2 className="font-semibold text-zinc-900">
                            Events
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-zinc-500">
                            Create and manage events for this organization.
                        </p>

                        <button
                            className="mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            onClick={() =>
                                document
                                    .getElementById("events-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            Manage events →
                        </button>
                    </div>

                    {/* Members */}
                    {canManageMember && (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.025)]">
                            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                                <svg
                                    className="h-5 w-5 text-violet-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>

                            <h2 className="font-semibold text-zinc-900">
                                Members
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-zinc-500">
                                Manage organization members and their roles.
                            </p>

                            <button
                                className="mt-5 text-sm font-medium text-violet-600 hover:text-violet-700"
                                onClick={() =>
                                    console.log(
                                        "Manage members for organization",
                                        organizationId
                                    )
                                }
                            >
                                Manage members →
                            </button>
                        </div>
                    )}

                    {/* Settings */}
                    {canManageOrg && (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.025)]">
                            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                                <svg
                                    className="h-5 w-5 text-zinc-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 17a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 12a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.73 7.2V7h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 12a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
                                </svg>
                            </div>

                            <h2 className="font-semibold text-zinc-900">
                                Settings
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-zinc-500">
                                Configure organization details and preferences.
                            </p>

                            <button
                                className="mt-5 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                                onClick={() =>
                                    console.log(
                                        "Organization settings",
                                        organizationId
                                    )
                                }
                            >
                                Organization settings →
                            </button>
                        </div>
                    )}
                </section>

                {/* Events */}
                <section
                    id="events-section"
                    className="mt-8"
                >
                    {loading ? (
                        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
                            <p className="text-sm text-zinc-500">
                                Loading events...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                                <svg
                                    className="h-5 w-5 text-indigo-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="17"
                                        rx="2"
                                    />
                                    <path d="M8 2v4M16 2v4M3 9h18" />
                                </svg>
                            </div>

                            <h2 className="mt-5 text-base font-semibold text-zinc-900">
                                No events yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                                Events created for this organization will
                                appear here.
                            </p>

                            {canManageEvent && (
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/organizations/${organizationId}/events/create`
                                        )
                                    }
                                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
                                >
                                    Create event
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-900">
                                        Events
                                    </h2>

                                    <p className="mt-1 text-sm text-zinc-500">
                                        {events.length}{" "}
                                        {events.length === 1
                                            ? "event"
                                            : "events"}{" "}
                                        in this organization
                                    </p>
                                </div>

                                {canManageEvent && (
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/organizations/${organizationId}/events/create`
                                            )
                                        }
                                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                    >
                                        + Create event
                                    </button>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() =>
                                            navigate(
                                                `/organizations/${organizationId}/events/${event.id}`
                                            )
                                        }
                                        className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition hover:border-zinc-300 hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-zinc-900">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {event.venue}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                                    event.status
                                                )}`}
                                            >
                                                {event.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-zinc-600">
                                            <p>
                                                📅{" "}
                                                {formatDate(event.startTime)}
                                            </p>

                                            <p>
                                                🕐{" "}
                                                {formatTime(event.startTime)}{" "}
                                                –{" "}
                                                {formatTime(event.endTime)}
                                            </p>

                                            <p>
                                                👥 Capacity: {event.capacity}
                                            </p>
                                        </div>

                                        {event.description && (
                                            <p className="mt-4 line-clamp-2 text-sm leading-5 text-zinc-500">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </main>
    );
}

export default OrganizationDetails;