import type {Request ,Response ,NextFunction} from "express"

export const loggerMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    console.log(`${req.method} ${req.url}`)
    //without this request stucks in middle and app doesn't send any request 
    next()
}