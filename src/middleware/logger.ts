import type {Request ,Response ,NextFunction} from "express"

export const loggerMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    //without this request stuck in middle and app doesn't send any request 
    next()
}