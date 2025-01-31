import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { fileToBase64 } from "@/utils/fileHelpers";

const api = ky.create({
    prefixUrl: "http://localhost:3000/api",
    timeout: 60000,
});

export interface Entity {
    type: string;
    mentionText: string;
    confidence: number;
}

export interface ProcessedDocumentResponse {
    document: {
        text: string;
        entities: Entity[];
    };
    requestTime: number;
}

export type ProcessorType = "us_drivers_license_parser" | "document_parser";

export const useGoogleProcessDocument = (processor: ProcessorType) => {
    return useMutation<ProcessedDocumentResponse, Error, File>({
        mutationFn: async (file: File) => {
            const startTime = Date.now();
            const base64Content = await fileToBase64(file);

            const response = await api
                .post(`process-document/google/${processor}`, {
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
