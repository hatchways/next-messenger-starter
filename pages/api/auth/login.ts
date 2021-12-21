import { User } from '../../../db/models';
import { SESSION_SECRET } from '../../../env';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

interface Response extends User {
  dataValues: User;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  try {
    // expects username and password in req.body
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = (await User.findOne({
      where: {
        username: req.body.username,
      },
    })) as Response;

    if (!user) {
      console.error(`No user found for username: ${username}`);
      res.status(401).json({ error: 'Wrong username and/or password' });
    } else if (!user.correctPassword(password)) {
      console.error('Wrong username and/or password');
      res.status(401).json({ error: 'Wrong username and/or password' });
    } else {
      const token = jwt.sign({ id: user.dataValues.id }, SESSION_SECRET, {
        expiresIn: 86400,
      });
      res.status(200).json({
        ...user.dataValues,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

export default handler;
