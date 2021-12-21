import Sequelize, { Model, Optional } from 'sequelize';
import db from '../db';

interface MessageAttributes {
  id: number;
  text: string;
  senderId: number;
  conversationId: number;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> {
  public id!: number;
  public text!: string;
  public senderId!: number;
  public conversationId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    conversationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'message',
    sequelize: db,
  }
);

export default Message;
