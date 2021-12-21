import { User } from '../../../db/models';
import { Op } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import { CustomRequest } from '../../../types';

// find users by username
async function handler(nextReq: NextApiRequest, res: NextApiResponse) {
  const req = nextReq as CustomRequest;

  if (req.method !== 'GET') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  try {
    if (!req.user) {
      return res.status(401);
    }
    const username: string = req.query.username as string;

    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: username,
        },
        id: {
          [Op.not]: req.user.id,
        },
      },
    });

    type userJSON = {
      id: number;
      username: string;
      email: string;
      photoUrl: string;
      password: string;
      salt: string;
      createdAt: Date;
      updatedAt: Date;

      online?: boolean;
    };

    const resJSON: userJSON[] = new Array(users.length);

    // add online status to each user that is online
    for (let i = 0; i < users.length; i++) {
      const userJSON: userJSON = users[i].toJSON();
      // TODO: set userJSON.online
      resJSON[i] = userJSON;
    }
    res.status(200).json(resJSON);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

export default handler;
