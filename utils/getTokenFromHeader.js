export const getTokenFromHeader = (req) => {
  //  Get token from headers
  const token = req?.headers?.authorization?.split(" ")[1];
  if (token === undefined) {
    return 'Token not found on the header'
  }else{
    return token
  }
};
