module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/inventory/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript) <locals>");
;
;
async function POST(req) {
    try {
        // Prefer explicit server config. Fall back to NEXT_PUBLIC_SUPABASE_URL default if present.
        const supabaseUrl = ("TURBOPACK compile-time value", "https://xpybqjfofdmkeiijvwnx.supabase.co") || process.env.SUPABASE_URL || "https://xpybqjfofdmkeiijvwnx.supabase.co";
        // Expect the client to forward the user's access token in Authorization header
        // For dev/testing, allow requests without a token; in production require it
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        console.log("[v0] API route received auth header:", authHeader ? "yes" : "no");
        console.log("[v0] Extracted token:", token ? "yes" : "no");
        const isProduction = ("TURBOPACK compile-time value", "development") === "production";
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const body = await req.json();
        // Service role must be provided in production. Allow a DEV-only fallback to anon key.
        // WARNING: This is insecure and only intended to unblock local development/testing.
        let serverKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;
        if (!serverKey) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            else {
                serverKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWJxamZvZmRta2VpaWp2d254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDEyODAsImV4cCI6MjA4MDA3NzI4MH0.Dww9fKSwqzINDt18uhgcQJbeq4rnH3AEedEiteHZ-FQ");
                console.warn("[v0] SUPABASE_SERVICE_ROLE not set — falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for local development (insecure).");
            }
        }
        if (!serverKey) {
            const hint = "Set SUPABASE_SERVICE_ROLE env var (use your Supabase project's service_role key).\nIn PowerShell: $env:SUPABASE_SERVICE_ROLE='your-key'";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Missing SUPABASE_SERVICE_ROLE. ${hint}`
            }, {
                status: 500
            });
        }
        // Only set Authorization header if we have a token
        const clientConfig = {};
        if (token) {
            clientConfig.global = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
        }
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serverKey, clientConfig);
        // Verify token and fetch the user (if token is present)
        let userId = null;
        if (token) {
            const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
            if (userErr || !userRes?.user) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid or expired token"
                }, {
                    status: 401
                });
            }
            userId = userRes.user.id;
        } else {
            // DEV: allow token-less requests; just proceed without user verification
            console.warn("[v0] No token provided; skipping user verification (dev mode)");
        }
        // Check staff table if we have a user ID (optional in dev)
        if (userId) {
            const { data: staffRow, error: staffErr } = await supabase.from("staff").select("id, role, user_id").eq("user_id", userId).limit(1).maybeSingle();
            if (staffErr) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: staffErr.message || String(staffErr)
                }, {
                    status: 500
                });
            }
            if (!staffRow || staffRow.role && staffRow.role !== "hr" && staffRow.role !== "staff") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Forbidden: not a staff member"
                }, {
                    status: 403
                });
            }
        } else {
            console.warn("[v0] No user ID; skipping staff verification (dev mode)");
        }
        // simple snake_case conversion for known fields
        const payload = {};
        Object.entries(body || {}).forEach(([k, v])=>{
            const snake = k.replace(/[A-Z]/g, (m)=>`_${m.toLowerCase()}`);
            payload[snake] = v;
        });
        // Ensure required defaults
        if (typeof payload.quantity === "undefined") payload.quantity = 0;
        if (typeof payload.min_quantity === "undefined") payload.min_quantity = 0;
        if (!payload.status) payload.status = "ok";
        const { data, error } = await supabase.from("inventory").insert([
            payload
        ]).select().single();
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message || String(error)
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: msg
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ab4fb4fb._.js.map