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
