import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as skillnetIdlFactory } from '../../../declarations/skillnet_backend/skillnet_backend.did.js';

const agent = new HttpAgent();
const skillnetActor = Actor.createActor(skillnetIdlFactory, { agent, canisterId: process.env.CANISTER_ID });

export async function listCourses() {
  try {
    return await skillnetActor.listCourses();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourse(courseId) {
  try {
    return await skillnetActor.getCourse(courseId);
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

export async function enrollInCourse(courseId) {
  try {
    return await skillnetActor.enrollInCourse(courseId);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    return await skillnetActor.getUser();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getUserNFTs() {
  try {
    return await skillnetActor.getUserNFTs();
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw error;
  }
}

export async function becomeMentor() {
  try {
    return await skillnetActor.becomeMentor();
  } catch (error) {
    console.error('Error becoming mentor:', error);
    throw error;
  }
}

export async function requestMentor() {
  try {
    return await skillnetActor.requestMentor();
  } catch (error) {
    console.error('Error requesting mentor:', error);
    throw error;
  }
}

export async function getLeaderboard() {
  try {
    return await skillnetActor.getLeaderboard();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

export async function getUserProgress(courseId) {
  try {
    return await skillnetActor.getUserProgress(courseId);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}




export async function matchMentor(menteeId, desiredSkills) {
  try {
    const response = await fetch('/match_mentor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentee_id: menteeId,
        desired_skills: desiredSkills
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error matching mentor:', error);
    throw error;
  }
}

export async function getUserMentorStatus(userId) {
  try {
    const response = await fetch('/user_mentor_status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching mentor status:', error);
    throw error;
  }
}
export const requestMentorMatch = async (menteeId, skills) => {
    try {
        const response = await window.ic.plug.call(
            'skillnet_backend',
            'requestMentorMatch',
            { menteeId, skills }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to fetch mentor matches');
    }
};

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

            <Text fontSize="sm" color="gray.600">
              {mentor.bio}
            </Text>

            <HStack wrap="wrap">
              {mentor.skills.map((skill) => (
                <Badge key={skill} colorScheme="blue">
                  {skill}
                </Badge>
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

import React, { useState } from 'react';
import {
  Input,
  Button,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Box
} from '@chakra-ui/react';

export const SkillSearch = ({ onSearch }) => {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');

  const handleAddSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      setSkills([...skills, input.trim()]);
      setInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Box w="full">
      <HStack mb={4}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter skills..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
        />
        <Button onClick={() => onSearch(skills)}>
          Search Mentors
        </Button>
      </HStack>

      <HStack spacing={2} wrap="wrap">
        {skills.map((skill) => (
          <Tag key={skill} size="md" borderRadius="full" variant="solid">
            <TagLabel>{skill}</TagLabel>
            <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
          </Tag>
        ))}
      </HStack>
    </Box>
  );
};
