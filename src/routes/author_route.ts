
import { Router, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"

const router = Router()

let authors = [{ id: 1, name: "Karabo", surname: "Sekosana", number_of_books: 4 },
{ id: 2, name: "Karbie", surname: "Mlambo", number_of_books: 2 }
]

let nextAuthorId=3
//gettting all authors

router.get("/", (req: Request, res: Response) => {
    res.status(200).json(authors)
})
//retrieving author  using id

router.get("/:id", [param("id").isInt().withMessage("ID must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)

    console.log(errors, "Errors from express -validator middleware")

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    const author = authors.find((author) => author.id === id)

    if (!author) {
        return res.status(404).json({message:"Author is not found"})
    }
    res.status(200).json(author)
}
)
//adding an author in the existing array 

router.post("/", [body("name").notEmpty().withMessage("Name is required "),
body("surname").notEmpty().withMessage("Surname of the author is required"),
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req)
    const { name, surname, number_of_books } = req.body
    const newAuthor = { id:nextAuthorId, name, surname, number_of_books }
    authors.push(newAuthor)
    nextAuthorId++

    res.status(201).json(newAuthor)
})

// updating an author
router.put("/:id", [param("id").isInt().withMessage("Author id must be a number"),
body("name").notEmpty().withMessage("Author name is required"),
body("surname").notEmpty().withMessage("Surname of the author is required"),
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    const author = authors.find((author) => author.id === id)

    if (!author) {
        return res.status(404).json({message:"Author not found"})
    }

    const { name, surname, number_of_books } = req.body
    const updatedAuthor = { id, name, surname, number_of_books }

    //find the position of the objcet 
    authors[authors.indexOf(author)] = updatedAuthor

    res.status(200).json(updatedAuthor)
})

//deleting author by providing id
router.delete("/:id", [param("id").isInt().withMessage("ID must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    const deletedAuthor = authors.find((author) => author.id === id)

    if (!deletedAuthor) {
        return res.status(404).json({message:"Author is not found"})
    }

    // keep all authors that their id is not equal to the one provided 
    authors = authors.filter((author) => author.id !== id)
    res.status(200).json(deletedAuthor)
})


export default router

