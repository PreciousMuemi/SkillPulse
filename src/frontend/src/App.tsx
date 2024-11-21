import React, { useState, useEffect } from 'react';
import { useCanister } from '@connect2ic/react';
import { 
  ChakraProvider, 
  Box, 
  Container,
  VStack,
  Heading,
  useToast
} from '@chakra-ui/react';

import { MentorList } from './components/MentorList';
import { SkillSearch } from './components/SkillSearch';
import { Pagination } from './components/Pagination';
import { LoadingState } from './components/LoadingState';

const PAGE_SIZE = 10;

export function App() {
  const [backend] = useCanister("backend");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const handleSkillSearch = async (skills: string[]) => {
    try {
      setLoading(true);
      const response = await backend.requestMentorMatch(
        "user123", // Replace with actual user ID
        skills,
        { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }
      );
      
      if (response.ok) {
        setMentors(response.ok.recommended_mentors);
      } else {
        throw new Error(response.err);
      }
    } catch (error) {
      toast({
        title: 'Error fetching mentors',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>SkillNet Mentor Matching</Heading>
          
          <SkillSearch onSearch={handleSkillSearch} />
          
          {loading ? (
            <LoadingState />
          ) : (
            <>
              <MentorList mentors={mentors} />
              <Pagination 
                currentPage={page}
                onPageChange={setPage}
                totalItems={mentors.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
