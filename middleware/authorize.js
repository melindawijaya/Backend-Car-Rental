const { Users } = require ("../models"); 

module.exports = async (req, res, next) => {
    try {
      if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        next();
      } else {
        res.status(403).json({ 
          status: "Failed",
          message: "Unauthorized",
          isSuccess: false,
          data: null 
        });
      }    
    } catch (error) {
        return res.status(500).json({
            status: "Failed",
            message: error.message,
            isSuccess: false,
            data: null
        });
    }
};