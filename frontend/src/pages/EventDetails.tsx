import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    getEvent,
    getMyOrganizations,
    publishEvent,
} from "../api";

import {
    canManageEvents,
    type OrganizationRole,
} from "../auth/permissions";

type EventStatus =
    | "DRAFT"
    | "PUBLISHED"
    | "CANCELLED"
    | "COMPLETED";

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

function EventDetails() {
    const { organizationId, eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);
    const [role, setRole] = useState<OrganizationRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEvent() {
            try {
                if (!organizationId || !eventId) {
                    throw new Error("Invalid event");
                }

                const [eventData, organizations] = await Promise.all([
                    getEvent(
                        Number(organizationId),
                        Number(eventId)
                    ),
                    getMyOrganizations(),
                ]);

                setEvent(eventData);

                const organization = organizations.find(
                    (org: {
                        id: number;
                        role: OrganizationRole;
                    }) => org.id === Number(organizationId)
                );

                if (organization) {
                    setRole(organization.role);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load event"
                );
            } finally {
                setLoading(false);
            }
        }

        loadEvent();
    }, [organizationId, eventId]);

    async function handlePublish() {
        if (!organizationId || !eventId || !event) {
            return;
        }

        setPublishing(true);
        setError("");

        try {
            const updatedEvent = await publishEvent(
                Number(organizationId),
                Number(eventId)
            );

            setEvent(updatedEvent);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to publish event"
            );
        } finally {
            setPublishing(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-500">Loading event...</p>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-zinc-900">
                        Event not found
                    </h1>

                    <p className="mt-2 text-zinc-500">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/organizations/${organizationId}`
                            )
                        }
                        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Back to organization
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const canManageEvent = role
        ? canManageEvents(role)
        : false;

    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    const formattedStart = startDate.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const formattedEnd = endDate.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const statusStyles = {
        DRAFT: "bg-zinc-100 text-zinc-700",
        PUBLISHED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
        COMPLETED: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="min-h-screen bg-[#f7f7f8] px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <button
                    onClick={() =>
                        navigate(
                            `/organizations/${organizationId}`
                        )
                    }
                    className="mb-6 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                    ← Back to organization
                </button>

                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    {event.bannerUrl && (
                        <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="h-64 w-full object-cover"
                        />
                    )}

                    <div className="p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-zinc-900">
                                        {event.title}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[event.status]}`}
                                    >
                                        {event.status}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-zinc-500">
                                    Event #{event.id}
                                </p>
                            </div>

                            {canManageEvent && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/organizations/${organizationId}/events/${event.id}/edit`
                                            )
                                        }
                                        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                    >
                                        Edit
                                    </button>

                                    {event.status === "DRAFT" && (
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishing}
                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {publishing
                                                ? "Publishing..."
                                                : "Publish"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-zinc-50 p-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                    When
                                </p>

                                <p className="mt-2 text-sm font-semibold text-zinc-900">
                                    {formattedStart}
                                </p>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Until {formattedEnd}
                                </p>
                            </div>

                            <div className="rounded-xl bg-zinc-50 p-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                    Venue
                                </p>

                                <p className="mt-2 text-sm font-semibold text-zinc-900">
                                    {event.venue}
                                </p>
                            </div>

                            <div className="rounded-xl bg-zinc-50 p-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                    Capacity
                                </p>

                                <p className="mt-2 text-sm font-semibold text-zinc-900">
                                    {event.capacity} people
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-zinc-200 pt-8">
                            <h2 className="text-lg font-semibold text-zinc-900">
                                About this event
                            </h2>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                                {event.description ||
                                    "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;