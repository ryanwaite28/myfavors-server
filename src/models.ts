import {
  Sequelize,
  Options,
  Model,
  DataTypes
} from 'sequelize';
import { IUserModel } from './interfaces/all.interface';



let sequelize: Sequelize;
let db_env: string;
if (process.env.DATABASE_URL) {
  db_env = 'Production';
  const opts: Options = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    },
    define: {
      timestamps: true
    }
  };
  sequelize = new Sequelize(process.env.DATABASE_URL, opts);
} else {
  db_env = 'Development';
  const opts: Options = {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    define: {
      timestamps: true
    }
  };
  sequelize = new Sequelize('database', 'username', 'password', opts);
}



export class Users extends Model {}
Users.init({
  displayname:     { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  username:        { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  email:           { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  password:        { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  paypal:          { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  bio:             { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  link_text:       { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  link_href:       { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  public:          { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
  icon_link:       { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  icon_id:         { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  verified:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  certified:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:            { type: DataTypes.UUID, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['email', 'username', 'uuid'] }] });

export class UserFields extends Model {}
UserFields.init({
  user_id:         { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  name:            { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  type:            { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  value:           { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user_field', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });


export class Tokens extends Model {}
Tokens.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  device:              { type: DataTypes.STRING(500), allowNull: false },
  token:               { type: DataTypes.STRING(500), allowNull: false, unique: true },
  ip_address:          { type: DataTypes.STRING(500), allowNull: false },
  user_agent:          { type: DataTypes.STRING(500), allowNull: false },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date_last_used:      { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'token', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });


export class ResetPasswordRequests extends Model {}
ResetPasswordRequests.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completed:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 },
  unique_value:        { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'reset_password_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class Blockings extends Model {}
Blockings.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  blocks_id:           { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'blocking', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class Follows extends Model {}
Follows.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  follows_id:          { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'follow', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class FollowRequests extends Model {}
FollowRequests.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  follows_id:          { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'follow_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class UserRatings extends Model {}
UserRatings.init({
  user_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  writer_id:           { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  rating:              { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  summary:             { type: DataTypes.STRING(250), allowNull: true, defaultValue: '' },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user_rating', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class Notifications extends Model {}
Notifications.init({
  from_id:             { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  to_id:               { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  action:              { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  target_type:         { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  message:             { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  link:                { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  read:                { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  image_link:          { type: DataTypes.STRING(500), allowNull: true, defaultValue: '' },
  image_id:            { type: DataTypes.STRING(500), allowNull: true, defaultValue: '' },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'notification', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class ContentSubscriptions extends Model {}
ContentSubscriptions.init({
  user_id:                    { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  subscribes_to_id:           { type: DataTypes.INTEGER, allowNull: true, references: { model: Users, key: 'id' } },
  subscribe_content_type:     { type: DataTypes.STRING(500), allowNull: false },
  date_created:               { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                       { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'content_subscription', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class Messages extends Model {}
Messages.init({
  sender_id:              { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  recipient_id:           { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  content:                { type: DataTypes.STRING(500), allowNull: true, defaultValue: '' },
  opened:                 { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                   { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'message', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class AccountsReported extends Model {}
AccountsReported.init({
  user_id:               { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  reporting_id:          { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  issue_type:            { type: DataTypes.STRING(250), allowNull: false },
  details:               { type: DataTypes.TEXT, allowNull: false },
  date_created:          { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:                  { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'account_reported', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class Favors extends Model {}
Favors.init({
  owner_id:        { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  title:           { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  desc:            { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  location:        { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  category:        { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  payout:          { type: DataTypes.INTEGER, allowNull: false },
  helpers_needed:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  fulfilled:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  media_type:      { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  media_link:      { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  date_needed:     { type: DataTypes.DATE, allowNull: false },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class FavorHelpers extends Model {}
FavorHelpers.init({
  user_id:         { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  favor_id:        { type: DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  helped:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_helper', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class FavorRequests extends Model {}
FavorRequests.init({
  user_id:         { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  favor_id:        { type: DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  message:         { type: DataTypes.STRING, allowNull: true },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class FavorDisputes extends Model {}
FavorDisputes.init({
  creator_id:      { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  user_id:         { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  favor_id:        { type: DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  title:           { type: DataTypes.STRING, allowNull: true },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_dispute', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class DisputeLogs extends Model {}
DisputeLogs.init({
  creator_id:      { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  user_id:         { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  favor_id:        { type: DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
  date_created:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  uuid:            { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'dispute_log', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });

export class ApiKeys extends Model {}
ApiKeys.init({
  key:                 { type: DataTypes.UUID, unique: true, defaultValue: DataTypes.UUIDV1 },
  firstname:           { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  middlename:          { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  lastname:            { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  email:               { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  phone:               { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  website:             { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  verified:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  requests_count:      { type: DataTypes.INTEGER, defaultValue: 0 },
  uuid:                { type: DataTypes.STRING, unique: true, defaultValue: DataTypes.UUIDV1 }
}, { sequelize, modelName: 'api_key', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });



/** Relationships */

Users.hasMany(UserFields, { as: 'fields', foreignKey: 'user_id', sourceKey: 'id' });
UserFields.belongsTo(Users, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });

Users.hasMany(Notifications, { as: 'to_notifications', foreignKey: 'to_id', sourceKey: 'id' });
Notifications.belongsTo(Users, { as: 'to', foreignKey: 'to_id', targetKey: 'id' });
Users.hasMany(Notifications, { as: 'from_notifications', foreignKey: 'from_id', sourceKey: 'id' });
Notifications.belongsTo(Users, { as: 'from', foreignKey: 'from_id', targetKey: 'id' });

Users.hasMany(Messages, { as: 'sent', foreignKey: 'sender_id', sourceKey: 'id' });
Messages.belongsTo(Users, { as: 'sender', foreignKey: 'sender_id', targetKey: 'id' });
Users.hasMany(Messages, { as: 'received', foreignKey: 'recipient_id', sourceKey: 'id' });
Messages.belongsTo(Users, { as: 'receiver', foreignKey: 'recipient_id', targetKey: 'id' });



/** Init Database */

sequelize.sync({ force: false })
  .then(() => { console.log('Database Initialized! ENV: ' + db_env); })
  .catch((error) => { console.log('Database Failed!', error); });