const Sequelize = require('sequelize');
const chamber = require('./chamber');

let sequelize, db_env;
if(process.env.DATABASE_URL) {
  db_env = 'Production';
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  });
} else {
  db_env = 'Development';
  sequelize = new Sequelize({
    password: null,
    dialect: 'sqlite',
    storage: 'database.sqlite',
  });
}

const models = {};



models.Users = sequelize.define('users', {
  displayname:     { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  username:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  paypal:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  password:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  bio:             { type: Sequelize.STRING(250), allowNull: false, defaultValue: '...' },
  link_text:       { type: Sequelize.STRING(250), allowNull: false, defaultValue: '' },
  link_href:       { type: Sequelize.STRING(250), allowNull: false, defaultValue: '' },
  public:          { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  icon_link:       { type: Sequelize.STRING(500), allowNull: true, defaultValue: '/bin/img/anon.png' },
  icon_id:         { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  certified:       { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['email', 'username', 'uuid'] }] });

models.SessionTokens = sequelize.define('session_tokens', {
  token:           { type: Sequelize.STRING(500), unique: true, allowNull: false },
  ip_address:      { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  user_agent:      { type: Sequelize.STRING(500), allowNull: false },
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['token', 'uuid'] }] });

models.ResetPasswordRequests = sequelize.define('reset_password_requests', {
    user_email:      { type: Sequelize.INTEGER, allowNull: false },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['user_email', 'unique_value'] }] });

models.Follows = sequelize.define('follows', {
    user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    follows_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:                { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.FollowRequests = sequelize.define('follow_requests', {
    user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    follows_id:          { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:                { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.UserReviews = sequelize.define('user_reviews', {
    user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    writer_id:       { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    rating:          { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
    summary:         { type: Sequelize.STRING(250), allowNull: true, defaultValue: '' },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:    { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});


models.Favors = sequelize.define('favors', {
    owner_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    title:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    desc:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    location:        { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    category:        { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    payout:          { type: Sequelize.INTEGER, allowNull: false },
    helpers_needed:  { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    fulfilled:       { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    media_type:      { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    media_link:      { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    date_needed:     { type: Sequelize.DATE, allowNull: false },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.FavorHelpers = sequelize.define('favor_helpers', {
    user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    favor_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Favors, key: 'id' } },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.FavorRequests = sequelize.define('favor_requests', {
    user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    favor_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Favors, key: 'id' } },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.FavorDisputes = sequelize.define('favor_disputes', {
    creator_id:      { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    favor_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Favors, key: 'id' } },
    date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:            { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.DisputeLogs = sequelize.define('dispute_logs', {
    dispute_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.FavorDisputes, key: 'id' } },
    user_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    message:           { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    date_created:      { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:              { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});


models.Notifications = sequelize.define('notifications', {
    user_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
    action:              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    message:             { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
    link:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    verified:            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    uuid:                { type: Sequelize.STRING, unique: true, defaultValue: Sequelize.UUIDV1 }
}, {
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['uuid'] }]
});

models.ApiKeys = sequelize.define('api_keys', {
    key:                 { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue },
    firstname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    middlename:          { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
    lastname:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    email:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    phone:               { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    website:             { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    verified:            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    requests_count:      { type: Sequelize.INTEGER, defaultValue: 0 }
}, {
    freezeTableName: true,
    indexes: [{unique: true, fields: ['email', 'key'] }]
});





/* --- Initialize Database --- */

sequelize.sync({ force: false })
.then(() => { console.log('Database Initialized! ' + db_env); })
.catch((error) => { console.log('Database Failed!', error); });



/* --- Exports --- */

module.exports = {
  sequelize,
  models
};
