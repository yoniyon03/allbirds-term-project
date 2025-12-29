
export function ensureAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  req.userId = req.session.user.id;
  next();
}
export function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  next();
}
