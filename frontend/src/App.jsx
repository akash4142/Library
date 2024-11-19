import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import HomePage from "./pages/Homepage";
import CreateBook from "./pages/CreateBook";
import Navbar from "./components/Navbar";
import NewUser from "./pages/newUser";
import LogIn from "./pages/LogIn";
import { useUserStore } from "./store.js/user";
import UserPage from "./pages/UserPage";
import { Navigate } from "react-router-dom";

const App = () => {
  const { role } = useUserStore();
  
  return (
    <Box minH={"100vh"}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={role === "admin" ? <HomePage /> : <UserPage />}
        />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
};

export default App;
