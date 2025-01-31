import { Grid, Text } from "@radix-ui/themes";
import { useDropzone } from "react-dropzone";
import { Form } from "radix-ui";

import { dropzone, dropzoneText } from "./dropzone.css.ts";

interface SingleImageFormProps {
    id: string;
    selectedImage: File | null;
    setSelectedImage: (image: File | null) => void;
    onSubmit: () => void;
}

function SingleImageForm({
    id,
    selectedImage,
    setSelectedImage,
    onSubmit,
}: SingleImageFormProps) {
    const onDrop = (acceptedFiles: File[]) => {
        setSelectedImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
        },
        multiple: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Form.Root id={id} onSubmit={handleSubmit}>
            <Grid columns="1" gap="3">
                <Form.Field name="image">
                    <div
                        {...getRootProps()}
                        className={dropzone}
                        data-dragging={isDragActive}
                    >
                        <Form.Control asChild>
                            <input {...getInputProps()} />
                        </Form.Control>
                        {selectedImage && selectedImage.name ? (
                            <Text>File chosen: {selectedImage.name}</Text>
                        ) : isDragActive ? (
                            <Text className={dropzoneText}>
                                Drop the image here
                            </Text>
                        ) : (
                            <Text className={dropzoneText}>
                                Drag and drop an image, or click to select
                            </Text>
                        )}
                    </div>
                    <Form.Message match="valueMissing">
                        Please select an image
                    </Form.Message>
                </Form.Field>
            </Grid>
        </Form.Root>
    );
}

export default SingleImageForm;
