import { usePassword } from "@/contexts/PasswordContext";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

type ErrorMessageProps = {
    errorText?: string;
};

function ErrorMessage({ errorText }: ErrorMessageProps) {
    const { hasError: hasPasswordError } = usePassword();
    if (hasPasswordError) {
        return (
            <Callout.Root color="red">
                <Callout.Icon>
                    <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                    Password is missing or incorrect. Please enter the correct
                    password.
                </Callout.Text>
            </Callout.Root>
        );
    } else if (errorText) {
        return (
            <Callout.Root color="red">
                <Callout.Icon>
                    <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>Error: {errorText}</Callout.Text>
            </Callout.Root>
        );
    }
    return null;
}

export default ErrorMessage;
