import jwt from 'jsonwebtoken';

export const generateToken = async (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
    res.cookie("jwt", token, {
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly : true, // XSS attach
        secure : process.env.NODE_ENV === "development" ? false : true, // HTTPS attach
        sameSite : "strict" // CSRF attach
    })
    return token;
}
