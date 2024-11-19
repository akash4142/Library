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
import { Navigate, useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [logInUser, setLogInUser] = useState({
    userEmail: "",
    userPassword: "",
  });

  const toast = useToast();
  const { funLogIn } = useUserStore();

  const handlelogIn = async () => {
    const { success, message } = await funLogIn(logInUser);
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

      navigate("/");
      setLogInUser({ userEmail: "", userPassword: "" });
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>
          LogIn
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
              placeholder="User Email"
              name="userEmail"
              value={logInUser.userEmail}
              onChange={(e) =>
                setLogInUser({ ...logInUser, userEmail: e.target.value })
              }
            ></Input>
            <Input
              placeholder="User Password"
              name="userPassword"
              value={logInUser.userPassword}
              onChange={(e) =>
                setLogInUser({ ...logInUser, userPassword: e.target.value })
              }
            ></Input>

            <Button colorScheme="blue" onClick={handlelogIn} w="full">
              Submit
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default LogIn;
