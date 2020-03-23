import {
  Request,
  Response
} from 'express';
import { Server } from 'socket.io';

export interface IRequest extends Request {
  io?: Server;
  session: {
    [key: string]: any;
    id?: string;
    you?: any;
  };
  device?: { [key: string]: any; };
}

export interface IResponse extends Response {
  
}

export interface IUserModel {
  id: number;
  displayname: string;
  username: string;
  email: string;
  password: string;
  paypal: string;
  bio: string;
  link_text: string;
  link_href: string;
  public: boolean;
  icon_link: string;
  icon_id: string;
  verified: boolean;
  certified: boolean;
  date_created: string;
  uuid: string;
}