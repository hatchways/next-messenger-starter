import Conversation from './conversation';
import User from './user';
import Message from './message';

// associations

User.hasMany(Conversation, { sourceKey: 'id' });
Conversation.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'user1Id',
  as: 'user1',
});
Conversation.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'user2Id',
  as: 'user2',
});
Message.belongsTo(Conversation, {
  targetKey: 'id',
  foreignKey: 'conversationId',
});
Conversation.hasMany(Message, {
  sourceKey: 'id',
  foreignKey: 'conversationId',
  as: 'messages',
});

export { User, Conversation, Message };
