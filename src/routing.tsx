import {createBrowserRouter} from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import Admin from "./Components/routes/Admin/Admin.tsx";
import WebViewApp from "./Components/routes/WebViewApp/WebViewApp.tsx";
import {type JSX} from "react";
import {ADMINISTRATION_PAGE, ROLE_WEBAPP, WEB_VIEW_PAGE} from "./store/constants.tsx";
import EntryPage from "./Components/routes/EntryPage/EntryPage.tsx";

interface Route {
    path: string;
    element: JSX.Element;
    displayText?: string;
    showInSidebar?: boolean;
    requiredRoles?: string[];
}

export const pageRoutes: Route[] = [
    { path: "/", element: <EntryPage />, showInSidebar: false},
    { path: ADMINISTRATION_PAGE, element: <ProtectedRoute ><Admin /></ProtectedRoute>, displayText: "Administration"},
    { path: WEB_VIEW_PAGE, element: <ProtectedRoute requiredRoles={[ROLE_WEBAPP]}><WebViewApp /></ProtectedRoute>, displayText: "Web View App"},
]

export const router = createBrowserRouter([
    {
        path: "/", element: <App/>, children: pageRoutes
    }
], {
    basename: import.meta.env.BASE_URL
});