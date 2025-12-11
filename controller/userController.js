const users = require("../model/userModel")
const jwt = require('jsonwebtoken')

exports.registerController = async (req, res) => {
    console.log(`inside register controller`);
    const { username, email, password } = req.body
    console.log(username, email, password);

    // console.log(req);
    // res.status(200).send("Register Request Received")

    //logic
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(404).json(`User already exists...Please login!!`)
        } else {
            const newUser = new users({
                username,//username:username it has same name so we take username only
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch (error) {
        res.status(500).json(error)
    }

}
exports.loginController = async (req, res) => {
    console.log(`inside login controller`);
    const { email, password } = req.body
    console.log(email, password);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey) //token generate to usermail
                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json(`Invalid Credentials!!`)

            }
        } else {
            res.status(404).json(`User Not Found...Please Register`)
        }

    } catch (error) {
        res.status(500).json(error)

    }
}
//google login
exports.googleLoginController = async (req, res) => {
    console.log(`inside google login controller`);
    const { email, password, username, profile } = req.body
    console.log(email, password, username, profile);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey) //token generate to usermail
            res.status(200).json({ existingUser, token })
        } else {
            const newUser = new users({
                username, email, password, profile
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email, role: existingUser.role }, process.env.JWTSecretKey) //token generate to usermail
            res.status(200).json({ existingUser: newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
//update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log(`inside update user profile controller`);
    //get data
    const { username, password, bio, role, profile } = req.body
    const email = req.payload
    console.log(username, password, bio, role, profile);

    const updateProfile = req.file ? req.file.filename : profile
    console.log(updateProfile);

    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, email, password, profile: updateProfile, bio, role }, { new: true })
        res.status(200).json(updateUser)
    }
    catch (error) {
        res.status(500).json(error)
    }


}
//get all users in admin
exports.getAllUsersAdminController = async (req, res) => {
    console.log(`inside get all users in admin controller`);

    const userMail = req.payload
    try {
        const allUsers = await users.find({ email: { $ne: userMail } })
        res.status(200).json(allUsers)

    }
    catch (error) {
        res.status(500).json(error)
    }

}
//update admin profile
exports.updateAdminProfileController = async (req, res) => {
    console.log(`inside update admin profile controller`);
    //get data
    const { username, password, profile } = req.body
    const email = req.payload
    const role = req.role
    console.log(username, password, role);

    const updateProfile = req.file ? req.file.filename : profile
    console.log(updateProfile);

    try {
        const updateAdmin = await users.findOneAndUpdate({ email }, { username, email, password, profile: updateProfile, role }, { new: true })
        res.status(200).json(updateAdmin)
    }
    catch (error) {
        res.status(500).json(error)
    }


}