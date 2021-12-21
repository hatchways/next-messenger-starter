import { User } from '../../../db/models';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_SECRET } from '../../../env';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  interface Response extends User {
    dataValues: User;
  }

  try {
    // expects {username, email, password} in req.body
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: 'Username, password, and email required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    const user = (await User.create(req.body)) as Response;

    const token = jwt.sign({ id: user.dataValues.id }, SESSION_SECRET, {
      expiresIn: 86400,
    });
    res.json({
      ...user.dataValues,
      token,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(401).json({ error: 'User already exists' });
      } else if (error.name === 'SequelizeValidationError') {
        return res.status(401).json({ error: 'Validation error' });
      }
    }

    res.status(500).json({ error });
  }
}

export default handler;
