const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token requis' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Admin non trouvé' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Non autorisé' });
  }
};