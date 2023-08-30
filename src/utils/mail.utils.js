const nodemailer = require('nodemailer');
const { emailSender, emailPass, twilioSid, twilioToken, twilioSmsNumber } = require('../config/dotenvVariables.config');
const client = require('twilio')(twilioSid, twilioToken);

const MAX_RETRIES = 3;

const nodemailerTransport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: emailSender,
        pass: emailPass,
    }
});

const sendUserNotification = async (email, message, retryCount = 0) => {
    try {
        const nodemailerSendEmail = await nodemailerTransport.sendMail({
            from: `Coder Test <${emailSender}>`,
            to: email,
            subject: 'CoderHouse BackEnd',
            html: `
            <div>
                <h1> Notificacion de estado de cuenta </h1>
                <p> ${message}</p>
            </div>        
            `,
            attachments: [],
        });

        return nodemailerSendEmail;

    }catch(e){
        if(retryCount < MAX_RETRIES){
            console.log(`Email sending failed. Retrying... (Attempt ${retryCount + 1})`)
            return sendUserNotification(email, message, retryCount + 1);
        }else {
            throw new Error(`Email sending failed after ${MAX_RETRIES} attempts.`);
        }
    }
};

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

const sendDeleteProductNotification = async (email, firstName, lastName, productTitle, retryCount = 0) => {
    try {
        const nodemailerSendEmail = await nodemailerTransport.sendMail({
            from: `Coder Test <${emailSender}>`,
            to: email,
            subject: 'CoderHouse BackEnd',
            html: `
            <div>
                <h1> Tu producto ha sido eliminado exitosamente </h1>
                <p> ${firstName} ${lastName}, tu producto <br><b>"${productTitle}"</b></br>
                 fue eliminado exitosamente, gracias por ser premium!. </p>
            </div>        
            `,
            attachments: [],
        });

        return nodemailerSendEmail;

    }catch(e){
        if(retryCount < MAX_RETRIES){
            console.log(`Email sending failed. Retrying... (Attempt ${retryCount + 1})`)
            return sendDeleteProductNotification(email, firstName, lastName, productTitle, retryCount + 1);
        }else {
            throw new Error(`Email sending failed after ${MAX_RETRIES} attempts.`);
        }
    }
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
        sendDeleteProductNotification,
        sendUserNotification,
}