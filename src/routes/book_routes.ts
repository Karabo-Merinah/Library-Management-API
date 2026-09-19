import {Router,Request,Response} from "express"
import {body,param,validationResult} from "express-validator"

const router=Router()

let books=[{book_id:1,title:"How to get away with murder",category:"Thriller",page_number:250},
{book_id:2,title:"The rough patch",category:"Educational",page_number:200}   
]


//getting all books 
router.get("/",(req:Request,res:Response)=>{
    res.status(200).json(books)
})

// //getting books by id 

// router.get("/:id").[param("id").isInt("id")]