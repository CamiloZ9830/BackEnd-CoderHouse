const schedule = require('node-schedule');
const userModel = require('../dao/modelsMongo/users.model');
const { sendUserNotification } = require('./mail.utils');

function inactiveUsersCleanup() {

    return schedule.scheduleJob('*/1 * * * *', async () => {
        try {
            // envia mensajes a cuentas que han estado inactivas por 30 min,
            // informando al usuario que su cuenta se ha eliminado por falta de actividad
            const currentTime = new Date();
            const startTime = new Date(currentTime - 29 * 60 * 1000); 
            const endTime = new Date(currentTime - 28 * 60 * 1000); 

            const inactiveUsers = await userModel.find({
                lastConnection: { $gte: startTime, $lte: endTime },
            });

            for (const user of inactiveUsers) {
                const { email, userName, firstName } = user; 
                await sendUserNotification(email, `${firstName}, tu cuenta ${userName} asociada a tu correo ${email} ha sido eliminada por inactividad.`);
            }

        } catch (error) {
            console.error('Error in cleanup task:', error);
        }
    });
}

module.exports = { 
    inactiveUsersCleanup, 
};