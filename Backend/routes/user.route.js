import {createNewUser,login,logout,authenticateSession,getAllUsers,updateUser,deleteUser, getNotifications, markNotificationAsRead, removeOldNotifications} from "../authBooks/user.js"
import express from 'express'
const router = express.Router();

router.post("/createUser",createNewUser);
router.post("/login",login);
router.post("/logout",logout);
router.get("/allUsers",getAllUsers);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.get("/:id",getNotifications);
router.patch("/:id/:notify_id",markNotificationAsRead);
router.delete("/:id/deleteOldNotifications",removeOldNotifications);

router.get("/protected",authenticateSession,(req,res)=>{
    res.json({message:"You have access to this protected route."})
});

export default router;