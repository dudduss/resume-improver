import React from "react";
import {
  Button,
  Input,
  InputGroup,
  Stack,
  Heading,
  Box,
  Text,
  HStack,
  IconButton,
  useMultiStyleConfig,
} from "@chakra-ui/react";

const FileUpload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files![0]);
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3000/api/resume", {
      method: "GET",
    });
    const positionsJson = await response.json();
    console.log(positionsJson);
  };

  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Stack spacing={10} margin={10} alignItems={"center"}>
      <Box alignItems={"center"} width={"50%"}>
        <form onSubmit={handleSubmit}>
          <InputGroup size="lg">
            <Input
              pr="9.5rem"
              type="file"
              placeholder="Upload a resume"
              aria-label="Upload a resume"
              onChange={handleFileChange}
              sx={{
                "::file-selector-button": {
                  border: "none",
                  outline: "none",
                  marginTop: 1,
                  marginBottom: 1,
                  mr: 2,
                  ...styles,
                },
              }}
            />
          </InputGroup>
        </form>
      </Box>
      <Box alignItems={"center"}>
        <Button
          h="3.5rem"
          size="lg"
          onClick={handleSubmit}
          colorScheme={"messenger"}
        >
          Upload
        </Button>
      </Box>
    </Stack>
  );
};

export default FileUpload;
