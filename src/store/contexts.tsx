import { createContext } from "react";

export interface AdministrationState {
    isHealthCheckInProgress: boolean;
    isHealthy: boolean;
    isLoggingInInProgress: boolean;
    isLoggedIn: boolean;
}

export type AdministrationAction =
    | { type: "CHECK_HEALTH_STATUS" }
    | { type: "HEALTH_CHECK_SUCCESS" }
    | { type: "HEALTH_CHECK_FAILURE" }
    | { type: "LOGIN"; username?: string; password?: string }
    | { type: "LOGIN_SUCCESS" }
    | { type: "LOGIN_FAILURE" };

export interface AdministrationContextType extends AdministrationState {
    checkHealthStatus: () => void;
    login: (username: string, password: string) => void;
}

export const AdministrationContext = createContext<AdministrationContextType>({
    isHealthCheckInProgress: false,
    isHealthy: false,
    isLoggingInInProgress: false,
    isLoggedIn: false,
    checkHealthStatus: () => {},
    login: (_username: string, _password: string) => {},
});