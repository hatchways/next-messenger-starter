import { User, Conversation, Message } from '../../../db/models';
import { Op } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import { CustomRequest } from '../../../types';

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
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
      return res.status(401).json({ error: 'unauthorized user' });
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ['id'],
      order: [['messages', 'createdAt', 'DESC']],
      include: [
        { model: Message, as: 'messages', order: ['createdAt', 'DESC'] },
        {
          model: User,
          as: 'user1',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
        {
          model: User,
          as: 'user2',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
      ],
    });

    type convoJSON = {
      id: number;
      messages?: Message[];
      user1?: {
        id: number;
        username: string;
        photoUrl: string;
      };
      user2?: {
        id: number;
        username: string;
        photoUrl: string;
      };
      otherUser?: {
        id: number;
        username: string;
        photoUrl: string;
        online?: boolean;
      };
      latestMessageText?: string;
    };

    const resJSON: convoJSON[] = new Array(conversations.length);

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON: convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (convoJSON.otherUser) {
        // TODO: set convoJSON.otherUser.online
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText =
        convoJSON.messages && convoJSON.messages[0].text;
      resJSON[i] = convoJSON;
    }

    res.json(resJSON);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

export default handler;
