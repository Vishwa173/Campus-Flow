import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../auth/auth";
import { getCurrentUser } from "../api";

type User = {
    id: number;
    name: string;
    email: string;
    profilePicture: string | null;
};

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getCurrentUser()
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                removeToken();
                navigate("/login", { replace: true });
            });
    }, [navigate]);

    const handleLogout = () => {
        removeToken();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#f7f7f8]">

            {/* Navbar */}
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    {/* Brand */}
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

                    {/* Right side */}
                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium text-zinc-800">
                                {user?.name ?? "Loading..."}
                            </p>

                            <p className="text-xs text-zinc-400">
                                {user?.email ?? ""}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-100">
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-semibold text-indigo-700">
                                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Welcome */}
                <div className="mb-10">
                    <p className="mb-2 text-sm font-medium text-indigo-600">
                        Dashboard
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                        Welcome, {user?.name?.split(" ")[0] ?? "there"}.
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                        Discover events, keep track of your registrations,
                        and stay connected with your campus community.
                    </p>
                </div>

                {/* Quick actions */}
                <section className="mb-10 grid gap-4 md:grid-cols-3">

                    {/* Discover */}
                    <button className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <svg
                                className="h-5 w-5 text-indigo-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-4-4" />
                            </svg>
                        </div>

                        <h2 className="font-semibold text-zinc-900">
                            Discover events
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-zinc-500">
                            Find events happening around your campus.
                        </p>

                        <span className="mt-5 inline-block text-sm font-medium text-indigo-600 transition group-hover:translate-x-1">
                            Explore →
                        </span>
                    </button>

                    {/* Registrations */}
                    <button className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <svg
                                className="h-5 w-5 text-emerald-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M5 12.5 9 16l10-10" />
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="3"
                                />
                            </svg>
                        </div>

                        <h2 className="font-semibold text-zinc-900">
                            My registrations
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-zinc-500">
                            View the events you've registered for.
                        </p>

                        <span className="mt-5 inline-block text-sm font-medium text-emerald-600 transition group-hover:translate-x-1">
                            View registrations →
                        </span>
                    </button>

                    {/* Organizations */}
                    <button
                        onClick={() => navigate("/organizations")}
                        className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                    >
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                            <svg
                                className="h-5 w-5 text-violet-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M3 21h18" />
                                <path d="M5 21V7l7-4 7 4v14" />
                                <path d="M9 21v-4h6v4" />
                            </svg>
                        </div>

                        <h2 className="font-semibold text-zinc-900">
                            Organizations
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-zinc-500">
                            Manage your campus organizations and events.
                        </p>

                        <span className="mt-5 inline-block text-sm font-medium text-violet-600 transition group-hover:translate-x-1">
                            Manage →
                        </span>
                    </button>

                </section>

                {/* Empty state */}
                <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                        <svg
                            className="h-5 w-5 text-zinc-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M8 2v4M16 2v4M3 10h18" />
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="17"
                                rx="2"
                            />
                        </svg>
                    </div>

                    <h2 className="mt-5 text-base font-semibold text-zinc-900">
                        Your upcoming events
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        You haven't registered for any events yet. Explore
                        what's happening around campus and find something
                        interesting.
                    </p>

                    <button className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]">
                        Browse events
                    </button>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;