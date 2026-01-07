import React, {useReducer} from "react";
import {type AdministrationState, type AdministrationAction, AdministrationContext} from "./contexts";
import Config from "../config";
import {PRIMROSE_TOKEN} from "./constants";

const initialState: AdministrationState = {
    isHealthCheckInProgress: false,
    isHealthy: false,
    isRateLimited: false,
    lastHealthcheckTime: new Date(),
    isLoggingInInProgress: false,
    isLoggedIn: false,
    loginToken: null,
    isLastLoginFailed: false,
    loginName: 'anonymous',
};

function administrationReducer(state: AdministrationState, action: AdministrationAction): AdministrationState {
    switch (action.type) {
        case "CHECK_HEALTH_STATUS":
            return {...state,
                isHealthCheckInProgress: true,
                lastHealthcheckTime: new Date()};
        case "HEALTH_CHECK_SUCCESS":
            return {...state,
                isHealthCheckInProgress: false,
                isHealthy: true,
                isRateLimited: false};
        case "HEALTH_CHECK_FAILURE":
            return {...state,
                isHealthCheckInProgress: false,
                isHealthy: false};
        case "HEALTH_CHECK_RATE_LIMITED":
            return {...state,
                isHealthCheckInProgress: false,
                isRateLimited: true};
        case "RESET_RATE_LIMIT":
            return {...state, isRateLimited: false};
        case "LOGIN":
            return {...state,
                isLoggingInInProgress: true,
                isLastLoginFailed: false
            };
        case "LOGIN_SUCCESS":
            localStorage.setItem(PRIMROSE_TOKEN, action.loginToken);
            return {...state,
                isLoggingInInProgress: false,
                isLoggedIn: true,
                loginToken: action.loginToken,
                loginName: action.loginName,
            };
        case "LOGIN_FAILURE":
            return {...state,
                isLoggingInInProgress: false,
                isLoggedIn: false,
                isLastLoginFailed: true};
        case "LOGOUT":
            return {...state,
                isLoggedIn: false,
                loginToken: null};
        default:
            return state;
    }
}

export default function AdministrationProvider({children}: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(administrationReducer, initialState);

    function checkHealthStatus() {
        if (state.isRateLimited) return;

        dispatch({type: "CHECK_HEALTH_STATUS"});
        const url = `${Config.apiUrl}/health`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 5000);

        fetch(url, {
            signal: controller.signal,
            headers: {
                "X-Health-Token": Config.healthCheckToken
            }
        })
            .then((response) => {
                if (response.status === 429) {
                    dispatch({type: "HEALTH_CHECK_RATE_LIMITED"});
                    setTimeout(() => {
                        dispatch({type: "RESET_RATE_LIMIT"});
                    }, 60000); // Reset after 60 seconds
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Health check failed with status: ${response.status}`);
                }
                dispatch({type: "HEALTH_CHECK_SUCCESS"});
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error("Health check fetch error:", err);
                }
                dispatch({type: "HEALTH_CHECK_FAILURE"});
            })
            .finally(() => {
                clearTimeout(timeoutId);
            });
    }

    function login(username: string, password: string) {
        dispatch({type: "LOGIN"});
        const url = `${Config.apiUrl}/api/auth/login`;
        
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({username, password})
        })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json().catch(() => ({}));
                    const token = data.token || 
                                 response.headers.get("X-Auth-Token") || 
                                 response.headers.get("Authorization")?.replace("Bearer ", "");
                    
                    if (!token) {
                        throw new Error("No token returned from server (checked body and headers).");
                    }
                    
                    dispatch({type: "LOGIN_SUCCESS", loginToken: token, loginName: username});
                } else {
                    dispatch({type:"LOGIN_FAILURE"})
                }
            })
            .catch((err) => {
                console.error("Login error:", err);
                dispatch({type: "LOGIN_FAILURE"})
            })
    }

    function logout() {
        dispatch({type: "LOGOUT"});
    }

    function tryLoadStoredToken() {
        const token = localStorage.getItem(PRIMROSE_TOKEN);
        if (token) {
            dispatch({type: "LOGIN_SUCCESS", loginToken: token});
        }
    }

    const contextValue = {
        isHealthCheckInProgress: state.isHealthCheckInProgress,
        isHealthy: state.isHealthy,
        isRateLimited: state.isRateLimited,
        lastHealthcheckTime: state.lastHealthcheckTime,
        isLoggingInInProgress: state.isLoggingInInProgress,
        isLoggedIn: state.isLoggedIn,
        loginToken: state.loginToken,
        isLastLoginFailed: state.isLastLoginFailed,
        loginName: state.loginName,
        checkHealthStatus,
        login,
        logout,
        tryLoadStoredToken,
    };

    return (
        <AdministrationContext.Provider value={contextValue}>
            {children}
        </AdministrationContext.Provider>
    );
}