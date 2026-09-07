import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent } from "../api";

function CreateEvent() {
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: "",
        venue: "",
        startTime: "",
        endTime: "",
        capacity: "",
        categoryId: "",
        bannerUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        if (!organizationId) return;

        setLoading(true);
        setError("");

        try {
            await createEvent(Number(organizationId), {
                title: form.title,
                description: form.description || undefined,
                venue: form.venue,
                startTime: form.startTime,
                endTime: form.endTime,
                capacity: Number(form.capacity),
                categoryId: Number(form.categoryId),
                bannerUrl: form.bannerUrl || undefined,
            });

            navigate(`/organizations/${organizationId}`);
        } catch {
            setError("Failed to create event. Please check your details.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f8]">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
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
                        onClick={() =>
                            navigate(`/organizations/${organizationId}`)
                        }
                        className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                    >
                        ← Back to organization
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm font-medium text-indigo-600">
                        New event
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                        Create an event
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Add the details for your event. It will be saved as a
                        draft until you publish it.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.025)] md:p-8"
                >
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-900">
                                Event title
                            </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                placeholder="e.g. AI & Machine Learning Workshop"
                                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-900">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={5000}
                                rows={5}
                                placeholder="Tell people what this event is about..."
                                className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Venue + Capacity */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-900">
                                    Venue
                                </label>

                                <input
                                    name="venue"
                                    value={form.venue}
                                    onChange={handleChange}
                                    required
                                    maxLength={255}
                                    placeholder="e.g. Main Auditorium"
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-900">
                                    Capacity
                                </label>

                                <input
                                    name="capacity"
                                    type="number"
                                    min="1"
                                    value={form.capacity}
                                    onChange={handleChange}
                                    required
                                    placeholder="100"
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Date / Time */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-900">
                                    Start date & time
                                </label>

                                <input
                                    name="startTime"
                                    type="datetime-local"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-900">
                                    End date & time
                                </label>

                                <input
                                    name="endTime"
                                    type="datetime-local"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-900">
                                Category
                            </label>

                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Select a category</option>
                                <option value="1">Technology</option>
                                <option value="2">Cultural</option>
                                <option value="3">Sports</option>
                                <option value="4">Academic</option>
                                <option value="5">Other</option>
                            </select>
                        </div>

                        {/* Banner */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-900">
                                Banner URL{" "}
                                <span className="font-normal text-zinc-400">
                                    (optional)
                                </span>
                            </label>

                            <input
                                name="bannerUrl"
                                type="url"
                                value={form.bannerUrl}
                                onChange={handleChange}
                                maxLength={500}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/organizations/${organizationId}`
                                    )
                                }
                                className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create event"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default CreateEvent;