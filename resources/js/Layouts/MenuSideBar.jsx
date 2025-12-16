import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

function MenuGroup({ label, icon, children, active }) {
    const [open, setOpen] = useState(active);

    useEffect(() => {
        setOpen(active);
    }, [active]);

    return (
        <div className="mb-2">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center w-full px-2 py-2.5 rounded-lg font-medium transition-all duration-300 group ${
                    open || active
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
            >
                <span
                    className={`mr-3 transition-colors duration-300 ${
                        open || active
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                    }`}
                >
                    {icon}
                </span>
                <span className="flex-1 text-left text-sm font-semibold">
                    {label}
                </span>
                <svg
                    className={`w-4 h-4 ml-auto transition-all duration-300 ${
                        open ? "rotate-90" : ""
                    } ${
                        open || active
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            <div
                className={`transition-all duration-300 overflow-hidden ${
                    open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
            >
                <div className="pl-2 space-y-1">{children}</div>
            </div>
        </div>
    );
}

/* ----------------------------
 * Simple Menu Item
 * ---------------------------- */
function MenuItem({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                active
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700 border-l-4 border-transparent"
            }`}
        >
            {/* Icon */}
            <span
                className={`mr-3 ${active ? "text-blue-600" : "text-gray-400"}`}
            >
                {icon}
            </span>

            {/* Label */}
            <span
                className={`text-sm transition-colors duration-200 ${
                    active
                        ? "text-blue-700"
                        : "text-gray-600 group-hover:text-gray-900"
                }`}
            >
                {label}
            </span>
        </Link>
    );
}

/* ----------------------------
 * Sidebar Component
 * ---------------------------- */
export default function MenuSideBar() {
    const { auth } = usePage().props;
    const can = auth?.can ?? {};
    const routeName = route().current();

    const isActive = (...names) => names.some((n) => routeName?.includes(n));

    const icons = {
        dashboard: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
        ),
        user: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx="9" cy="7" r="4" />
            </svg>
        ),
        role: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-lock"
            >
                <circle cx="10" cy="7" r="4" />
                <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
                <path d="M15 15.5V14a2 2 0 0 1 4 0v1.5" />
                <rect width="8" height="5" x="13" y="16" rx=".899" />
            </svg>
        ),
        quiz: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"
            >
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
            </svg>
        ),
    };

    return (
        <aside className="main-sidebar bg-white border-r border-gray-200 w-64 fixed h-full overflow-y-auto pb-4">
            {/* ----------------------------
             * Header / Logo
             * ---------------------------- */}
            <div className="px-4 py-3 border-b border-gray-100 mt-2">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/person-icon.svg"
                        className="w-5 h-5 rounded-lg object-contain scale-150"
                        alt="Logo"
                    />
                    <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 leading-tight">
                            Kib Zin
                        </div>
                        <div className="text-xs text-gray-500 leading-tight">
                            2 nak 4 moto
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------------------------
             * Sidebar Menu
             * ---------------------------- */}
            <div className="sidebar">
                <nav className="flex-1 px-2 py-3 space-y-2">
                    {/* Dashboard */}
                    <MenuItem
                        href={route("dashboard")}
                        icon={icons.dashboard}
                        label={"Dashboard"}
                        active={isActive("dashboard")}
                    />

                    {(can["category-list"] || can["category-create"]) && (
                        <MenuGroup
                            label={"Category"}
                            icon={icons.quiz}
                            active={isActive("categories")}
                        >
                            <MenuItem
                                href={route("categories.index")}
                                label={"Category List"}
                                active={routeName === "categories.index"}
                            />
                            {can["category-create"] && (
                                <MenuItem
                                    href={route("categories.create")}
                                    label={"Create Category"}
                                    active={routeName === "categories.create"}
                                />
                            )}
                        </MenuGroup>
                    )}

                    {/* Authentication Section */}
                    {(can["role-list"] || can["user-list"]) && (
                        <>
                            <div className="text-xs font-semibold text-gray-400 mb-2 pt-2 px-2 tracking-wider uppercase">
                                {"Authentication"}
                            </div>
                            {(can["role-list"] || can["role-create"]) && (
                                <MenuGroup
                                    label={"Roles"}
                                    icon={icons.role}
                                    active={isActive("roles")}
                                >
                                    <MenuItem
                                        href={route("roles.index")}
                                        label={"Roles List"}
                                        active={routeName === "roles.index"}
                                    />
                                    {can["role-create"] && (
                                        <MenuItem
                                            href={route("roles.create")}
                                            label={"Create Role"}
                                            active={
                                                routeName === "roles.create"
                                            }
                                        />
                                    )}
                                </MenuGroup>
                            )}

                            {(can["user-list"] || can["user-create"]) && (
                                <MenuGroup
                                    label={"Users"}
                                    icon={icons.user}
                                    active={isActive("users")}
                                >
                                    <MenuItem
                                        href={route("users.index")}
                                        label={"User List"}
                                        active={routeName === "users.index"}
                                    />
                                    {can["user-create"] && (
                                        <MenuItem
                                            href={route("users.create")}
                                            label={"Create User"}
                                            active={
                                                routeName === "users.create"
                                            }
                                        />
                                    )}
                                </MenuGroup>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
}