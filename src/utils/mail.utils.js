const nodemailer = require('nodemailer');
const { emailSender, emailPass, twilioSid, twilioToken, twilioSmsNumber } = require('../config/dotenvVariables.config');
const client = require('twilio')(twilioSid, twilioToken);

const nodemailerTransport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: emailSender,
        pass: emailPass,
    }
});

const sendEmail = (email) => {

    const nodemailerSendEmail = nodemailerTransport.sendMail({
        from: `Coder Test <${emailSender}>`,
        to: email,
        subject: 'CoderHouse BackEnd',
        html: `
        <div>
            <h1> Gracias por registrarse </h1>
        </div>        
        `,
        attachments: [],
    });

    return nodemailerSendEmail;
};

const sendRecoveryPassword = (email, url) => {
    const nodemailerSendEmail = nodemailerTransport.sendMail({
        from: `Coder Test <${emailSender}>`,
        to: email,
        subject: 'CoderHouse BackEnd',
        html: `
        <div>
            <h1> Solicitaste un cambio de contraseña </h1><br/>

           <p> Utiliza este link para cambiar la contraseña: <a href="${url}"> Cambiar Contraseña </a> </p>
        </div>        
        `,
        attachments: [],
    });
    
    return nodemailerSendEmail;
};


const sendSms = async (phoneNumber) => {
    try{
        const sendSms = await client.messages.create({
            body: 'This is a twilio sms',
            from: twilioSmsNumber,
            to: phoneNumber,
        });
        return sendSms
    } catch(e) {
        throw new Error(e.message)
    }
    
};


module.exports = {
        sendEmail,
        sendSms,
        sendRecoveryPassword,
}