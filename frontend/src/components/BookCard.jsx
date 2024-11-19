import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  useDisclosure,
  Modal,
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  ModalFooter,
  IconButton,
  Input,
  Image,
} from "@chakra-ui/react";
import { useBookStore } from "../store.js/book";
import { MdDelete, MdEdit } from "react-icons/md";

const BookCard = ({ book }) => {
  const [updatedBook, setUpdatedBook] = useState(book);
  const toast = useToast();
  const { deleteBook, updateBook } = useBookStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "250px",
        margin: "16px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      <Box
        p={4}
        bg="gray.50"
        borderRadius="12px"
        boxShadow="lg"
        _hover={{ bg: "gray.100" }}
        transition="all 0.3s ease"
      >
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
        <Heading as="h4" size="sm" fontWeight="medium" mb={4} color="gray.600">
          {book.bookAuthor}
        </Heading>
        <HStack spacing={4} justify="flex-end">
          <IconButton
            icon={<MdEdit />}
            onClick={onOpen}
            colorScheme="blue"
            aria-label="Edit Book"
            variant="outline"
            size="lg"
            borderRadius="full"
          />
          <IconButton
            icon={<MdDelete />}
            onClick={() => handleDeleteBook(book._id)}
            colorScheme="red"
            aria-label="Delete Book"
            variant="outline"
            size="lg"
            borderRadius="full"
          />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Book Name"
                name="bookTitle"
                value={updatedBook.bookTitle}
                onChange={(e) =>
                  setUpdatedBook({ ...updatedBook, bookTitle: e.target.value })
                }
              />
              <Input
                placeholder="Book Author"
                name="bookAuthor"
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
              mr={3}
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

export default BookCard;
