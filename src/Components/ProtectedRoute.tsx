import {type ReactNode, useContext, useEffect} from "react";
import {AdministrationContext} from "../store/contexts.tsx";
import {useNavigate} from "react-router-dom";

type ProtectedRouteProps = {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {isLoggedIn, isHealthy} = useContext(AdministrationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isHealthy || !isLoggedIn) {
            navigate("/");
        }
    }, [isHealthy, isLoggedIn, navigate]);

    if (!isHealthy || !isLoggedIn) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;