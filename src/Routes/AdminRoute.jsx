import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth(); // আপনার Auth Context থেকে ডাটা নিন
    const isAdmin = useAdmin(); // ডাটাবেস থেকে চেক করুন ইউজার অ্যাডমিন কিনা

    if (loading) return <progress className="progress w-56"></progress>;
    if (user && isAdmin) return children;

    return <Navigate to="/login" replace></Navigate>;
};

export default AdminRoute;