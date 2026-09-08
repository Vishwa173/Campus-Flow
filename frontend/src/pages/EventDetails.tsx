import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    getEvent,
    getMyOrganizations,
    publishEvent,
    checkRegistration,
    registerForEvent,
    cancelRegistration,
    getRegistrationCount,
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

    const [isRegistered, setIsRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [registrationError, setRegistrationError] = useState("");

    const [registrationCount, setRegistrationCount] = useState(0);

    useEffect(() => {
        async function loadEvent() {
            try {
                if (!organizationId || !eventId) {
                    throw new Error("Invalid event");
                }

                const [
                    eventData,
                    organizations,
                    registered,
                    count,
                ] = await Promise.all([
                    getEvent(
                        Number(organizationId),
                        Number(eventId)
                    ),
                    getMyOrganizations(),
                    checkRegistration(Number(eventId)),
                    getRegistrationCount(Number(eventId)),
                ]);

                setEvent(eventData);
                setIsRegistered(registered);
                setRegistrationCount(count);

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

    async function handleRegister() {
        if (!eventId) {
            return;
        }

        setRegistering(true);
        setRegistrationError("");

        try {
            await registerForEvent(Number(eventId));

            setIsRegistered(true);
            setRegistrationCount((count) => count + 1);
        } catch (err) {
            setRegistrationError(
                err instanceof Error
                    ? err.message
                    : "Failed to register for event"
            );
        } finally {
            setRegistering(false);
        }
    }

    async function handleCancelRegistration() {
        if (!eventId) {
            return;
        }

        setRegistering(true);
        setRegistrationError("");

        try {
            await cancelRegistration(Number(eventId));

            setIsRegistered(false);
            setRegistrationCount((count) => Math.max(0, count - 1));
        } catch (err) {
            setRegistrationError(
                err instanceof Error
                    ? err.message
                    : "Failed to cancel registration"
            );
        } finally {
            setRegistering(false);
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

    const remainingSpots = Math.max(
        event.capacity - registrationCount,
        0
    );

    const isFull = registrationCount >= event.capacity;

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
                                    {registrationCount} /{" "}
                                    {event.capacity} registered
                                </p>

                                <p className="mt-1 text-sm text-zinc-500">
                                    {isFull
                                        ? "Event is full"
                                        : `${remainingSpots} spots remaining`}
                                </p>
                            </div>
                        </div>

                        {event.status === "PUBLISHED" && (
                            <div className="mt-8 border-t border-zinc-200 pt-8">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-900">
                                            Registration
                                        </h2>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            {isRegistered
                                                ? "You are registered for this event."
                                                : isFull
                                                ? "This event is currently full."
                                                : "Reserve your spot for this event."}
                                        </p>
                                    </div>

                                    {isRegistered ? (
                                        <button
                                            onClick={
                                                handleCancelRegistration
                                            }
                                            disabled={registering}
                                            className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {registering
                                                ? "Cancelling..."
                                                : "Cancel registration"}
                                        </button>
                                    ) : isFull ? (
                                        <button
                                            disabled
                                            className="rounded-lg bg-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600"
                                        >
                                            Event full
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            disabled={registering}
                                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {registering
                                                ? "Registering..."
                                                : "Register for event"}
                                        </button>
                                    )}
                                </div>

                                {registrationError && (
                                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {registrationError}
                                    </div>
                                )}
                            </div>
                        )}

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