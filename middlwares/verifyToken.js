import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ msg: "invalid token" });
    }
  } else {
    res.status(401).json({ msg: "no token found" });
  }
}

export function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      res.status(403).json({ msg: "you are not Authorized" });
    } else {
      next();
    }
  });
}

export function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ msg: "you are not allowed, only admin is allowed" });
    }
  });
}
