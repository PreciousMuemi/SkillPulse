import React from 'react';
import {
    SimpleGrid,
    Box,
    Text,
    Badge,
    Avatar,
    VStack,
    HStack,
    Button
} from '@chakra-ui/react';

export const MentorList = ({ mentors }) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {mentors.map((mentor) => (
                <Box
                    key={mentor.mentor_id}
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="sm"
                >
                    <VStack align="start" spacing={4}>
                        <HStack>
                            <Avatar size="lg" name={mentor.name} />
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">{mentor.name}</Text>
                                <Badge colorScheme="green">
                                    {mentor.experience_years} years experience
                                </Badge>
                            </VStack>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">{mentor.bio}</Text>
                        <HStack wrap="wrap">
                            {mentor.skills.map((skill) => (
                                <Badge key={skill} colorScheme="blue">{skill}</Badge>
                            ))}
                        </HStack>
                        <Button colorScheme="blue" size="sm" w="full">
                            Schedule Session
                        </Button>
                    </VStack>
                </Box>
            ))}
        </SimpleGrid>
    );
};

// Add display for mentor details
const MentorCard = ({ mentor }) => (
    <Box p={5} shadow="md" borderWidth="1px">
        <Heading size="md">{mentor.name}</Heading>
        <Text>Experience: {mentor.experience_years} years</Text>
        <Text>Rating: {mentor.rating}/5</Text>
        <Text>Availability: {mentor.availability}</Text>
        <Text>Timezone: {mentor.timezone}</Text>
        <Stack direction="row">
            {mentor.skills.map(skill => (
                <Tag key={skill.name}>
                    {skill.name} - {skill.level}
                </Tag>
            ))}
        </Stack>
    </Box>
);
