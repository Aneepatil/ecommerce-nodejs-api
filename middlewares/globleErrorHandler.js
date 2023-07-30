export const globleErrorHandler = (err, req, res, next) => {
  // Stack
  // Message
  const stack = err?.stack;
  const message = err?.message;
  const statusCode = err?.statusCode ? err?.statusCode : 500;

  res.status(statusCode).json({ stack, message });
};


// 404 Handler

export const notFound = (req,res,next)=>{
    const err = new Error(`Rooute ${req.originalUrl} not found`)
    next(err)
}