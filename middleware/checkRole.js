const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      const error = new Error('Forbidden - Admin access required');
      error.statusCode = 403;
      throw error;
    }
    next();
  };
  
module.exports = isAdmin;
  