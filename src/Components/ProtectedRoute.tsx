import {type ReactNode, useContext, useEffect} from "react";
import {AdministrationContext} from "../store/contexts.tsx";
import {useNavigate} from "react-router-dom";

type ProtectedRouteProps = {
    children: ReactNode;
    requiredRoles?: string[];
}

const ProtectedRoute = ({children, requiredRoles}: ProtectedRouteProps) => {
    const {isLoggedIn, isHealthy, allowedRoles} = useContext(AdministrationContext);
    const navigate = useNavigate();

    const hasAccess = !requiredRoles || requiredRoles.some(role => allowedRoles.includes(role));

    useEffect(() => {
        if (!isHealthy || !isLoggedIn || !hasAccess) {
            navigate("/");
        }
    }, [isHealthy, isLoggedIn, hasAccess, navigate]);

    if (!isHealthy || !isLoggedIn || !hasAccess) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;