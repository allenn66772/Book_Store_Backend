const jwt = require("jsonwebtoken")

const adminjwtMiddleware = (req, res, next) => {
    console.log("Inside admin JWT Middleware");
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);

    try {
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail //payload is a name give by us ,  usermail 
        req.role = jwtResponse.role
        if (jwtResponse.role == "admin") {
            next()
        } else {
            res.status(401).json("Unauthorized used", err)

        }
        // console.log(req.payload);
    }
    catch (err) {
        res.status(401).json("Invalid Token", err)
    }
}
module.exports = adminjwtMiddleware