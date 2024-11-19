import React, { useState } from "react";
import { Box, Heading, Text, VStack ,Image} from "@chakra-ui/react";

const UserHome = ({ book }) => {

  const [isHovered, setIsHovered] = useState(false); // State to track hover status

  return (
    <Box
  shadow="lg"
  rounded="lg"
  overflow="hidden"
  transition="all 0.3s ease"
  _hover={{ transform: "translateY(-8px)", boxShadow: "xl" }}
  onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
  onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
>
  <Box p={4}>
    <Image
      src={book.image}
      alt={book.bookTitle}
      objectFit="cover"
      height="200px"
      width="100%"
      borderTopRadius="8px"
      mb={4}
    />
    <Heading as="h3" size="lg" fontWeight="bold" mb={2} color="teal.600">
      {book.bookTitle}
    </Heading>
    <Heading as="h4" size="md" fontWeight="medium" mb={4} color="gray.600">
      {book.bookAuthor}
    </Heading>

    {/* Show additional info on hover */}
    {isHovered && (
      <VStack spacing={3} mt={2} align="start" bg="gray.50" p={4} borderRadius="8px" boxShadow="sm">
        <Text fontSize="sm">
          <strong>Description:</strong> {book.bookDesc}
        </Text>
        <Text fontSize="sm">
          <strong>Genre:</strong> {book.bookGenre}
        </Text>
        <Text fontSize="sm">
          <strong>Available Copies:</strong> {book.availableCopies}
        </Text>
      </VStack>
    )}
  </Box>
</Box>

  );
};

export default UserHome;
