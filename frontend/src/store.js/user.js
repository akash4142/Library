import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  role: sessionStorage.getItem("role") || "",
  setUsers: (users, role) => {
    sessionStorage.setItem("role", role);
    set({ users, role });
  },
  registerNewUser: async (newUser) => {
    if (
      !newUser.userId ||
      !newUser.userName ||
      !newUser.userEmail ||
      !newUser.userPassword
    ) {
      return { success: false, message: "Please fill all the fields." };
    }
    const res = await fetch("/api/user/createUser", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) {
      return { success: false, message: "Failed to register user." };
    }
    const data = await res.json();

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "Your account is registered with us ." };
  },
  funLogIn: async (user) => {
    if (!user.userEmail || !user.userPassword) {
      return { success: false, message: "Email and password are required" };
    }

    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
      credentials:"include",
    })
    if (!res.ok) {
      console.error("Failed to log in, status:", res.status);
      return { success: false, message: "Login failed" };
    }
    const data = await res.json();

    
    if (data.role) {
      set((state) => ({ users: [...state.users, data.data], role: data.role }));

    } else {
      console.warn("Role not found in server response.");
    }
    return { success: true, message: "LogIn successfully" };
    
  },
  funLogOut: async () => {
    try {
      const res = await fetch("/api/user/logOut", {
        method: "POST", // Typically, logout is a POST request
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.removeItem("role");
        set({ users: [], role: "" });
      } else {
        // Handle error
        console.log("Server error");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  },
}));
