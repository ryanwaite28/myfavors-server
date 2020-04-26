import {
  Users,
  Tokens
} from '../models';
import {
  fn,
  Op
} from 'sequelize';
import {
  IRequest,
  IResponse,
  IUserModel
} from '../interfaces/all.interface';

export async function get_random_users(
  limit: number
) {
  const users = await Users.findAll({
    limit,
    order: [fn( 'RANDOM' )],
    attributes: [
      'id',
      'displayname',
      'username',
      'icon_link',
      'uuid',
      'createdAt',
      'updatedAt',
    ]
  });
  return users;
}

export async function get_user_by_email(
  email: string
) {
  const userModel = await Users.findOne({
    where: { email }
  });
  let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
  delete user.password;
  return user;
}

export async function get_user_by_username(
  username: string
) {
  const userModel = await Users.findOne({
    where: { username }
  });
  let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
  delete user.password;
  return user;
}

export async function get_user_by_email_or_username(
  query: string
) {
  const userModel = await Users.findOne({
    where: { 
      [Op.or]: [
        { email: query },
        { username: query }
      ]
    }
  });
  let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
  delete user.password;
  return user;
}

export async function get_user_by_id(
  id: number
) {
  const userModel = await Users.findOne({
    where: { id }
  });
  let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
  delete user.password;
  return user;
}