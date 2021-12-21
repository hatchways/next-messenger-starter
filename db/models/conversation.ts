import Sequelize, { Op, Model, Optional, Association } from 'sequelize';
import User from './user';
import Message from './message';
import db from '../db';

interface ConversationAttributes {
  id: number;
  user1Id: number;
  user2Id: number;
}

interface ConversationCreationAttributes
  extends Optional<ConversationAttributes, 'id'> {}

class Conversation extends Model<
  ConversationAttributes,
  ConversationCreationAttributes
> {
  public id!: number;
  public user1Id!: number;
  public user2Id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user1?: User;
  public readonly user2?: User;

  public readonly messages?: Message[];

  public static associations: {
    user1: Association<Conversation, User>;
    user2: Association<Conversation, User>;

    messages: Association<Conversation, Message>;
  };

  public static async findConversation(
    user1Id: number,
    user2Id: number
  ): Promise<Conversation | null> {
    const conversation = await Conversation.findOne({
      where: {
        user1Id: {
          [Op.or]: [user1Id, user2Id],
        },
        user2Id: {
          [Op.or]: [user1Id, user2Id],
        },
      },
    });

    return conversation;
  }
}

Conversation.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user2Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'conversation',
    sequelize: db,
  }
);

export default Conversation;
