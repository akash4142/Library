import React from "react";
import { useBookStore } from "../store.js/book";
import { Container, VStack, Text, SimpleGrid, Box } from "@chakra-ui/react";
import BookCard from "../components/BookCard";

const Homepage = () => {
  const { books, filteredBooks } = useBookStore();
  const displayBooks = filteredBooks.length > 0 ? filteredBooks : books;

  return (
    <Container maxW={"container.xl"} py={8}>
      <VStack spacing={6} align="center">
        {/* Title Section */}
        <Text
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontWeight={"bold"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
          textAlign={"center"}
          letterSpacing="wider"
          mb={4}
          textShadow="1px 1px 3px rgba(0, 0, 0, 0.2)"
        >
          Find Your Favourite Book
        </Text>

        {/* Book Cards Grid */}
        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
            lg: 4,
          }}
          spacing={6}
          w={"full"}
          alignItems="stretch"
        >
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => (
              <Box
                key={book._id}
                overflow="hidden"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                  transition: "0.3s ease",
                }}
                w="100%" // Ensure it takes up available space correctly
                maxW="320px" // Restrict the max width for the card container
                margin="0 auto" // Center the card horizontally within its grid column
              >
                <BookCard book={book} />
              </Box>
            ))
          ) : (
            <Text
              fontSize="md"
              color="gray.500"
              textAlign="center"
              colSpan={3}
              p={4}
            >
              No books available.
            </Text>
          )}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Homepage;
