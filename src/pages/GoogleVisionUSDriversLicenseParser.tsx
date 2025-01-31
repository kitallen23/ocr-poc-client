import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    Heading,
    Section,
    Table,
    Text,
} from "@radix-ui/themes";
import { nanoid } from "nanoid";

import SingleImageForm from "@/components/SingleImageForm/SingleImageForm";
import {
    ProcessedDocumentResponse,
    useGoogleProcessDocument,
} from "@/api/documentAi";

function GoogleVisionUSDriversLicenseParser() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [ocrResult, setOcrResult] =
        useState<ProcessedDocumentResponse | null>(null);
    const formId = useMemo(() => nanoid(4), []);

    const { mutate, isPending } = useGoogleProcessDocument(
        "us_drivers_license_parser"
    );

    const handleSubmit = async () => {
        if (selectedImage && !isPending) {
            mutate(selectedImage, {
                onSuccess: data => {
                    setOcrResult(data);
                },
                onError: err => {
                    console.error(`Error processing document: `, err);
                },
            });
        }
    };

    return (
        <Box>
            <Container size="2" align="center">
                <Section mx="4">
                    <Grid gap="4">
                        <Heading>
                            Optical Character Recognition - Google Vision API
                        </Heading>
                        <Heading size="4">
                            Using "US Drivers License Parser"
                        </Heading>
                        <Card>
                            <SingleImageForm
                                id={formId}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
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
                        <Button
                            disabled={!selectedImage}
                            loading={isPending}
                            form={formId}
                        >
                            Submit
                        </Button>

                        {ocrResult?.document?.entities?.length && !isPending ? (
                            <Grid columns="1" gap="3" mt="4">
                                <Grid columns="1fr auto" gap="3">
                                    <Heading size="4">
                                        Extracted fields{" "}
                                    </Heading>
                                    <Text color="gray">
                                        {ocrResult.requestTime
                                            ? `${(ocrResult?.requestTime / 1000).toFixed(2)} seconds`
                                            : null}
                                    </Text>
                                </Grid>
                                <Table.Root variant="surface">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell>
                                                Label
                                            </Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>
                                                Value
                                            </Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell>
                                                Confidence
                                            </Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {ocrResult.document.entities.map(
                                            (
                                                {
                                                    type,
                                                    mentionText,
                                                    confidence,
                                                },
                                                i
                                            ) => (
                                                <Table.Row key={`${i}-${type}`}>
                                                    <Table.RowHeaderCell>
                                                        {type}
                                                    </Table.RowHeaderCell>
                                                    <Table.Cell>
                                                        {mentionText}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {confidence.toFixed(2)}
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </Grid>
                        ) : null}
                    </Grid>
                </Section>
            </Container>
        </Box>
    );
}

export default GoogleVisionUSDriversLicenseParser;
