import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  useColorModeValue,
  Input,
  Heading,
  VStack,
  useToast,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useUserStore } from "../store.js/user";

const NewUser = () => {
  const [newUser, setNewUser] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userPassword: "",
    role: "",
  });

  const toast = useToast();
  const { registerNewUser } = useUserStore();

  const handleAddUser = async () => {
    const { success, message } = await registerNewUser(newUser);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }
    setNewUser({
      userId: "",
      userName: "",
      userEmail: "",
      userPassword: "",
      role: "",
    });
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>
          Create New Account
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="User Id"
              name="userId"
              value={newUser.userId}
              onChange={(e) =>
                setNewUser({ ...newUser, userId: e.target.value })
              }
            ></Input>
            <Input
              placeholder="User Name"
              name="userName"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser({ ...newUser, userName: e.target.value })
              }
            ></Input>
            <Input
              placeholder="User Email"
              name="userEmail"
              value={newUser.userEmail}
              onChange={(e) =>
                setNewUser({ ...newUser, userEmail: e.target.value })
              }
            ></Input>
            <Input
              placeholder="User Password"
              name="userPassword"
              value={newUser.userPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, userPassword: e.target.value })
              }
            ></Input>
            <RadioGroup
              name="userRole"
              value={newUser.role}
              onChange={(value) =>
                setNewUser({ ...newUser, role: value.toLowerCase() })
              }
            >
              <VStack align="start">
                <Radio value="user">User</Radio>
                <Radio value="admin">Admin</Radio>
              </VStack>
            </RadioGroup>

            <Button colorScheme="blue" onClick={handleAddUser} w="full">
              Submit
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default NewUser;
