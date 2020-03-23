"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const uuid_2 = require("uuid");
const crypto = require("crypto");
const models_1 = require("./models");
exports.APP_SECRET = 'f6evg7h8j9rrnhcw8e76@$#%RFG&*DR^&G*O(Pxjt67g8yu';
exports.specialCaracters = ['!', '@', '#', '$', '%', '&', '+', ')', ']', '}', ':', ';', '?'];
exports.codeCharacters = ['!', '@', '#', '$', '%', '&', '|', '*', ':', '-', '_', '+'];
exports.allowed_images = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
exports.algorithm = 'aes-256-ctr';
exports.token_separator = '|';
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
})(NOTIFICATION_TYPE = exports.NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = {}));
var NOTIFICATION_TARGET_TYPE;
(function (NOTIFICATION_TARGET_TYPE) {
})(NOTIFICATION_TARGET_TYPE = exports.NOTIFICATION_TARGET_TYPE || (exports.NOTIFICATION_TARGET_TYPE = {}));
var SUBSCRIPTION_TYPE;
(function (SUBSCRIPTION_TYPE) {
})(SUBSCRIPTION_TYPE = exports.SUBSCRIPTION_TYPE || (exports.SUBSCRIPTION_TYPE = {}));
var EVENT_TYPES;
(function (EVENT_TYPES) {
})(EVENT_TYPES = exports.EVENT_TYPES || (exports.EVENT_TYPES = {}));
exports.numberRegex = /^[0-9]+/gi;
function convertHomeListingLinksToList(links) {
    const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    if (!links) {
        return [];
    }
    const splitter = links.split(',,');
    const list = splitter.filter((item) => regex.test(item));
    return list;
}
exports.convertHomeListingLinksToList = convertHomeListingLinksToList;
function getUserFullName(user) {
    if (user) {
        const { first_name, middle_initial, last_name } = user;
        const middle = middle_initial
            ? ` ${middle_initial}. `
            : ` `;
        const displayName = `${first_name}${middle}${last_name}`;
        return displayName;
    }
    else {
        throw new Error(`user arg had no value.`);
    }
}
exports.getUserFullName = getUserFullName;
function addDays(dateObj, number_of_days) {
    const dat = new Date(dateObj.valueOf());
    dat.setDate(dat.getDate() + number_of_days);
    return dat;
}
exports.addDays = addDays;
function backDays(dateObj, number_of_days) {
    const dat = new Date(dateObj.valueOf());
    dat.setDate(dat.getDate() - number_of_days);
    return dat;
}
exports.backDays = backDays;
function validateEmail(email) {
    if (!email) {
        return false;
    }
    if (email.constructor !== String) {
        return false;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}
exports.validateEmail = validateEmail;
function validateName(name) {
    if (!name) {
        return false;
    }
    if (name.constructor !== String) {
        return false;
    }
    const re = /^[a-zA-Z]{2,}$/;
    return re.test(name.toLowerCase());
}
exports.validateName = validateName;
function validateNumber(num) {
    if (num === null || num === undefined) {
        return false;
    }
    if (typeof (num) !== 'number') {
        return false;
    }
    if (isNaN(num) || num === Infinity || num === -Infinity) {
        return false;
    }
    if (num < 0) {
        return false;
    }
    return true;
}
exports.validateNumber = validateNumber;
function validateDisplayName(value) {
    if (!value) {
        return false;
    }
    if (value.constructor !== String) {
        return false;
    }
    const re = /^[a-zA-Z\s\'\-\_\.]{2,50}$/;
    return re.test(value.toLowerCase());
}
exports.validateDisplayName = validateDisplayName;
function validateUsername(value) {
    if (!value) {
        return false;
    }
    if (value.constructor !== String) {
        return false;
    }
    const re = /^[a-zA-Z0-9\-\_]{2,50}$/;
    return re.test(value.toLowerCase());
}
exports.validateUsername = validateUsername;
function validateURL(value) {
    if (!value) {
        return false;
    }
    if (value.constructor !== String) {
        return false;
    }
    const re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    return re.test(value.toLowerCase());
}
exports.validateURL = validateURL;
function validateInteger(value) {
    if (!value) {
        return false;
    }
    if (value.constructor !== Number) {
        return false;
    }
    const re = /^[0-9]+$/;
    return re.test(value);
}
exports.validateInteger = validateInteger;
function validatePassword(password) {
    if (!password) {
        return false;
    }
    if (password.constructor !== String) {
        return false;
    }
    const hasMoreThanSixCharacters = password.length > 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return (hasMoreThanSixCharacters
        && (hasUpperCase || hasLowerCase));
}
exports.validatePassword = validatePassword;
function uniqueValue() {
    return String(Date.now()) +
        Math.random().toString(36).substr(2, 34) +
        Math.random().toString(36).substr(2, 34) +
        Math.random().toString(36).substr(2, 34) +
        Math.random().toString(36).substr(2, 34);
}
exports.uniqueValue = uniqueValue;
function greatUniqueValue() {
    return String(Date.now()) + '|' +
        Math.random().toString(36).substr(2, 34) + '|' +
        uuid_1.v1() + '|' +
        uuid_2.v4() + '|' +
        bcrypt.hashSync(exports.APP_SECRET);
}
exports.greatUniqueValue = greatUniqueValue;
function generateResetPasswordCode() {
    const code = Date.now() +
        '_' +
        Math.random().toString(36).substr(2, 34) +
        Math.random().toString(36).substr(2, 34) +
        '_' +
        uuid_1.v1();
    console.log({ code });
    return code;
}
exports.generateResetPasswordCode = generateResetPasswordCode;
function capitalize(str) {
    if (!str) {
        return '';
    }
    const Str = str.toLowerCase();
    return Str.charAt(0).toUpperCase() + Str.slice(1);
}
exports.capitalize = capitalize;
function encrypt(text) {
    const cipher = crypto.createCipher(exports.algorithm, exports.APP_SECRET);
    let crypted = cipher.update(String(text), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
exports.encrypt = encrypt;
function decrypt(text) {
    const decipher = crypto.createDecipher(exports.algorithm, exports.APP_SECRET);
    let dec = decipher.update(String(text), 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
function getRandomIndex(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.getRandomIndex = getRandomIndex;
function generateRandomString(num = 1) {
    let str = '';
    if (typeof (num) !== 'number') {
        num = 1;
    }
    for (let i = 0; i < num; i++) {
        str = str + Math.random().toString(36).substr(2, 34);
    }
    return str;
}
exports.generateRandomString = generateRandomString;
function generateRandomSpecialString(num = 1) {
    let str = '';
    if (typeof (num) !== 'number') {
        num = 1;
    }
    for (let i = 0; i < num; i++) {
        str = str + Math.random().toString(36).substr(2, 34) + getRandomIndex(exports.specialCaracters);
    }
    return str;
}
exports.generateRandomSpecialString = generateRandomSpecialString;
function generateToken(user_id) {
    const timestamp = Date.now();
    const uuid = uuid_2.v4();
    const hash = encrypt(String(user_id));
    const randomstring = generateRandomSpecialString(15);
    const token = `${timestamp}${exports.token_separator}${uuid}${exports.token_separator}${hash}${exports.token_separator}${randomstring}`;
    console.log('new token: ', token);
    return token;
}
exports.generateToken = generateToken;
function CheckToken(request, response, next) {
    (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let auth = request.get('Authorization');
        console.log('auth - ', auth);
        if (!auth) {
            return response.json({ error: true, message: 'No Authorization header was set or has no value' });
        }
        auth = String(auth);
        const splitter = auth.split(exports.token_separator);
        if (splitter.length !== 4) {
            console.log('splitter - ', splitter);
            return response.json({ error: true, message: 'Token format/structure is invalid' });
        }
        const timestamp = new Date(splitter[0]);
        if (!(new Date(timestamp)).valueOf() === false) {
            return response.json({ error: true, message: 'Token date is invalid' });
        }
        let user_id;
        try {
            user_id = parseInt(decrypt(splitter[2]), 10);
            if (!user_id) {
                return response.json({ error: true, message: 'Token auth is invalid' });
            }
        }
        catch (e) {
            console.log(e, 'user_id - ', user_id);
            return response.json({ error: true, message: 'Token auth is invalid' });
        }
        const token_record = yield models_1.models.Tokens
            .findOne({ where: {
                token: auth,
                user_agent: request.get('User-Agent'),
                device: request.device.type
            }
        });
        if (!token_record) {
            return response.json({ error: true, message: 'Token does not exist' });
        }
        if (token_record.dataValues.user_id !== user_id) {
            return response.json({ error: true, message: 'Token not authorized' });
        }
        const user_record = yield models_1.models.Users.findOne({ where: { id: user_id } });
        if (!user_record) {
            return response.json({ error: true, message: 'Token does not match for any user' });
        }
        response.locals.auth = { user_id, user_record, token_record };
        return next();
    }))();
}
exports.CheckToken = CheckToken;
function SessionRequired(request, response, next) {
    console.log('auth called');
    (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const sessionId = request.session.id;
        if (!sessionId) {
            const auth = request.get('Authorization');
            if (!auth) {
                return response.status(401).json({ error: true, message: 'No Authorization header...' });
            }
            const token_record = yield models_1.models.Tokens.findOne({ where: { token: auth } });
            if (!token_record) {
                return response.status(401).json({ error: true, message: 'Auth token is invalid...' });
            }
            const token = token_record.dataValues;
            if (token.user_agent !== request.get('user-agent')) {
                return response.status(401).json({ error: true, message: 'Token used from invalid client...' });
            }
            const get_user = yield models_1.models.Users.findOne({ where: { id: token.user_id } });
            const user = get_user.dataValues;
            delete user.password;
            response.locals.you = user;
            return next();
        }
        else {
            response.locals.you = request.session.you;
            return next();
        }
    }))();
}
exports.SessionRequired = SessionRequired;
function UserAuthorized(request, response, next) {
    const user_id = parseInt(request.params.id, 10);
    const you = request.session.you;
    if (user_id !== you.id) {
        return response.status(403).json({
            error: true,
            message: `You are not permitted to complete this action.`
        });
    }
    return next();
}
exports.UserAuthorized = UserAuthorized;
exports.whitelist_domains = [
    'http://localhost:8080',
    'http://localhost:7600',
    'http://localhost:9500',
    'https://ryanwaite28.github.io',
    'http://rmw-my-favors-client.herokuapp.com',
    'https://rmw-my-favors-client.herokuapp.com',
];
exports.corsOptions = {
    origin(origin, callback) {
        const originIsAllowed = exports.whitelist_domains.includes(origin);
        console.log({
            origin,
            callback,
            originIsAllowed,
        });
        if (!origin) {
            callback(new Error(`Origin "${origin}" Not allowed by CORS`));
            return;
        }
        if (originIsAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origin "${origin}" Not allowed by CORS`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
