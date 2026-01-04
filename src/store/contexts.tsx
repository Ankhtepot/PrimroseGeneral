import { createContext } from "react";

export interface AdministrationState {
    isHealthCheckInProgress: boolean;
    isHealthy: boolean;
    isRateLimited: boolean;
    lastHealthcheckTime: Date;
    isLoggingInInProgress: boolean;
    isLoggedIn: boolean;
    loginToken: string | null;
    isLastLoginFailed: boolean;
}

export type AdministrationAction =
    | { type: "CHECK_HEALTH_STATUS" }
    | { type: "HEALTH_CHECK_SUCCESS" }
    | { type: "HEALTH_CHECK_FAILURE" }
    | { type: "HEALTH_CHECK_RATE_LIMITED" }
    | { type: "RESET_RATE_LIMIT" }
    | { type: "LOGIN"; username?: string; password?: string }
    | { type: "LOGIN_SUCCESS"; loginToken: string }
    | { type: "LOGIN_FAILURE" }
    | { type: "LOGOUT" };

export interface AdministrationContextType extends AdministrationState {
    checkHealthStatus: () => void;
    login: (username: string, password: string) => void;
    logout: () => void;
    tryLoadStoredToken: () => void;
}

export const AdministrationContext = createContext<AdministrationContextType>({
    isHealthCheckInProgress: false,
    isHealthy: false,
    isRateLimited: false,
    isLoggingInInProgress: false,
    isLoggedIn: false,
    lastHealthcheckTime: new Date(),
    loginToken: null,
    isLastLoginFailed: false,
    checkHealthStatus: () => {},
    login: (_username: string, _password: string) => {},
    logout: () => {},
    tryLoadStoredToken: () => {}
});