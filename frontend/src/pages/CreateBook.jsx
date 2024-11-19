import { Box,Button,Container,useColorModeValue,Input,Heading, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from "react";
import { useBookStore } from '../store.js/book';
import {useNavigate} from "react-router-dom"

const CreateBook = () => {
  const [newBook,setNewBook] = useState({
    bookId:"",
    bookTitle:"",
    bookAuthor:"",
    bookGenre:"",
    bookDesc:"",
    image:"",
    availableCopies:""
  })

  const toast = useToast()
  const {createBook} = useBookStore()
  const navigate = useNavigate();

  const handleAddBook =async()=>{
    const {success,message} = await createBook(newBook,navigate)
    if(!success){
      toast({
        title:"Error",
        description:message,
        status:"error",
        isClosable:true
      })
    }else{
      toast({
        title:"Success",
        description:message,
        status:"success",
        isClosable:true
      })
    }
    setNewBook({bookId:"",bookTitle:"",bookAuthor:"",bookGenre:"",bookDesc:"",availableCopies:""});
  };
  return (
    <Container maxW={"container.sm"}>
      <VStack
        spacing={8}
        >
          <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>Create New Book</Heading>

          <Box
          w={"full"} bg={useColorModeValue("white","gray.800")}
          p={6} rounded={"lg"} shadow={"md"}
          >

          <VStack spacing={4}>
          <Input
          placeholder='book Id'
          name="bookId"
          value={newBook.bookId}
          onChange={(e)=>setNewBook({...newBook,bookId:e.target.value})}></Input>
          <Input
          placeholder='book Title'
          name="bookTitle"
          value={newBook.bookTitle}
          onChange={(e)=>setNewBook({...newBook,bookTitle:e.target.value})}></Input>
          <Input
          placeholder='book Author'
          name="bookAuthor"
          value={newBook.bookAuthor}
          onChange={(e)=>setNewBook({...newBook,bookAuthor:e.target.value})}></Input>
          <Input
          placeholder='book Genre'
          name="bookGenre"
          value={newBook.bookGenre}
          onChange={(e)=>setNewBook({...newBook,bookGenre:e.target.value})}></Input>
          <Input
          placeholder='book Description'
          name="bookDesc"
          value={newBook.bookDesc}
          onChange={(e)=>setNewBook({...newBook,bookDesc:e.target.value})}></Input>
          <Input
          placeholder='book Image'
          name="image"
          value={newBook.image}
          onChange={(e)=>setNewBook({...newBook,image:e.target.value})}></Input>
          <Input
          placeholder='available copies'
          name="availableCopies"
          value={newBook.availableCopies}
          onChange={(e)=>setNewBook({...newBook,availableCopies:e.target.value})}></Input>

          <Button colorScheme="blue" onClick={handleAddBook} w='full'>Submit</Button>

          </VStack>


          </Box>

      </VStack>
    </Container>
  );
};

export default CreateBook;
