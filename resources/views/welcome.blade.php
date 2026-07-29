<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Inventory Management System — track stock, products, and warehouse operations in one place.">

        <title>Inventory Management System</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

        @vite(['resources/css/app.css'])
    </head>
    <body class="min-h-screen bg-slate-200/70 text-slate-900 antialiased">
        <div class="relative flex min-h-screen flex-col overflow-hidden">
            {{-- Soft layered background for depth without cards --}}
            <div
                class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_#e2e8f0_0%,_#f8fafc_42%,_#e2e8f0_100%)]"
                aria-hidden="true"
            ></div>
            <div
                class="pointer-events-none absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-slate-300/35 blur-3xl"
                aria-hidden="true"
            ></div>
            <div
                class="pointer-events-none absolute -right-16 bottom-10 h-[22rem] w-[22rem] rounded-full bg-white/70 blur-3xl"
                aria-hidden="true"
            ></div>

            <header class="relative z-10 border-b border-slate-300/80 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
                <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
                    <div class="flex items-center gap-3">
                        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                                <path d="M12 22V12" />
                                <polyline points="3.29 7 12 12 20.71 7" />
                                <path d="m7.5 4.27 9 5.15" />
                            </svg>
                        </span>
                        <span class="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                            Inventory Management System
                        </span>
                    </div>

                    <a
                        href="{{ route('login') }}"
                        class="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
                    >
                        Sign in
                    </a>
                </div>
            </header>

            <main class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-12 sm:px-8 lg:py-20">
                {{-- Soft spotlight behind the hero text --}}
                <div
                    class="pointer-events-none absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/50 blur-3xl sm:h-96 sm:w-96"
                    aria-hidden="true"
                ></div>

                <section class="relative max-w-2xl border-l-2 border-slate-900/80 pl-6 sm:pl-8">
                    <p class="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                        Stock control · Products · Operations
                    </p>

                    <h1 class="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                        Inventory Management System
                    </h1>

                    <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                        Manage your inventory efficiently and securely. Track products, monitor stock levels, and keep warehouse operations organized from one place.
                    </p>

                    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a
                            href="{{ route('login') }}"
                            class="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                        >
                            Get started
                        </a>
                        <a
                            href="{{ route('login') }}"
                            class="inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                        >
                            Sign in to your account
                            <span class="ml-1" aria-hidden="true">→</span>
                        </a>
                    </div>
                </section>
            </main>

            <footer class="relative z-10 border-t border-slate-300/80 bg-white/90 backdrop-blur-md">
                <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 text-sm text-slate-500 sm:px-8">
                    <span>&copy; {{ date('Y') }} Inventory Management System</span>
                    <span class="hidden text-slate-400 sm:inline">Secure inventory control for your business</span>
                </div>
            </footer>
        </div>
    </body>
</html>
