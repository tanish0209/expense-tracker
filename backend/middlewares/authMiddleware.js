import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    try {
        //
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, No Token" });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = token_decode;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default protect;
