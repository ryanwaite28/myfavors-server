import * as bcrypt from 'bcrypt-nodejs';
import {
  Request,
  Response,
} from 'express';
import {
  IRequest,
  IResponse,
  IUserModel
} from '../interfaces/all.interface';
import {
  Users, Tokens
} from '../models';
import {
  fn,
  Op
} from 'sequelize';
import { send_email } from '../sendgrid-manager';
import { SignedUp_EMAIL } from '../template-engine';
import { 
  validateDisplayName,
  validateUsername,
  validateEmail,
  validatePassword,
  uniqueValue
} from '../chamber';

export class UserService {
  static async main(request: Request, response: Response) {
    return response.json({ msg: 'users router' });
  }

  static async check_session(request: Request, response: Response) {
    try {
      if ((<any> request).session.id) {
        // const get_user = await Users.findOne({ where: { id: .id } });
        const user: IUserModel = { ...(<IRequest> request).session.you };
        delete user.password;
        const session_id = (<IRequest> request).session.id;
        return response.json({ online: true, session_id, user });
      } else {
        return response.json({ online: false });
      }
    } catch (e) {
      console.log('error: ', e);
      return response.json({ e, error: true });
    }
  }

  static async get_user_by_username(request: Request, response: Response) {
    const username = request.params.username;
    const userModel = await Users.findOne({ where: { username } });
    let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
    delete user.password;
    return response.json({ user });
  }
  
  static async get_user_by_id(request: Request, response: Response) {
    const id = parseInt(request.params.id, 10);
    const userModel = await Users.findOne({ where: { id } });
    let user: IUserModel = (userModel && userModel.get({ plain: true }) || {}) as IUserModel;
    delete user.password;
    return response.json({ user });
  }
  
  static async get_random_users(request: Request, response: Response) {
    const users = await Users.findAll({
      limit: 10,
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
    return response.json({ users });
  }
  
  static async sign_out(request: Request, response: Response) {
    (<IRequest> request).session.reset();
    return response.json({ online: false, successful: true });
  }

  static async sign_up (request: Request, response: Response) {
    if ((<any> request).session.id) {
      return response.status(400).json({ error: true, message: 'Client already signed in' });
    }
  
    const displayname = request.body.displayname;
    const username = request.body.username;
    const email = request.body.email && 
      request.body.email.toLowerCase().replace(/\s/gi, '');
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    if (!displayname) {
      return response.status(400).json({
        error: true,
        message: 'Display name field is required'
      });
    }
    if (!username) {
      return response.status(400).json({
        error: true,
        message: 'Username field is required'
      });
    }
    if (!email) {
      return response.status(400).json({
        error: true,
        message: 'Email address field is required'
      });
    }
    if (!password) {
      return response.status(400).json({
        error: true,
        message: 'Password field is required'
      });
    }
    if (!confirmPassword) {
      return response.status(400).json({
        error: true,
        message: 'Confirm password field is required'
      });
    }

    if (!validateDisplayName(displayname)) {
      return response.status(400).json({
        error: true,
        message: 'Display must be letters only and at least 2 characters long.'
      });
    }
    if (!validateUsername(username)) {
      return response.status(400).json({
        error: true,
        message: 'Display must be letters only and at least 2 characters long.'
      });
    }
    if (!validateEmail(email)) {
      return response.status(400).json({
        error: true,
        message: 'Email is invalid. Check Format.'
      });
    }
    if (!validatePassword(password)) {
      return response.status(400).json({
        error: true,
        message: 'Password must be: at least 7 characters, upper and/or lower case alphanumeric'
      });
    }
    if (password !== confirmPassword) {
      return response.status(400).json({
        error: true,
        message: 'Passwords must match'
      });
    }
  
    const check_email = await Users.findOne({ where: { email } });
    if (check_email) {
      return response.status(401).json({ error: true, message: 'Email already in use' });
    }
  
    /* Data Is Valid */
  
    const hash = bcrypt.hashSync(password);
    const createInfo = { displayname, username, email, password: hash };
    const new_user = await Users.create(createInfo);
    const user = (<any> new_user).dataValues;
    (<any> request).session.id = uniqueValue();
    (<any> request).session.you = { ...user };
    (<any> request).session.youModel = new_user;
    delete user.password;

    const new_token = uniqueValue();
    const tokenCreateOptions = {
      ip_address: request.ip,
      user_agent: request.get('user-agent'),
      user_id: user.id,
      token: new_token,
      device: (<any> request).device.type
    };
    Tokens.create(tokenCreateOptions)
      .then((tokenModel) => {
        console.log(`token created`);
      })
      .catch((error) => {
        console.log(`could not create token`, error);
      });
  
    /** Email Sign up and verify */
    const host: string = request.get('origin')!;
    const uuid = user.uuid;
    const verify_link = (<string> host).endsWith('/')
      ? (host + 'verify-account/' + uuid)
      : (host + '/verify-account/' + uuid);
    const email_subject = 'My Favors - Signed Up!';
    const email_html = SignedUp_EMAIL({ ...(<IRequest> request).session.you, name: user.displayname, verify_link });
    // don't "await" for email response.
    send_email('', user.email, email_subject, email_html)
      .then(email_results => {
        console.log({ signed_up: email_results });
      }); 
  
    const responseData = {
      online: true,
      user,
      message: 'Signed Up!',
      token: new_token,
      session_id: (<any> request).session.id
    };
    return response.status(200).json(responseData);
  }

  static async sign_in(request: Request, response: Response) {
    console.log(request.body);
    if((<IRequest> request).session.id) {
      return response.json({
        error: true,
        message: "Client already signed in",
        online: true,
        user: (<IRequest> request).session.you
      });
    }
    let { email, password } = request.body;
    if(email) { email = email.toLowerCase(); }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    const check_account_model = await Users.findOne({
      where: { [Op.or]: [{email: email}, {username: email}] }
    });
    const check_account = (
      check_account_model 
        ? check_account_model.get({ plain: true })
        : null
    ) as IUserModel;
    if(!check_account) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    if(bcrypt.compareSync(password, check_account.password) === false) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    var user = check_account;
    delete user.password;
    (<IRequest> request).session.id = uniqueValue();
    (<IRequest> request).session.you = user;

    const searchTokenWhereClause = {
      ip_address: request.ip,
      user_agent: request.get('user-agent')!,
      user_id: user.id
    };
    const session_token_model = await Tokens.findOne({ where: searchTokenWhereClause });
    if(session_token_model) {
      const responseJson = {
        online: true,
        user,
        token: session_token_model.get('token'),
        message: 'Signed In!'
      };
      return response.json(responseJson);
    }
    else {
      const new_token = uniqueValue();
      const tokenCreateOptions = { 
        ip_address: request.ip, 
        user_agent: request.get('user-agent'), 
        user_id: user.id, 
        token: new_token, 
        device: (<IRequest> request).device!.type 
      };
      Tokens.create(tokenCreateOptions)
        .then((tokenModel) => {
          console.log(`token created`);
        })
        .catch((error) => {
          console.log(`could not create token`, error);
        });
      const responseJson = {
        online: true,
        user,
        token: new_token,
        message: 'Signed In!'
      };
      return response.json(responseJson);
    }
  }
}