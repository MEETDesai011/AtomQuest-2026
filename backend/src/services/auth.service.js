const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return generateAuthResponse(user);
}

async function googleLogin(googleToken) {
  // Verify Google token using Google's tokeninfo endpoint
  const { OAuth2Client } = require('google-auth-library');
  const GOOG_ID = process.env.GOOGLE_CLIENT_ID || '607774260786-fdocdfgjq2mvual4vi3v62ji2vs8427u.apps.googleusercontent.com';
  const client = new OAuth2Client(GOOG_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOG_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    const error = new Error('Invalid Google token');
    error.statusCode = 401;
    throw error;
  }

  const { email, name, picture, sub: googleId } = payload;

  // Find existing user or create new one
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Auto-create user from Google sign-in (default role: EMPLOYEE)
    const hash = await bcrypt.hash(googleId + process.env.JWT_SECRET, 10);
    user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        passwordHash: hash,
        role: 'EMPLOYEE',
        department: 'General',
      },
    });
  }

  return generateAuthResponse(user);
}

function generateAuthResponse(user) {
  const tokenPayload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    department: user.department,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      managerId: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = { login, googleLogin, getMe };
