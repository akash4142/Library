import React, { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Button,
  Text,
  HStack,
  Input,
  Box,
  VStack,
  Avatar,
  Badge,
  IconButton,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CiSquarePlus, CiCloudMoon, CiSun, CiSearch, CiBellOn } from "react-icons/ci";
import { useUserStore } from "../store.js/user";
import { useBookStore } from "../store.js/book";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { users, role, funLogOut, notifications, getNotifications, markNotificationAsRead, removeOldNotifications } = useUserStore();
  const { books, setFilteredBooks } = useBookStore();
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = users.length > 0;
  const navigate = useNavigate();

  // Always call hooks, then handle conditions inside.
  useEffect(() => {
    if (isLoggedIn) {
      const userId = users[0]?._id;

      if (userId) {
        // Fetch notifications initially
        getNotifications(userId);
      }

      const intervalId = setInterval(async () => {
        const updatedNotifications = await removeOldNotifications(userId);
        if (updatedNotifications) {
          getNotifications(userId); // Refetch and update notifications
        }
      },  1* 60 * 1000); // Every 2 minutes

      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn, getNotifications, removeOldNotifications, users]);

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

  const handleNotificationOpen = () => {
    if (isLoggedIn) {
      const userId = users[0]?._id;
      notifications
        .filter((notification) => !notification.read)
        .forEach((notification) => {
          markNotificationAsRead(userId, notification._id);
        });
    }
  };

  return (
    <Container maxW={"full"} px={6} py={2} bg={useColorModeValue("gray.100", "gray.900")}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Left Section */}
        <Text
          fontSize={{ base: "22px", sm: "28px" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, orange.400, red.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>Library Management</Link>
        </Text>

        {/* Middle Section */}
        <HStack spacing={4} alignItems={"center"}>
          <Input
            placeholder="Search books, authors, or genres"
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              handleSearch(query);
            }}
            w={{ base: "100%", sm: "250px" }}
          />
          <IconButton aria-label="Search" icon={<CiSearch />} onClick={() => handleSearch(searchQuery)} />
        </HStack>

        {/* Right Section */}
        <HStack spacing={4} alignItems={"center"}>
          {!isLoggedIn ? (
            <>
              <Link to={"/newUser"}>
                <Button>Create Account</Button>
              </Link>
              <Link to={"/logIn"}>
                <Button>Log In</Button>
              </Link>
            </>
          ) : (
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

          {isLoggedIn && (
            <Menu onOpen={handleNotificationOpen}>
              <MenuButton as={Box} position="relative">
                <CiBellOn size={24} />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Badge
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    fontSize="0.7em"
                    colorScheme="red"
                    borderRadius="50%"
                  >
                    {notifications.filter((n) => !n.read).length}
                  </Badge>
                )}
              </MenuButton>
              <MenuList>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <MenuItem key={notification._id}>
                      <VStack align="start">
                        <Text>{notification.message}</Text>
                        <Text fontSize="xs">{new Date(notification.timestamp).toLocaleString()}</Text>
                      </VStack>
                    </MenuItem>
                  ))
                ) : (
                  <Text>No new notifications</Text>
                )}
              </MenuList>
            </Menu>
          )}

          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <CiCloudMoon /> : <CiSun />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
