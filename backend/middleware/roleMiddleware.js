// Restrict a route to one or more roles. Must run after `protect`.
//   router.get('/admin', protect, authorize('admin'), handler);
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission for this action' });
    }
    next();
  };
