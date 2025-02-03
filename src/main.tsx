import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

import "@radix-ui/themes/styles.css";
import "@/styles/global.css";

import App from "@/App.tsx";
import Home from "@/pages/Home/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/query-client.ts";

import OCRFormLayout from "@/pages/OCRFormLayout/OCRFormLayout";
import { PasswordProvider } from "@/contexts/PasswordProvider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "google",
                element: <OCRFormLayout />,
            },
            {
                path: "aws",
                element: <OCRFormLayout />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PasswordProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </PasswordProvider>
    </StrictMode>
);
