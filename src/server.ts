import bodyParser from "body-parser"
import express, { type Express } from "express"
import { loggerMiddleware } from "./middleware/logger"
import router from "./routes/author_route"
import book_router from "./routes/book_routes"
import { errorHandler, routeNotFound } from "./middleware/errorHandler"
//creates express application 

const app:Express=express()
const PORT =5000

//Built in middleware-parse incoming request
app.use(express.json())
app.use(bodyParser.json())

app.use(loggerMiddleware)
app.use("/authors",router)
app.use("/books",book_router)

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

