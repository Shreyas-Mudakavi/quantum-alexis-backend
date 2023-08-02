const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');

// Middleware to authenticate the user using JWT token
exports.auth = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return next(new ErrorHandler('Invalid token format', 401));
    }

  try {
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // userObject 
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid token', 401));
  }
};


exports.isAdmin=async(req,res,next)=>{

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("+password");
    
        if (!user)
          return next(new ErrorHandler("Invalid token. User not found.", 401));
    
        if (user.role !== "admin")
          return next(new ErrorHandler("Restricted.", 401));
    
        req.user = user;
        next();
        
      } catch (error) {
        return next(new ErrorHandler("Unauthorized.", 401));
      }

}


