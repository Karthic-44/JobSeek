import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isRecruiter = user && user?.roles.includes("ROLE_RECRUITER");
    const location = useLocation();

    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />
    }

    if (adminOnly) {
        if (isRecruiter && !isAdmin) {
            const recruiterAllowedPaths = ["/recruiter/job"];
            const recruiterAllowed = recruiterAllowedPaths.some(path => 
                location.pathname.startsWith(path)
            );
            if (!recruiterAllowed) {
                return <Navigate to="/" replace />
            }
        }
    }

    if (!isAdmin && !isRecruiter) {
        return <Navigate to="/"/>
    }
    
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute