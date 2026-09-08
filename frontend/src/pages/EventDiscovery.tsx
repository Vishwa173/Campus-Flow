import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchEvents } from "../api";

type Event = {
    id: number;
    organizationId: number;
    categoryId: number;
    categoryName: string;
    title: string;
    description: string;
    venue: string;
    startTime: string;
    endTime: string;
    capacity: number;
    status: string;
    bannerUrl?: string;
};

export default function EventDiscovery() {

    const navigate = useNavigate();

    const searchContainerRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    /*
     * Autocomplete
     *
     * Wait 300ms after the user stops typing
     * before sending the search request.
     */
    useEffect(() => {

        if (!query.trim()) {
            return;
        }

        const timer = setTimeout(async () => {

            try {
                setLoading(true);
                setError("");

                const results = await searchEvents(
                    query,
                    categoryId ? Number(categoryId) : undefined
                );

                setEvents(results);
                setShowSuggestions(true);

            } catch {
                setError("Failed to search events");
                setEvents([]);

            } finally {
                setLoading(false);
            }

        }, 300);

        return () => clearTimeout(timer);

    }, [query, categoryId]);

    /*
     * Close autocomplete when clicking outside
     * the search container.
     */
    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {

            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    /*
     * Handle typing in the search box.
     */
    function handleQueryChange(value: string) {

        setQuery(value);

        if (!value.trim()) {
            setEvents([]);
            setShowSuggestions(false);
            setError("");
        }
    }

    /*
     * Manual search
     */
    async function handleSearch() {

        if (!query.trim()) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const results = await searchEvents(
                query,
                categoryId ? Number(categoryId) : undefined
            );

            setEvents(results);
            setShowSuggestions(false);

        } catch {
            setError("Failed to search events");

        } finally {
            setLoading(false);
        }
    }

    /*
     * Open event details
     */
    function openEvent(event: Event) {

        setShowSuggestions(false);

        navigate(
            `/organizations/${event.organizationId}/events/${event.id}`
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Discover Events
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Find events happening across CampusFlow.
                    </p>

                </div>

                {/* Search + Filters */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row">

                        {/* Search input + suggestions */}
                        <div
                            ref={searchContainerRef}
                            className="relative flex-1"
                        >

                            <input
                                type="text"
                                placeholder="Search events..."
                                value={query}
                                onChange={(e) =>
                                    handleQueryChange(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                onFocus={() => {
                                    if (events.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            />

                            {/* Autocomplete suggestions */}
                            {showSuggestions && events.length > 0 && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">

                                    {events.slice(0, 5).map((event) => (

                                        <div
                                            key={event.id}
                                            onClick={() => openEvent(event)}
                                            className="cursor-pointer border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                        >

                                            <div className="flex items-center justify-between">

                                                <h3 className="font-medium text-gray-900">
                                                    {event.title}
                                                </h3>

                                                <span className="ml-3 text-xs text-gray-500">
                                                    {event.categoryName}
                                                </span>

                                            </div>

                                            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                                                {event.venue}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {new Date(
                                                    event.startTime
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    ))}

                                </div>
                            )}

                        </div>

                        {/* Category */}
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="">
                                All Categories
                            </option>

                            <option value="1">
                                Technology
                            </option>

                            <option value="2">
                                Cultural
                            </option>

                            <option value="3">
                                Sports
                            </option>

                            <option value="4">
                                Academic
                            </option>

                            <option value="5">
                                Other
                            </option>
                        </select>

                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {/* Results */}
                {!loading &&
                    events.length === 0 &&
                    !error &&
                    query.trim() && (
                        <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                            <h2 className="text-xl font-semibold text-gray-800">
                                No events found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Try a different search or filter.
                            </p>

                        </div>
                    )}

                {/* Event Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {events.map((event) => (

                        <div
                            key={event.id}
                            onClick={() => openEvent(event)}
                            className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            {/* Banner */}
                            {event.bannerUrl ? (
                                <img
                                    src={event.bannerUrl}
                                    alt={event.title}
                                    className="h-48 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-48 items-center justify-center bg-gray-200 text-gray-500">
                                    No image
                                </div>
                            )}

                            <div className="p-5">

                                <div className="mb-2 flex items-center justify-between">

                                    {/* Category */}
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                        {event.categoryName}
                                    </span>

                                    {/* Status */}
                                    <span className="text-xs text-gray-500">
                                        {event.status}
                                    </span>

                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {event.title}
                                </h2>

                                {/* Description */}
                                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                    {event.description}
                                </p>

                                {/* Event information */}
                                <div className="mt-4 space-y-2 text-sm text-gray-600">

                                    <p>
                                        📍 {event.venue}
                                    </p>

                                    <p>
                                        📅{" "}
                                        {new Date(
                                            event.startTime
                                        ).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}