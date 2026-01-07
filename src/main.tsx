import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.css'
import AdministrationProvider from "./store/administration-context";
import {RouterProvider} from "react-router-dom";
import {router} from "./routing.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AdministrationProvider>
            <RouterProvider router={router}/>
        </AdministrationProvider>
    </StrictMode>,
)
