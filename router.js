const express=require("express")
const { registerController, loginController, updateProfileController, updateUserProfileController, getAllUsersAdminController, updateAdminProfileController, googleLoginController } = require("./controller/userController")
const { addBookController, getHomeBooksController, getAllBooksController, getABookController, getUserBooks, getUserBooksController, deleteUserAddedBookController, getPurchasedBooksController, getAllBooksAdminController, updateBookController, makeBookPaymentController } = require("./controller/bookController")
const jwtMiddleware = require("./middlewares/jwtMiddleware")
const multerConfig = require("./middlewares/imgMulterMiddleware")
const adminjwtMiddleware = require("./middlewares/adminJwtMiddleware")

const router=express.Router()
//register
router.post("/register",registerController)

//login
router.post("/login",loginController)

//google login
router.post("/google-login",googleLoginController)

//get home books
router.get("/home-books",getHomeBooksController)

 //-------------------User------------
//add book
router.post("/add-book",jwtMiddleware,multerConfig.array("uploadImages",3),addBookController)
//get all books
router.get("/all-books",jwtMiddleware,getAllBooksController)

//get a book
router.get("/view-books/:id",jwtMiddleware,getABookController)

//get user books
router.get("/user-books",jwtMiddleware,getUserBooksController)

//delete user added books
router.delete("/delete-book/:id",deleteUserAddedBookController)

//get purchased book controller
router.get("/purchase-history",jwtMiddleware,getPurchasedBooksController)

//update user profile
router.put("/update-user-profile",jwtMiddleware,multerConfig.single("profile"),updateUserProfileController)

//make payment
router.put("/make-payment",jwtMiddleware,makeBookPaymentController)


//--------------------admin-------------------------
//get all books admin
router.get("/get-allbooks",getAllBooksAdminController)

//update book
router.put("/update-book/:id",updateBookController)

//get all users in admin
router.get("/get-allusers",adminjwtMiddleware,getAllUsersAdminController)

//update admin profile
router.put("/update-admin-profile",adminjwtMiddleware,multerConfig.single("profile"),updateAdminProfileController)



module.exports=router
