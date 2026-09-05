function Login() {
    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <main className="min-h-screen bg-[#f7f7f8]">
            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-10 flex justify-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
                                <svg
                                    className="h-5 w-5 text-white"
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

                            <span className="text-xl font-semibold tracking-tight text-zinc-900">
                                CampusFlow
                            </span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-10">

                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                                Welcome back
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Sign in to discover and manage campus events.
                            </p>
                        </div>

                        {/* Google Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99]"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M21.35 12.27c0-.78-.07-1.53-.22-2.27H12v4.3h5.25a4.5 4.5 0 0 1-1.95 2.96v2.47h3.16c1.85-1.7 2.89-4.2 2.89-7.46Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 21.75c2.65 0 4.88-.88 6.5-2.39l-3.16-2.47c-.88.59-2 .94-3.34.94-2.57 0-4.75-1.74-5.53-4.08H3.2v2.55A9.82 9.82 0 0 0 12 21.75Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M6.47 13.75A5.9 5.9 0 0 1 6.16 12c0-.61.11-1.2.31-1.75V7.7H3.2A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.3l3.17-2.55Z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 6.17c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.88 3.22 14.65 2.25 12 2.25a9.82 9.82 0 0 0-8.8 5.45l3.27 2.55C7.25 7.91 9.43 6.17 12 6.17Z"
                                />
                            </svg>

                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-zinc-200" />

                            <span className="text-xs text-zinc-400">
                                Secure authentication
                            </span>

                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        {/* Security message */}
                        <div className="flex gap-3 rounded-xl bg-zinc-50 p-4">
                            <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>

                            <p className="text-xs leading-5 text-zinc-500">
                                Your account is securely authenticated through
                                Google. CampusFlow never stores your Google
                                password.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-zinc-400">
                        CampusFlow · Campus events, simplified.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Login;