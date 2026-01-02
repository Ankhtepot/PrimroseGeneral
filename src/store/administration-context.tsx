import {createContext} from "react";

export const AdministrationContext = createContext({
    healthCheckInProgress:  false,
    isHealthy: false,
    isLoggedIn: false,
});