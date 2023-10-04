import { asyncHandler } from 'libs/middleware';

const logic = async (req, res) => {
  // remove cookie
  res.clearCookie('token');

  // TODO: delete refresh token from db

  res.status(200).json({ success: true });
};

export default asyncHandler(logic);
