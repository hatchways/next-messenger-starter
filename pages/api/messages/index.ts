import { NextApiRequest, NextApiResponse } from 'next';
import { Conversation, Message } from '../../../db/models';
import { CustomRequest } from '../../../types';

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
async function handler(nextRreq: NextApiRequest, res: NextApiResponse) {
  const req = nextRreq as CustomRequest;

  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  try {
    if (!req.user) {
      return res.status(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      // TODO: set sender.online
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.status(200).json({ message, sender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

export default handler;
