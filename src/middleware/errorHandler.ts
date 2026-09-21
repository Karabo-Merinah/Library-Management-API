import type { Request,Response,NextFunction } from "express";


//catches any error thrown in the route 
export const errorHandler=(error:any,req:Request,res:Response,next:NextFunction)=>{
    console.log(error)

   let statusCode=error.statusCode || 500
   let message= error.message || "Something went wrong with the server"

    return  res.status(statusCode).json({message:message})

}

//catches any request to a route that doesn't exist
export const routeNotFound=(req:Request,res:Response)=>{
    res.status(404).json({message:"Route "+ req.originalUrl +" is not found"})
}