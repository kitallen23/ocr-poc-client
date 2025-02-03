import { useMemo, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Flex,
    Grid,
    Heading,
    Select,
    Text,
} from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { HTTPError } from "ky";
import { ExclamationTriangleIcon, LapTimerIcon } from "@radix-ui/react-icons";

import { useGoogleProcessDocument } from "@/api/documentAi";
import SingleImageForm from "@/components/SingleImageForm/SingleImageForm";
import { darkCard } from "@/styles/components/dark-card.css";
import EntityTable from "@/components/EntityTable";
import {
    GoogleProcessorType,
    ProcessedDocumentResponse,
} from "@/types/document.types";
import { usePassword } from "@/contexts/PasswordContext";

const PROCESSOR_TYPE_OPTIONS = {
    "us-drivers-license-parser": "US Drivers License",
    "form-parser": "Form",
    "document-parser": "Document",
};

function GoogleDocumentProcessor() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [ocrResult, setOcrResult] =
        useState<ProcessedDocumentResponse | null>(null);
    const [processorType, setProcessorType] = useState<GoogleProcessorType>(
        "us-drivers-license-parser"
    );
    const [hideBlankEntities, setHideBlankEntities] = useState<boolean>(true);
    const formId = useMemo(() => nanoid(4), []);

    const { mutate, isPending, reset } = useGoogleProcessDocument();
    const { hasError: hasPasswordError, setHasError: setHasPasswordError } =
        usePassword();

    const handleSubmit = async () => {
        setHasPasswordError(false);
        if (selectedImage && !isPending) {
            mutate(
                { file: selectedImage, processorType },
                {
                    onSuccess: data => {
                        console.info(`data: `, data);
                        const sortedFields = [...data.fields].sort((a, b) => {
                            // Put empty values last
                            if (!a.value && b.value) return 1;
                            if (a.value && !b.value) return -1;

                            // For non-empty values, sort by confidence
                            // For empty values, also sort by confidence
                            return b.confidence - a.confidence;
                        });
                        if (
                            sortedFields?.[0]?.label === "generic_entities" &&
                            sortedFields?.[0]?.fields
                        ) {
                            sortedFields[0].fields = [
                                ...data.fields[0].fields!,
                            ].sort((a, b) => {
                                // Put empty values last
                                if (!a.value && b.value) return 1;
                                if (a.value && !b.value) return -1;

                                // For non-empty values, sort by confidence
                                // For empty values, also sort by confidence
                                return b.confidence - a.confidence;
                            });
                        }
                        setOcrResult({
                            ...data,
                            fields: sortedFields,
                        });
                    },
                    onError: err => {
                        if (err instanceof HTTPError) {
                            const statusCode = err.response.status;
                            console.error(
                                `Error ${statusCode} processing document:`,
                                err
                            );
                            setHasPasswordError(true);
                        } else {
                            console.error(`Error processing document:`, err);
                        }
                    },
                }
            );
        }
    };

    const handleSelectedImageChange = (value: File | null) => {
        setSelectedImage(value);
        setOcrResult(null);
        reset();
    };
    const handleProcessorTypeChange = (value: GoogleProcessorType) => {
        if (processorType !== value) {
            setProcessorType(value);
            setOcrResult(null);
            reset();
        }
    };

    const isGenericEntities = useMemo(
        () =>
            ocrResult?.fields[0]?.label === "generic_entities" &&
            ocrResult?.fields[0]?.fields,
        [ocrResult]
    );

    const displayEntities = isGenericEntities
        ? ocrResult?.fields[0]?.fields
        : ocrResult?.fields;

    return (
        <>
            <Heading>Optical Character Recognition - Google Vision API</Heading>
            <Select.Root
                value={processorType}
                onValueChange={(value: GoogleProcessorType) =>
                    handleProcessorTypeChange(value)
                }
            >
                <Select.Trigger>
                    <Text color="gray">Parser:</Text>{" "}
                    <Text>{PROCESSOR_TYPE_OPTIONS[processorType]}</Text>
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Parsers</Select.Label>
                        {Object.entries(PROCESSOR_TYPE_OPTIONS).map(
                            ([value, label]) => (
                                <Select.Item value={value} key={value}>
                                    {label}
                                </Select.Item>
                            )
                        )}
                    </Select.Group>
                </Select.Content>
            </Select.Root>

            <Card>
                <SingleImageForm
                    id={formId}
                    selectedImage={selectedImage}
                    setSelectedImage={handleSelectedImageChange}
                    onSubmit={handleSubmit}
                />
            </Card>
            {selectedImage && (
                <Card style={{ padding: 0 }}>
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                </Card>
            )}
            <Button disabled={!selectedImage} loading={isPending} form={formId}>
                Submit
            </Button>
            {hasPasswordError ? (
                <Text color="red" align="center" as="div">
                    <ExclamationTriangleIcon
                        style={{ marginBottom: "2px", verticalAlign: "middle" }}
                    />{" "}
                    Password is missing or incorrect. Please enter the correct
                    password.
                </Text>
            ) : null}

            {ocrResult?.fields && !isPending ? (
                <Grid columns="1" gap="3" mt="4">
                    <Flex justify="between" gap="3">
                        <Heading size="4">Extracted Fields</Heading>
                        {displayEntities?.length ? (
                            <Flex align="center" gap="2">
                                <Checkbox
                                    checked={hideBlankEntities}
                                    onCheckedChange={value =>
                                        setHideBlankEntities(!!value)
                                    }
                                    id="hide-blank-rows"
                                />
                                <Text
                                    as="label"
                                    htmlFor="hide-blank-rows"
                                    style={{ userSelect: "none" }}
                                >
                                    Hide blank rows
                                </Text>
                            </Flex>
                        ) : (
                            <div />
                        )}
                        <Text color="gray">
                            {ocrResult.requestTime ? (
                                <Flex align="center" gap="1">
                                    <LapTimerIcon />
                                    {`${(ocrResult?.requestTime / 1000).toFixed(2)} seconds`}
                                </Flex>
                            ) : null}
                        </Text>
                    </Flex>
                    <EntityTable
                        entities={displayEntities}
                        hideBlankEntities={hideBlankEntities}
                    />

                    {ocrResult.text ? (
                        <>
                            <Heading size="4">Raw text</Heading>
                            <Card className={darkCard}>
                                <Text
                                    style={{
                                        fontFamily: "monospace",
                                        whiteSpace: "pre",
                                        overflow: "auto",
                                    }}
                                >
                                    {ocrResult.text}
                                </Text>
                            </Card>
                        </>
                    ) : null}
                </Grid>
            ) : null}
        </>
    );
}

export default GoogleDocumentProcessor;
