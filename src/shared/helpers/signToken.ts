import jwt from 'jsonwebtoken';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  });
export default signToken;
