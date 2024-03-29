const { Command } = require('commander');
const dotenv = require('dotenv');

const program = new Command();

program
  .option('--env <env>', 'Entorno (development/production)', 'development')
  .parse(process.argv);

const env = program.opts().env;
const envFilePath = `./src/.env.${env}`;
dotenv.config({ path: envFilePath });

console.log("Entorno",env);

/*variables de entorno */
module.exports = {
    //servidor
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    //admin credentials
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    //jwt credentials
    jwtKey: process.env.JWT_PRIVATE_KEY,
    jwtCookieToken: process.env.JWT_COOKIE_TOKEN,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    //nodemailer
    emailSender: process.env.EMAIL_SENDER,
    emailPass: process.env.EMAIL_PASS,
    //twilio sms
    twilioSid: process.env.TWILIO_SID,
    twilioPass: process.env.TWILIO_PASS,
    twilioToken: process.env.TWILIO_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,

    //entorno
    env: env,
}
