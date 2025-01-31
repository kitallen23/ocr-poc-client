import { Container, Flex, Text, Box, Grid } from "@radix-ui/themes";
import { Link } from "react-router-dom";

import { navigationBox } from "@/styles/components/navigation-box.css";

function Home() {
    return (
        <Container size="4">
            <Flex
                direction="row"
                justify="center"
                align="center"
                wrap="wrap"
                style={{
                    minHeight: "80vh",
                    padding: "2rem",
                }}
            >
                <Grid
                    columns={{
                        initial: "1",
                        md: "2",
                    }}
                    gap="6"
                >
                    <Link
                        to="/aws"
                        style={{
                            flex: 1,
                            maxWidth: "400px",
                        }}
                    >
                        <Box className={navigationBox} p="6">
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                gap="4"
                                minHeight="220px"
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                                    alt="Google AI logo"
                                    height="80px"
                                />
                                <Text size="8" weight="bold">
                                    Amazon Demo
                                </Text>
                                <Text size="3" color="gray" align="center">
                                    Explore Amazon Textract API implementation
                                </Text>
                            </Flex>
                        </Box>
                    </Link>

                    <Link
                        to="/google"
                        style={{
                            flex: 1,
                            maxWidth: "400px",
                        }}
                    >
                        <Box className={navigationBox} p="6">
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                gap="4"
                                minHeight="220px"
                            >
                                <img
                                    src="https://lh3.googleusercontent.com/RIR1USuPhQgIwCbC6X09bUiRZKCfu5EkZymDuG0mVQpCM42j0y4tvjSFmtZmezPgcfaCxbGSIkCjNlzXSo_p8KVoDqZvS5nEPKoqog"
                                    alt="Google AI logo"
                                    height="80px"
                                />
                                <Text size="8" weight="bold">
                                    Google Demo
                                </Text>
                                <Text size="3" color="gray" align="center">
                                    Explore Google Document API implementation
                                </Text>
                            </Flex>
                        </Box>
                    </Link>
                </Grid>
            </Flex>
        </Container>
    );
}

export default Home;
