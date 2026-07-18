import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req,res,next)=>{
    let token;

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
            return res.status(401).json({message: 'Not authorized - invalid token'});
        }
    }

    else if(!token){
        return res.status(401).json({ message: 'Not authorized - no token provided' });
    }
}

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - Admin only',
    });
  }
};

const ngoOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ngo' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - NGO or Admin only',
    });
  }
};

const volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied - Volunteers only',
    });
  }
};

export { protect, admin, ngoOrAdmin, volunteerOnly };
