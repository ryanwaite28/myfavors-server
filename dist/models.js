"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
let sequelize;
let db_env;
if (process.env.DATABASE_URL) {
    db_env = 'Production';
    const opts = {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        },
        define: {
            timestamps: true
        }
    };
    sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, opts);
}
else {
    db_env = 'Development';
    const opts = {
        dialect: 'sqlite',
        storage: 'database.sqlite',
        define: {
            timestamps: true
        }
    };
    sequelize = new sequelize_1.Sequelize('database', 'username', 'password', opts);
}
class Users extends sequelize_1.Model {
}
exports.Users = Users;
Users.init({
    displayname: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    paypal: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    bio: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    link_text: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    link_href: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    public: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    icon_link: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: '' },
    icon_id: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: '' },
    verified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    certified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.UUID, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['email', 'username', 'uuid'] }] });
class UserFields extends sequelize_1.Model {
}
exports.UserFields = UserFields;
UserFields.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    type: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    value: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user_field', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Tokens extends sequelize_1.Model {
}
exports.Tokens = Tokens;
Tokens.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    device: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    token: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, unique: true },
    ip_address: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    user_agent: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    date_last_used: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'token', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class ResetPasswordRequests extends sequelize_1.Model {
}
exports.ResetPasswordRequests = ResetPasswordRequests;
ResetPasswordRequests.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    completed: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 },
    unique_value: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'reset_password_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Blockings extends sequelize_1.Model {
}
exports.Blockings = Blockings;
Blockings.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    blocks_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'blocking', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Follows extends sequelize_1.Model {
}
exports.Follows = Follows;
Follows.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    follows_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'follow', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class FollowRequests extends sequelize_1.Model {
}
exports.FollowRequests = FollowRequests;
FollowRequests.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    follows_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'follow_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class UserRatings extends sequelize_1.Model {
}
exports.UserRatings = UserRatings;
UserRatings.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    writer_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    summary: { type: sequelize_1.DataTypes.STRING(250), allowNull: true, defaultValue: '' },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'user_rating', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Notifications extends sequelize_1.Model {
}
exports.Notifications = Notifications;
Notifications.init({
    from_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    to_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    action: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    target_type: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    target_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    message: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    link: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    read: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    image_link: { type: sequelize_1.DataTypes.STRING(500), allowNull: true, defaultValue: '' },
    image_id: { type: sequelize_1.DataTypes.STRING(500), allowNull: true, defaultValue: '' },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'notification', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class ContentSubscriptions extends sequelize_1.Model {
}
exports.ContentSubscriptions = ContentSubscriptions;
ContentSubscriptions.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    subscribes_to_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, references: { model: Users, key: 'id' } },
    subscribe_content_type: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'content_subscription', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Messages extends sequelize_1.Model {
}
exports.Messages = Messages;
Messages.init({
    sender_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    recipient_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    content: { type: sequelize_1.DataTypes.STRING(500), allowNull: true, defaultValue: '' },
    opened: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'message', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class AccountsReported extends sequelize_1.Model {
}
exports.AccountsReported = AccountsReported;
AccountsReported.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    reporting_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    issue_type: { type: sequelize_1.DataTypes.STRING(250), allowNull: false },
    details: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'account_reported', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class Favors extends sequelize_1.Model {
}
exports.Favors = Favors;
Favors.init({
    owner_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    desc: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    location: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    category: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    payout: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    helpers_needed: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    fulfilled: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    media_type: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    media_link: { type: sequelize_1.DataTypes.STRING(500), allowNull: false, defaultValue: '' },
    date_needed: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class FavorHelpers extends sequelize_1.Model {
}
exports.FavorHelpers = FavorHelpers;
FavorHelpers.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    favor_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    helped: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_helper', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class FavorRequests extends sequelize_1.Model {
}
exports.FavorRequests = FavorRequests;
FavorRequests.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    favor_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    message: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_request', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class FavorDisputes extends sequelize_1.Model {
}
exports.FavorDisputes = FavorDisputes;
FavorDisputes.init({
    creator_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    favor_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'favor_dispute', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class DisputeLogs extends sequelize_1.Model {
}
exports.DisputeLogs = DisputeLogs;
DisputeLogs.init({
    creator_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    favor_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: Favors, key: 'id' } },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'dispute_log', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
class ApiKeys extends sequelize_1.Model {
}
exports.ApiKeys = ApiKeys;
ApiKeys.init({
    key: { type: sequelize_1.DataTypes.UUID, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 },
    firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    middlename: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: '' },
    lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    website: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: '' },
    verified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    date_created: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    requests_count: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    uuid: { type: sequelize_1.DataTypes.STRING, unique: true, defaultValue: sequelize_1.DataTypes.UUIDV1 }
}, { sequelize, modelName: 'api_key', freezeTableName: false, underscored: true, indexes: [{ unique: true, fields: ['uuid'] }] });
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
sequelize.sync({ force: false })
    .then(() => { console.log('Database Initialized! ENV: ' + db_env); })
    .catch((error) => { console.log('Database Failed!', error); });
