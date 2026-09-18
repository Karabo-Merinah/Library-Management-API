
import {Router,Request,Response} from "express"
import {body,param,validationResult} from "express-validator"


const router=Router()

let authors =[{id:1,name:"Karabo",surname:"Sekosana",number_of_books:4},
    {id:2,name:"Karbie",surname:"Mlambo",number_of_books:2}
]
//gettting all authors

router.get ("/",(req:Request,res:Response)=>{
    res.status(200).json(authors)
})
//retrieving users using id

router.get("/:id",[param("id").isInt().withMessage("ID must be a number")],(req:Request,res:Response)=>{
    const errors=validationResult(req)

    console.log(errors,"Errors from express -validator middleware")

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id =Number(req.params.id)
    const author=authors.find((author)=>author.id === id)

    if(!author){
        return res.status(404).send("User is not found")
    }
    res.status(200).json(author)
}
)
//adding a user in the existing array 

router.post("/",[body("name").notEmpty().withMessage("Name is required "),
    body("surname").notEmpty().withMessage("Surname of the author is required"),
],(req:Request,res:Response)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array})
    }
    console.log(req)
    const {name,surname,number_of_books}=req.body
    const newAuthor={id:authors.length +1,name,surname,number_of_books}
    authors.push(newAuthor)

    res.status(201).json(newAuthor)
})


export default router

