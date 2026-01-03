import React, {useReducer} from "react";
import {type AdministrationState, type AdministrationAction, AdministrationContext} from "./contexts";
import Config from "../config";

const initialState: AdministrationState = {
    isHealthCheckInProgress: false,
    isHealthy: false,
    isLoggingInInProgress: false,
    isLoggedIn: false,
};

function admnistrationReducer(state: AdministrationState, action: AdministrationAction): AdministrationState {
    switch (action.type) {
        case "CHECK_HEALTH_STATUS":
            return {...state, isHealthCheckInProgress: true};
        case "HEALTH_CHECK_SUCCESS":
            return {...state, isHealthCheckInProgress: false, isHealthy: true};
        case "HEALTH_CHECK_FAILURE":
            return {...state, isHealthCheckInProgress: false, isHealthy: false};
        case "LOGIN":
            return {...state, isLoggingInInProgress: true};
        case "LOGIN_SUCCESS":
            return {...state, isLoggingInInProgress: false, isLoggedIn: true};
        case "LOGIN_FAILURE":
            return {...state, isLoggingInInProgress: false, isLoggedIn: false};
        default:
            return state;
    }
}

export default function AdministrationProvider({children}: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(admnistrationReducer, initialState);

    function checkHealthStatus() {
        dispatch({type: "CHECK_HEALTH_STATUS"});
        const url = `${Config.apiUrl}/health`;
        fetch(url)
            .then(() => {
                dispatch({type: "HEALTH_CHECK_SUCCESS"});
            })
            .catch((err) => {
                console.error(err);
                dispatch({type: "HEALTH_CHECK_FAILURE"});
            })
    }

    function login(username: string, password: string) {
        dispatch({type: "LOGIN"});
        const url = `${Config.apiUrl}/api/auth/login`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Health-Token": Config.healthCheckToken
            },
            body: JSON.stringify({username, password})
        })
            .then(() => {
                const sc = true;
                dispatch({type: sc ? "LOGIN_SUCCESS" : "LOGIN_FAILURE"})
            })
            .catch((err) => {
                console.error(err);
                dispatch({type: "LOGIN_FAILURE"})
            })
    }

    const contextValue = {
        isHealthCheckInProgress: state.isHealthCheckInProgress,
        isHealthy: state.isHealthy,
        isLoggingInInProgress: state.isLoggingInInProgress,
        isLoggedIn: state.isLoggedIn,
        checkHealthStatus,
        login,
    };

    return (
        <AdministrationContext.Provider value={contextValue}>
            {children}
        </AdministrationContext.Provider>
    );
}