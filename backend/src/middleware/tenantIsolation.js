const logger = require('../utils/logger');

/**
 * Tenant Isolation Middleware
 * Enforces strict multi-tenancy at the repository layer.
 * Injects `tenantId` into the `req` object, which is then explicitly required 
 * in every single Prisma `where` clause to prevent cross-tenant data leakage.
 */

const enforceTenantIsolation = (req, res, next) => {
  // Extract tenant ID from domain, custom header, or JWT payload
  const tenantId = req.headers['x-tenant-id'] || (req.user && req.user.tenantId);

  if (!tenantId) {
    logger.error('CRITICAL: Request attempted without a valid Tenant ID isolation context.');
    return res.status(403).json({
      status: 'error',
      message: 'Strict Tenant Isolation Enforced: Missing Tenant ID context.'
    });
  }

  // Inject into request context for repository consumption
  req.tenantContext = { tenantId };
  
  next();
};

module.exports = { enforceTenantIsolation };
