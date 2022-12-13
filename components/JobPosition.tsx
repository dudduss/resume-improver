import {
  Button,
  Heading,
  Box,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { Position } from "../public/schemas";
import React, { useState } from "react";
import { CopyIcon, SunIcon } from "@chakra-ui/icons";

interface JobPositionProps {
  position: Position;
}

const JobPosition: React.FC<JobPositionProps> = ({ position }) => {
  const [choices, setChoices] = useState<string[][]>([]);
  const [isGettingImprovements, setIsGettingImprovements] = useState(false);

  const handleSubmit = async () => {
    // run mutliple requests for each highlight
    setIsGettingImprovements(true);

    try {
      const choices = position.highlights.map(async (highlight) => {
        const url = `http://localhost:3000/api/improvements`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ highlight: highlight }),
        });
        const improvementsJson = await response.json();
        return improvementsJson
      });
  
      Promise.all(choices).then((values) => {
        setChoices(values);
        setIsGettingImprovements(false);
      });
    } catch (error) {
      setIsGettingImprovements(false);
      console.log(error);
    }


  };

  return (
    <Box
      marginTop={100}
      borderWidth="3px"
      padding={5}
      style={{ borderRadius: 10 }}
    >
      <HStack marginBottom={5}>
        <Box>
          <Heading size="md">{position.title}</Heading>
          <Text size="md">
            {position.employerName}
            {", "}
            {position.startDate}
            {" to "} {position.endDate}
          </Text>
        </Box>
        <Button
          h="2.5rem"
          size="md"
          onClick={handleSubmit}
          colorScheme="whatsapp"
          style={{ marginLeft: 20 }}
            isLoading={isGettingImprovements}
          loadingText="Generating"
          spinnerPlacement="end"
        >
          Improve
        </Button>
      </HStack>

      {position.highlights.map((highlight, i) => (
        <Box key={highlight}>
          <Text fontSize="xl" marginBottom={5}>
            • {highlight}
          </Text>
          {choices.length > 0 &&
            choices[i] &&
            choices[i].map((choice) => (
              <HStack
                marginBottom={5}
                borderWidth="3px"
                padding={5}
                style={{ marginLeft: 20, borderRadius: 10 }}
                key={choice}
              >
                <SunIcon color="yellow.500" w={5} h={5}></SunIcon>
                <Text fontSize="lg" marginBottom={5}>
                  {choice}
                </Text>
                <IconButton
                  colorScheme="blue"
                  aria-label="Copy"
                  icon={<CopyIcon />}
                  onClick={() => navigator.clipboard.writeText(choice)}
                />
              </HStack>
            ))}
        </Box>
      ))}
    </Box>
  );
};

export default JobPosition;
