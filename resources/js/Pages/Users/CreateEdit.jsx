import Breadcrumb from "@/Components/Breadcrumb";
import InputError from "@/Components/InputError";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";

export default function UsersCreateEdit({ user, roles }) {
    // Default user object if not passed
    user = user || {
        id: null,
        name: "",
        email: "",
        roles: [],
        created_at: null,
        status: 1,
    };

    const { data, setData, post, patch, errors, reset, processing } = useForm({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        roles: Array.isArray(user.roles) && user.roles.length ? user.roles : [],
        status: user.status ?? 1,
    });

    const handleStatusChange = (e) => {
        setData("status", parseInt(e.target.value));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!user.id) {
            post(route("users.store"), {
                preserveState: true,
                onFinish: () => reset("password"),
            });
        } else {
            patch(route("users.update", user.id), {
                preserveState: true,
                onFinish: () => reset("password"),
            });
        }
    };

    const headWeb = user.id ? "User Edit" : "User Create";
    const linksBreadcrumb = [
        { title: "Home", url: "/" },
        { title: headWeb, url: "" },
    ];

    return (
        <AdminLayout
            breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}
        >
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    {user.id ? "Edit User" : "Register Data Management"}
                                </h3>
                            </div>
                            <form onSubmit={submit}>
                                <div className="card-body">
                                    {/* #ID Field */}
                                    {user.id && (
                                        <div className="form-group">
                                            <label className="text-uppercase" htmlFor="id">
                                                #ID
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={user.id}
                                                readOnly
                                            />
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="name">
                                            <span className="text-danger">*</span> Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="email">
                                            <span className="text-danger">*</span> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            readOnly={!!user.id}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {/* Password (only on create) */}
                                    {!user.id && (
                                        <div className="form-group">
                                            <label className="text-uppercase" htmlFor="password">
                                                <span className="text-danger">*</span> Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                autoComplete="new-password"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.password} />
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="status">
                                            <span className="text-danger">*</span> Status
                                        </label>
                                        <select
                                            name="status"
                                            value={data.status}
                                            onChange={handleStatusChange}
                                            className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                            required
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                            {user.id && <option value={2}>Deactivated</option>}
                                        </select>
                                        <InputError className="mt-2" message={errors.status} />
                                    </div>

                                    {/* Single Role Selection */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="roles">
                                            <span className="text-danger">*</span> Role
                                        </label>
                                        <select
                                            name="roles"
                                            value={data.roles[0] ?? ""}
                                            onChange={(e) =>
                                                setData(
                                                    "roles",
                                                    e.target.value ? [parseInt(e.target.value)] : []
                                                )
                                            }
                                            className={`form-control ${errors.roles ? "is-invalid" : ""}`}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.roles} />
                                    </div>
                                </div>

                                <div className="card-footer clearfix">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? user?.id
                                                ? "Updating..."
                                                : "Saving..."
                                            : user?.id
                                            ? "Update"
                                            : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
