import { Head } from "@inertiajs/react";
import UserNavbar from "@/Layouts/UserNavbar";

export default function Index() {
    return (
        <div className=" bg-gradient-to-b from-gray-50 to-white">
            <Head title="Home" />
            <UserNavbar />

            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold mb-6 text-gray-800">Welcome to the POS System</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Manage your sales, inventory, and customers with ease.
                </p>
                <a
                    href="/dashboard"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
}