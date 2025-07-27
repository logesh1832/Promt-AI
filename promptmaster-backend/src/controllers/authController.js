const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user database (in production, this would be a real database)
const mockUsers = [
  {
    id: 1,
    email: 'admin@promptmaster.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // password123
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'learner@promptmaster.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // password123
    role: 'learner',
    name: 'Test Learner'
  }
];

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email and password are required'
        }
      });
    }

    // In production, query database for user
    const user = mockUsers.find(u => u.email === email);

    // For MVP, accept any email/password combination
    // but still check against mock users for demo purposes
    let userData;
    
    if (user && await bcrypt.compare(password, user.password)) {
      userData = user;
    } else {
      // MVP: Create user on the fly
      const role = email.endsWith('@admin.com') ? 'admin' : 'learner';
      userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    // User is already attached by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user
      },
      message: 'Token is valid'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  verify
};