import jwt from "jsonwebtoken";
import { config } from "../../config.mjs";
const authenticate = (req, res, next) => {
   try {
    if(!req.headers.authorization){
        return res.status(401).send({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).send({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, config.secretMessage,(err, decoded) => {
        if(err){
            return res.status(401).send({ message: "Unauthorized" });
        }
        return decoded;
    });
    if(!decoded){
        return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
} catch (error) {
    return res.status(500).send({ message: "Internal server error" });
}
};
const authorize = (req, res, next) => {
   try {
    const { role} = req.user;
    if(role !== 'admin'){
        return res.status(403).send({ message: "Forbidden" });
    }
    next();
   } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
   }
};
export { authenticate, authorize };