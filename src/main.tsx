import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@radix-ui/themes/styles.css";
import "@/styles/global.css";

import App from "@/App.tsx";
import Home from "@/pages/Home/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/query-client.ts";

import GoogleDocumentProcessor from "@/pages/GoogleDocumentProcessor/GoogleDocumentProcessor";
import AWSDocumentProcessor from "@/pages/AWSDocumentProcessor/AWSDocumentProcessor";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/google",
                element: <GoogleDocumentProcessor />,
            },
            {
                path: "/aws",
                element: <AWSDocumentProcessor />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
