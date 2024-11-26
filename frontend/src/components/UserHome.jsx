import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Image, Button, HStack, useToast } from "@chakra-ui/react";
import { useUserStore } from "../store.js/user";
import { useBookStore } from "../store.js/book";

const UserHome = ({ book }) => {
  const [availableCopies, setAvailableCopies] = useState(book.availableCopies);
  const [isHovered, setIsHovered] = useState(false); 
  const { issueBook, returnBook,fetchIssuedBook } = useBookStore();
  const { users } = useUserStore();
  const currentUser = users.length > 0 ? users[0] : null;
  const isLoggedIn = users.length > 0;
  const toast = useToast();
  const [isBookIssued,setIsBookIssued] = useState(false);
  

  useEffect(() => {
    if (currentUser && book) {
      const fetchBooks = async () => {
        const issuedBooks = await fetchIssuedBook(currentUser._id);
        const hasIssued = issuedBooks && issuedBooks.some((issuedBook)=>issuedBook.bookTitle===book.bookTitle);
        setIsBookIssued(hasIssued); 
      };
      fetchBooks();
    }
  }, [currentUser, book, fetchIssuedBook]); 
  

  const handleIssueBook = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to issue a book.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if(isBookIssued){
      toast({
        title:"Already Issued",
        description:"You have already issued this book",
        status:"info",
        duration:3000,
        isClosable:true,
      })
    }

    const { success, message } = await issueBook(currentUser._id, book._id);
    if (success) {
      setAvailableCopies((prev) => prev - 1);
      setIsBookIssued(true);
    }
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReturnBook = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to return a book.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await returnBook(currentUser._id, book._id);
    if (success) {
      setAvailableCopies((prev) => prev + 1);
      setIsBookIssued(false);
    }
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{ transform: "translateY(-8px)", boxShadow: "xl" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {isHovered && (
          <VStack spacing={3} mt={2} align="start" bg="gray.50" p={4} borderRadius="8px" boxShadow="sm">
            <Text fontSize="sm" textColor="blue.900">
              <strong>Description:</strong> {book.bookDesc}
            </Text>
            <Text fontSize="sm" textColor="blue.900">
              <strong>Genre:</strong> {book.bookGenre}
            </Text>
            <Text fontSize="sm" textColor="blue.900">
              <strong>Available Copies:</strong> {availableCopies}
            </Text>
            {isLoggedIn && (
              <HStack spacing={4} mt={4} align="stretch">
                {!isBookIssued&&(
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={handleIssueBook}
                  isDisabled={availableCopies <= 0}
                  fontWeight="medium"
                  _hover={{ bg: "green.500" }}
                >
                  Issue Book
                </Button>
                )}
                {isBookIssued&&(
                <Button
                  colorScheme="orange"
                  size="sm"
                  onClick={handleReturnBook}
                  fontWeight="medium"
                  _hover={{ bg: "orange.500" }}
                >
                  Return Book
                </Button>
                )}
              </HStack>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default UserHome;
