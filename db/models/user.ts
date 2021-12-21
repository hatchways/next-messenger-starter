import Sequelize, { Model, Optional } from 'sequelize';
import db from '../db';
import crypto from 'crypto';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  photoUrl: string;
  password: string;
  salt: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  completedOnboarding?: boolean;
  receiveNotifications?: boolean;
  receiveUpdates?: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'salt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public username!: string;
  public email!: string;
  public photoUrl!: string;
  public password!: string;
  public salt!: string;
  public firstName!: string;
  public lastName!: string;
  public country!: string;
  public bio!: string;
  public completedOnboarding!: boolean;
  public receiveNotifications!: boolean;
  public receiveUpdates!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static createSalt(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  public static encryptPassword(plainPassword: string, salt: string): string {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainPassword)
      .update(salt)
      .digest('hex');
  }

  public correctPassword(password: string) {
    return User.encryptPassword(password, this.salt) === this.password;
  }
}

const setSaltAndPassword = (user: User): void => {
  if (user.changed('password')) {
    user.salt = User.createSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
};

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    photoUrl: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        min: 6,
      },
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    completedOnboarding: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    receiveNotifications: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    receiveUpdates: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: 'user',
    sequelize: db,
  }
);

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});

export default User;
