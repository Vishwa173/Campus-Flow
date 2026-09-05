import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./auth";

function AuthCallback() {
    const navigate = useNavigate();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) {
            return;
        }

        handled.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        setToken(token);

        navigate("/dashboard", { replace: true });
    }, [navigate]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-6">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
                    <svg
                        className="h-6 w-6 animate-pulse text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 3v18M3 12h18" />
                    </svg>
                </div>

                <h1 className="text-lg font-semibold text-zinc-900">
                    Signing you in
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Just a moment while we set things up.
                </p>
            </div>
        </main>
    );
}

export default AuthCallback;