const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, metadata } = format;
const { errorLogger } = require('express-winston');
const customLevelOptions = require('./loggerLevelsEnums');
const { mongoUrl, env } = require('../../config/dotenvVariables.config');
require('winston-mongodb');

const myErrorFormat = printf(({ level, meta, timestamp}) => {
    return `${ timestamp } ${ level }: ${ meta.message  }
    `
});

const myFormat = printf(({ level, message, timestamp}) => {
    return `${ timestamp } ${ level }: ${ message  }
    `
});

const developmentLogger = createLogger({
     levels: customLevelOptions.levels,
     transports: [
        new transports.Console({ level: 'debug'}),
     ],
     format: combine(
         format.colorize({ colors: customLevelOptions.colors }),
         timestamp({ format: 'HH:mm:ss' }),
         myFormat,
     )
});


const productionLogger = createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({
            level: 'error',
            filename: "logsErrors.log" }),
        new transports.File({
            level: 'fatal',
            filename: "logsFatal.log" }),
        new transports.MongoDB({
            db: mongoUrl,
            collection: 'logs',
            options: {
                useUnifiedTopology: true,
            }
        })       
    ],
    format: combine(
        metadata(), 
        timestamp(),
        myFormat,
    )
});

const errorHandlerLogger = errorLogger({
    transports: [
        new transports.File({
            filename: 'logsInternalErrors.log'
        })
    ],
    format: combine(
        timestamp(),
        myErrorFormat,
    )
});

const winstonLogger = (req, res, next) => {

    if (env === 'development'){
        req.logger = developmentLogger;
    }
    if ( env === 'production') {
        req.logger = productionLogger
    }
    next();
};


module.exports = {
    winstonLogger,
    errorHandlerLogger,
}

