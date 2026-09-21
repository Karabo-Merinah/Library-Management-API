import type {Request ,Response ,NextFunction} from "express"

export const loggerMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const now =new Date().toISOString()
    console.log(`[${now}] ${req.method} ${req.url}`)
    //without this request stucks in middle and app doesn't send any request 
    next()
}