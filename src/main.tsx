import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import AdministrationProvider from "./store/administration-context";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Admin from "./Components/routes/Admin/Admin.tsx";
import WebViewApp from "./Components/routes/WebViewApp/WebViewApp.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/", element: <App/>, children: [
            {
                path: "/administration", element: <ProtectedRoute><Admin/></ProtectedRoute>
            },
            {
                path: "/web_view_app", element: <ProtectedRoute><WebViewApp/></ProtectedRoute>
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AdministrationProvider>
            <RouterProvider router={router}/>
        </AdministrationProvider>
    </StrictMode>,
)
