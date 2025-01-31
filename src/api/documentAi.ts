import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import {
    ProcessedDocumentResponse,
    AmazonProcessorType,
    GoogleProcessorType,
} from "@/types/document.types";
import { fileToBase64 } from "@/utils/fileHelpers";

const api = ky.create({
    prefixUrl: "http://localhost:3000/api",
    timeout: 60000,
});

export const useGoogleProcessDocument = () => {
    return useMutation<
        ProcessedDocumentResponse,
        Error,
        { file: File; processorType: GoogleProcessorType }
    >({
        mutationFn: async ({ file, processorType }) => {
            const startTime = Date.now();
            const base64Content = await fileToBase64(file);

            const response = await api
                .post(`process-document/google/${processorType}`, {
                    json: {
                        content: base64Content,
                        mimeType: file.type,
                    },
                })
                .json();
            return {
                ...(response as ProcessedDocumentResponse),
                requestTime: Date.now() - startTime,
            };
        },
    });
};

export const useAmazonProcessDocument = () => {
    return useMutation<
        ProcessedDocumentResponse,
        Error,
        { file: File; processorType: AmazonProcessorType }
    >({
        mutationFn: async ({ file, processorType }) => {
            const startTime = Date.now();
            const base64Content = await fileToBase64(file);

            const response = await api
                .post(`process-document/aws/${processorType}`, {
                    json: {
                        content: base64Content,
                        mimeType: file.type,
                    },
                })
                .json();
            return {
                ...(response as ProcessedDocumentResponse),
                requestTime: Date.now() - startTime,
            };
        },
    });
};
