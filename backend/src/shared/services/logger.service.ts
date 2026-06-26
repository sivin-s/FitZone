import {injectable} from 'inversify';
import pino,{type Logger} from 'pino';
import fs from 'fs';
import {env} from '../../config/env';
import type {ILogger} from '../interfaces/ILogger';
import path from 'path';
import { pid } from 'process';
// log 
import pinoPretty from 'pino-pretty';

@injectable() // decorator tells to compile  register the class
export class LoggerService implements ILogger{
    private adminLogger: Logger;
    private userLogger: Logger;


    constructor(){
        const logDir = path.join(__dirname,"../../logs");
        // create logs directory if it doesn't exist
        if(!fs.existsSync(logDir)){
            fs.mkdirSync(logDir,{recursive: true});
        }

        // admin logger
        // Remove the pipe part and just create two loggers
this.adminLogger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password', 'token'],
  transport: env.NODE_ENV !== "production" ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    }
  } : undefined
}, pino.destination(path.join(logDir, 'admin.log')));

        // user logger (Trainer + Trainee)
       this.userLogger = pino({
            level: env.NODE_ENV === "production" ? "info" : "debug",
            timestamp: pino.stdTimeFunctions.isoTime,
            redact: ['password', 'token'],
            base: { pid: false },
            transport: env.NODE_ENV !== "production" ? {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            } : undefined,
        }, pino.destination({
            dest: path.join(logDir, 'user.log'),
            sync: false
        }));

       
    }


    // main methods
    info(message: any, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.info(message);
        }else{
            this.userLogger.info(message);
        }
    }
    
    error(message: any, isAdmin?: boolean): void {
       if(isAdmin){
        this.adminLogger.error(message);
       }else{
        this.userLogger.error(message);
       }
    }

    warn(message: any, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.warn(message);
        }else{
            this.userLogger.warn(message);
        }
    }

    debug(message: any, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.debug(message)
        }else{
            this.userLogger.debug(message);
        }
    }
}





