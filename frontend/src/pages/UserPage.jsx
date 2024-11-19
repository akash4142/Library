import React, { useEffect, useState } from "react";
import UserHome from "../components/UserHome";
import { useBookStore } from "../store.js/book";
import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";

const UserPage = () => {
  const { fetchBook, books, filteredBooks, setFilteredBooks } = useBookStore();

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const displayBooks = filteredBooks.length > 0 ? filteredBooks : books;
  return (
    <Container maxW={"container.xl"} py={12}>
      <VStack spacing={8}>
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

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 4,
          }}
          spacing={6}
          w={"full"}
          alignItems="stretch"
        >
          
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => <UserHome key={book._id} book={book} />)
          ) : (
            <Text>No books available.</Text>
          )}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default UserPage;
