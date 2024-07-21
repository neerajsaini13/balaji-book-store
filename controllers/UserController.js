const User = require("../models/User");
const bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")

module.exports.signupController = async (req, res) => {
    let { username, email, password, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user = new User({ username, email, password: hashedPassword, address });
        await user.save()
        return res.status(201).json({ message: "Sign-up Successfully...", user })
    } else {
        return res.status(200).json({ message: "User already registred" })
    }
}




// LOGIN 
module.exports.loginController = async (req, res) => {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email && email && isMatch) {
            // genrate token 
            const authClaims = [
                { id: user._id },
                { role: user.role },
            ]
            const token = Jwt.sign({ authClaims }, process.env.SECRET_KEY, { expiresIn: '30d' });
            return res.status(200).json({ message: "Login Successful", id: user._id, role: user.role, token: token });
        } else {
            return res.status(400).json({ message: "Invalid details" })
        }
    } else {
        return res.status(400).json({ message: "User Not Found" })
    }
}