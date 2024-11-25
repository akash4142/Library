import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Input,
  Image,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useBookStore } from "../store.js/book";
import { useUserStore } from "../store.js/user";

const AdminHome = ({ book }) => {
  const [updatedBook, setUpdatedBook] = useState(book);
  const [availableCopies, setAvailableCopies] = useState(book.availableCopies);
  const [isBookIssued, setIsBookIssued] = useState(false);
  const toast = useToast();
  const { deleteBook, updateBook, issueBook, returnBook } = useBookStore();
  const { users } = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = users.length > 0 ? users[0] : null;

  useEffect(() => {
    if (currentUser && currentUser.issueBook && book) {
      const hasIssued = currentUser.issueBook.includes(book._id);
      setIsBookIssued(hasIssued);
    } else {
      setIsBookIssued(false);
    }
  }, [currentUser, book]);

  const handleUpdateBook = async (pid, updatedBook) => {
    await updateBook(pid, updatedBook);
    onClose();
  };

  const handleDeleteBook = async (pid) => {
    const { success, message } = await deleteBook(pid);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

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

    if (isBookIssued) {
      toast({
        title: "Already Issued",
        description: "You have already issued this book.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
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
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg="white"
      p={4}
      mb={4}
    >
      <Image
        src={book.image}
        alt={book.bookTitle}
        objectFit="cover"
        height="200px"
        width="100%"
        borderRadius="md"
        mb={4}
      />
      <Heading as="h3" size="lg" fontWeight="bold" mb={2} color="teal.600">
        {book.bookTitle}
      </Heading>
      <Heading as="h4" size="sm" fontWeight="medium" mb={2} color="gray.600">
        {book.bookAuthor}
      </Heading>
      <Text mb={4} color="gray.500" fontSize="sm">
        Available Copies: {availableCopies}
      </Text>
      <VStack spacing={3}>
        {!isBookIssued && (
          <Button
            colorScheme="green"
            onClick={handleIssueBook}
            isDisabled={availableCopies <= 0}
          >
            Issue Book
          </Button>
        )}
        {isBookIssued && (
          <Button colorScheme="orange" onClick={handleReturnBook}>
            Return Book
          </Button>
        )}
      </VStack>
      <HStack spacing={3} justify="center" mt={4}>
        <IconButton
          icon={<MdEdit />}
          onClick={onOpen}
          colorScheme="blue"
          aria-label="Edit Book"
        />
        <IconButton
          icon={<MdDelete />}
          onClick={() => handleDeleteBook(book._id)}
          colorScheme="red"
          aria-label="Delete Book"
        />
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Book Title"
                value={updatedBook.bookTitle}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, bookTitle: e.target.value })
                }
              />
              <Input
                placeholder="Book Author"
                value={updatedBook.bookAuthor}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, bookAuthor: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => handleUpdateBook(book._id, updatedBook)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminHome;
