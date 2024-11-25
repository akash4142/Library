import React, { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Button,
  Text,
  HStack,
  useColorMode,
  useColorModeValue,
  Input,
  Box,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CiSquarePlus, CiCloudMoon, CiSun, CiSearch } from "react-icons/ci";
import { useUserStore } from "../store.js/user";
import { useBookStore } from "../store.js/book";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { users, role, funLogOut } = useUserStore();
  const { books, setFilteredBooks } = useBookStore();
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = users.length > 0; // Check if a user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    console.log("current Role :", role);
  }, [role]);

  const handleLogout = async () => {
    await funLogOut();
    navigate("/logIn");
  };

  const handleSearch = (query = "") => {
    const lowerQuery = query.toLowerCase();
    const filteredBooks = books.filter(
      (book) =>
        book.bookTitle.toLowerCase().includes(lowerQuery) ||
        book.bookAuthor.toLowerCase().includes(lowerQuery) ||
        book.bookGenre.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(filteredBooks);
  };

  return (
    <Container maxW={""} px={4} bg={useColorModeValue("gray.100", "gray.900")}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r,orange.400,red.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>Library Management </Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
          <Input
            placeholder="Search books, authors, or genres"
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              handleSearch(query);
            }}
          />
          <CiSearch onClick={() => handleSearch(searchQuery)} />
        </HStack>

        <HStack spacing={4} alignItems={"center"}>
          {!isLoggedIn && (
            <>
              <Link to={"/newUser"}>
                <Button>Create Account</Button>
              </Link>
              <Link to={"/logIn"}>
                <Button>Log In</Button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <Flex alignItems="center" gap={2}>
              <Text fontSize="md" fontWeight="bold" color="teal.500">
                Welcome, {users[0]?.userName || "User"}!
              </Text>
              <Button onClick={handleLogout} colorScheme="red" size="sm">
                Log Out
              </Button>
            </Flex>
          )}

          {role === "admin" && (
            <Link to={"/create"}>
              <Button>
                <CiSquarePlus />
              </Button>
            </Link>
          )}

          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <CiCloudMoon /> : <CiSun size="20" />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
