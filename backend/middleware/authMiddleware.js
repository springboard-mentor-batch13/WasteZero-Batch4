import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req,res,next)=>{
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select('-password');

            if(!req.user){
                return res.status(401).json({ message: 'User no longer exists' });
            }
            next();
        }
        catch(error){
            return res.status(401).json({message: 'Not authorized — no token provided'});
        }
    }

    if(!token){
        return res.status(401).json({ message: 'Not authorized — no token provided' });
    }
}

// admin — allows only users with role === 'admin'
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied — Admin only',
    });
  }
};

// ngoOrAdmin — allows NGO users or admins
const ngoOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ngo' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied — NGO or Admin only',
    });
  }
};

// volunteerOnly — allows only volunteers
const volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied — Volunteers only',
    });
  }
};

export { protect, admin, ngoOrAdmin, volunteerOnly };