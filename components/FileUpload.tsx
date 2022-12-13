import React from "react";
import {
  Button,
  Input,
  InputGroup,
  Stack,
  Box,
  useMultiStyleConfig,
} from "@chakra-ui/react";

import { Position } from "../public/schemas";
import JobPosition from "./JobPosition";

const FileUpload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [positions, setPositions] = React.useState<Position[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files![0]);
  };

  const handleSubmit = async () => {
    const reader = new FileReader();
    reader.readAsDataURL(file!);
    reader.onload = async () => {
      const resumeStr = reader.result!.toString().split(",")[1];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/highlights/`,
        {
          method: "POST",
          body: JSON.stringify({ resume: resumeStr }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const positionsJson = (await response.json()) as Position[];
      setPositions(positionsJson);
    };
  };

  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Stack spacing={10} margin={10} alignItems={"center"}>
      <Box width={"50%"}>
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
      <Box>
        {positions.map((position) => (
          <JobPosition
            key={position.title + position.employerName}
            position={position}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default FileUpload;
