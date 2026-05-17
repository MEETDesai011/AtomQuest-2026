const authService = require('../services/auth.service');
const { loginSchema } = require('../validators/auth.validator');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        parsed.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    const { email, password } = parsed.data;
    const result = await authService.login(email, password);
    
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return sendError(res, 'Google credential token is required', 400);
    }

    const result = await authService.googleLogin(credential);
    return sendSuccess(res, result, 'Google login successful');
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId);
    return sendSuccess(res, { user }, 'Session verified');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login: asyncHandler(login),
  googleLogin: asyncHandler(googleLogin),
  getMe: asyncHandler(getMe)
};
