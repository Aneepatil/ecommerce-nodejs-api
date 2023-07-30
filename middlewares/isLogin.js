import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLogin = (req, res, next) => {
  // Get token from header
  const token = getTokenFromHeader(req);
  // verify token
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    throw new Error("Invalid / Expired token, please login again");
  } else {
    // Save the user into req object
    req.userAuthId = decodedUser?.id;
    next()
  }
};
