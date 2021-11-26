const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'blahsomething',
    db: 'comet_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'smtpmail1089@gmail.com',
            pass: 'Smtpmail@123'
        }
    },
    google_client_id: "105966610831-52nmpgctr5m97c1ahm0iuqnvd7v43qsn.apps.googleusercontent.com",
    google_client_secret: "RHwLD0PRjy0U-b7IZikNk6AJ",
    google_callback_url: "http://webdirect.me/users/auth/google/callback",
    jwt_secret: 'comet',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.COMET_ASSET_PATH,
    session_cookie_key: process.env.COMET_SESSION_COOKIE_KEY,
    db: process.env.COMET_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.COMET_GMAIL_USERNAME,
            pass: process.env.COMET_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.COMET_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.COMET_GOOGLE_CLIENT_SECRET,
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: process.env.COMET_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.COMET_ENVIRONMENT) == undefined ? development : eval(process.env.COMET_ENVIRONMENT);
