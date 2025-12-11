module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/supabase-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseClient",
    ()=>getSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xpybqjfofdmkeiijvwnx.supabase.co") || "https://xpybqjfofdmkeiijvwnx.supabase.co";
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWJxamZvZmRta2VpaWp2d254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDEyODAsImV4cCI6MjA4MDA3NzI4MH0.Dww9fKSwqzINDt18uhgcQJbeq4rnH3AEedEiteHZ-FQ") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWJxamZvZmRta2VpaWp2d254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDEyODAsImV4cCI6MjA4MDA3NzI4MH0.Dww9fKSwqzINDt18uhgcQJbeq4rnH3AEedEiteHZ-FQ";
let supabaseClient = null;
function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}
}),
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPatientRegistration, setShowPatientRegistration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [patientAutoApproved, setPatientAutoApproved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initializeAuth = async ()=>{
            try {
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
                const { data: { user: authUser }, error } = await supabase.auth.getUser();
                if (authUser && !error) {
                    const emailStr = authUser.email || "";
                    const roleFromMeta = authUser.user_metadata?.role || "patient";
                    const isGmail = emailStr.toLowerCase().endsWith("@gmail.com");
                    setUser({
                        id: authUser.id,
                        email: emailStr,
                        name: authUser.user_metadata?.name || emailStr || "",
                        role: roleFromMeta,
                        phone: authUser.user_metadata?.phone,
                        specialization: authUser.user_metadata?.specialization
                    });
                    // For Gmail patients, do not show registration modal; mark as auto-approved
                    if (roleFromMeta === "patient" && isGmail) {
                        setShowPatientRegistration(false);
                        setPatientAutoApproved(true);
                        // Ensure a patient row exists for Gmail users so booking and payments work
                        try {
                            const { patientService } = await __turbopack_context__.A("[project]/lib/db-service.ts [app-ssr] (ecmascript, async loader)");
                            const existingPatient = await patientService.getByEmail(emailStr);
                            if (!existingPatient) {
                                await patientService.create({
                                    name: authUser.user_metadata?.name || emailStr,
                                    email: emailStr,
                                    phone: authUser.user_metadata?.phone || null,
                                    dob: null,
                                    gender: null,
                                    address: null
                                });
                            }
                        } catch (err) {
                            console.warn("[v0] Could not auto-create patient record for Gmail user:", err);
                        }
                    }
                }
            } catch (error) {
                console.error("[v0] Auth initialization error:", error);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);
    const login = async (email, password)=>{
        // First try to authenticate against the `auth_users` table (registered users)
        try {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
            const { data: authUser, error } = await supabase.from("auth_users").select("*").eq("email", email).maybeSingle();
            if (error) {
                console.warn("[v0] Supabase error checking auth_users:", error);
            }
            if (authUser) {
                // simple password check (password_hash stores the password in this demo app)
                if (authUser.password_hash === password) {
                    const userObj = {
                        id: authUser.id,
                        email: authUser.email,
                        name: authUser.name || authUser.email,
                        role: authUser.role,
                        phone: authUser.phone || undefined,
                        specialization: authUser.specialization || undefined
                    };
                    setUser(userObj);
                    localStorage.setItem("user", JSON.stringify(userObj));
                    // If this is a patient and they don't have a patients row, prompt for profile
                    // but if they're signing in with Gmail, auto-approve and do not show modal
                    const isGmail = (userObj.email || "").toLowerCase().endsWith("@gmail.com");
                    if (userObj.role === "patient") {
                        if (isGmail) {
                            setShowPatientRegistration(false);
                            setPatientAutoApproved(true);
                            // Ensure a patient row exists for Gmail logins
                            try {
                                const { patientService } = await __turbopack_context__.A("[project]/lib/db-service.ts [app-ssr] (ecmascript, async loader)");
                                const existingPatient = await patientService.getByEmail(userObj.email);
                                if (!existingPatient) {
                                    await patientService.create({
                                        name: userObj.name || userObj.email,
                                        email: userObj.email,
                                        phone: userObj.phone || null,
                                        dob: null,
                                        gender: null,
                                        address: null
                                    });
                                }
                            } catch (err) {
                                console.warn("[v0] Could not auto-create patient record after login:", err);
                            }
                        } else {
                            setShowPatientRegistration(true);
                            setPatientAutoApproved(false);
                        }
                    }
                    return;
                } else {
                    throw new Error("Invalid credentials");
                }
            }
        } catch (err) {
            console.warn("[v0] Error authenticating against auth_users:", err);
        }
        // If no auth_users match, try Supabase Auth sign-in (for accounts created via Supabase)
        try {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                // Not authenticated via Supabase - proceed to mock users handling below
                console.warn("[v0] Supabase auth signIn error:", error);
            } else if (data && data.user) {
                const authUser = data.user;
                const roleFromMeta = authUser.user_metadata?.role || "patient";
                const userObj = {
                    id: authUser.id,
                    email: authUser.email || email,
                    name: authUser.user_metadata?.name || authUser.email || email,
                    role: roleFromMeta,
                    phone: authUser.user_metadata?.phone || undefined,
                    specialization: authUser.user_metadata?.specialization || undefined
                };
                setUser(userObj);
                localStorage.setItem("user", JSON.stringify(userObj));
                // For patient users, handle registration modal and auto-approval
                if (userObj.role === "patient") {
                    // Gmail patients auto-approve
                    const isGmail = (userObj.email || "").toLowerCase().endsWith("@gmail.com");
                    if (isGmail) {
                        setShowPatientRegistration(false);
                        setPatientAutoApproved(true);
                    } else {
                        // Non-Gmail patients created via Supabase Auth: don't show registration modal
                        // (they already have an auth account), just set auto-approved
                        setShowPatientRegistration(false);
                        setPatientAutoApproved(true);
                    }
                    // Ensure patient record exists in database
                    try {
                        const { patientService } = await __turbopack_context__.A("[project]/lib/db-service.ts [app-ssr] (ecmascript, async loader)");
                        const existingPatient = await patientService.getByEmail(userObj.email);
                        if (!existingPatient) {
                            await patientService.create({
                                name: userObj.name || userObj.email,
                                email: userObj.email,
                                phone: userObj.phone || null,
                                dob: null,
                                gender: null,
                                address: null
                            });
                        }
                    } catch (err) {
                        console.warn("[v0] Could not auto-create patient record after supabase login:", err);
                    }
                }
                return;
            }
        } catch (err) {
            console.warn("[v0] Error authenticating via Supabase auth:", err);
        }
        throw new Error("Invalid credentials");
    };
    const register = async (email, password, name, phone)=>{
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    phone
                })
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 409 && data.status === "exists") {
                    return {
                        status: "exists",
                        user: data.user
                    };
                }
                throw new Error(data.error || "Registration failed");
            }
            const userObj = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: "patient",
                phone: data.user.phone || phone || undefined
            };
            setUser(userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            setShowPatientRegistration(false);
            return {
                status: "created",
                user: userObj
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error("[v0] Registration error:", errorMsg);
            throw err;
        }
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("user");
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        supabase.auth.signOut();
    };
    const savePatientProfile = async (name, phone)=>{
        try {
            if (!user || user.role !== "patient") {
                throw new Error("Only patients can register");
            }
            // Import patientService dynamically to avoid circular imports
            const { patientService } = await __turbopack_context__.A("[project]/lib/db-service.ts [app-ssr] (ecmascript, async loader)");
            // Check for duplicate patient name
            const existingPatient = await patientService.getByName(name);
            if (existingPatient) {
                throw new Error(`Patient with name '${name}' already exists. Please use a different name.`);
            }
            // Create patient record in database
            const newPatient = await patientService.create({
                name: name,
                email: user.email,
                phone: phone || null,
                dob: null,
                gender: null,
                address: null
            });
            // Ensure an auth_users row exists for this email
            try {
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
                const { data: existingAuthUser, error: authErr } = await supabase.from("auth_users").select("*").eq("email", user.email).maybeSingle();
                if (authErr) {
                    console.warn("[v0] Warning checking auth_users:", authErr);
                }
                if (!existingAuthUser) {
                    const { error: insertErr } = await supabase.from("auth_users").insert([
                        {
                            email: user.email,
                            name: name,
                            role: "patient",
                            phone: phone || null
                        }
                    ]);
                    if (insertErr) {
                        console.warn("[v0] Warning inserting auth_users record:", insertErr);
                    }
                }
            } catch (err) {
                console.warn("[v0] Warning ensuring auth_users record:", err);
            }
            if (newPatient) {
                // Update user state with the new patient info
                const updatedUser = {
                    ...user,
                    name: name,
                    phone: phone
                };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setShowPatientRegistration(false);
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error("[v0] Error saving patient profile:", errorMsg);
            throw error;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            // Disable patient registration modal flow
            showPatientRegistration: false,
            savePatientProfile: async ()=>{}
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bcc6d608._.js.map