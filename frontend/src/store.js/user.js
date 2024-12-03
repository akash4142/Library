import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  role: sessionStorage.getItem("role") || "",
  notifications:[],
  setUsers: (users, role) => {
    sessionStorage.setItem("role", role);
    set({ users, role });
  },
  setNotifications:(notifications)=>set({notifications}),
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
  removeOldNotifications:async (pid)=>{
    try{
      const res= await fetch(`/api/user/${pid}/deleteOldNotifications`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({id:pid}),
      });
    const data = await res.json();

    if(res.ok){
      set((state)=>({
        notifications: state.notifications.filter(
          (notification)=>
            new Date(notification.timestamp)>=
          new Date(Date.now()-12*60*1000)
        ),
      }));
      console.log(`Successfully removed old notifications for user ${pid}`);
      return {success:true,message:data.message};
    }else{
      console.error("Failed to remove notifications ",data.message);
      return {success:false,message:data.message}
    }
  }catch(error){
    console.error("Error removing old notificatiosn : ",error);
    return {success:false,message:"An error occurred"};
  }
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
      set((state) => ({ users: [...state.users, data.data], role: data.role,notifications:data.notifications||[] }));
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
        set({ users: [], role: "" ,notifications:[]});
      } else {
        // Handle error
        console.log("Server error");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  },
  getNotifications: async(pid)=>{
    try{
      const res = await fetch(`api/user/${pid}`);
      const data = await res.json();
      if(data.success){
        set((state)=> ({notifications:data.data || []}));
      }else{
        console.error("Failed to fecth notifications",data.message);
      }
    }catch(error){
      console.error("Error fetching notifications: ",error);
    }
  },
  markNotificationAsRead: async (userId, notificationId) => {
    try {
      const res = await fetch(`/api/user/${userId}/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await res.json();
  
      if (data.success) {
        if (data.message === "Notification deleted successfully") {
          // If the notification was deleted
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification._id !== notificationId
            ),
          }));
        } else if (data.message === "Notification marked as read") {
          // If the notification was marked as read
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
          }));
        }
      } else {
        console.error("Failed to mark notification as read ", data.message);
      }
    } catch (error) {
      console.error("Error marking notification as read: ", error);
    }
  },
  
}));
