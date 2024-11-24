import React from 'react';
import {
    SimpleGrid,
    Box,
    Text,
    Badge,
    Avatar,
    VStack,
    HStack,
    Button,
    Stack,
    Tag,
    Heading
} from '@chakra-ui/react';

export const MentorList = ({ mentors }) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {mentors.map((mentor) => (
                <Box
                    key={mentor.userId.toString()}
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="sm"
                >
                    <VStack align="start" spacing={4}>
                        <HStack>
                            <Avatar size="lg" />
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">
                                    {mentor.userId.toString().slice(0, 8)}...
                                </Text>
                                <Badge colorScheme="green">
                                    {mentor.experience_years} years experience
                                </Badge>
                            </VStack>
                        </HStack>
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

export const MentorCard = ({ mentor }) => (
    <Box p={5} shadow="md" borderWidth="1px">
        <Heading size="md">{mentor.userId.toString().slice(0, 8)}...</Heading>
        <Text>Experience: {mentor.experience_years} years</Text>
        <Text>Rating: {mentor.rating}/5</Text>
        <Text>Availability: {mentor.availability.join(", ")}</Text>
        <Text>Timezone: {mentor.timezone}</Text>
        <Stack direction="row" wrap="wrap">
            {mentor.skills.map(skill => (
                <Tag key={skill}>
                    {skill}
                </Tag>
            ))}
        </Stack>
    </Box>
);