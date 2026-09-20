
import { Router, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"

const router = Router()

let authors = [{ id: 1, name: "Karabo", surname: "Sekosana", number_of_books: 4 },
{ id: 2, name: "Karbie", surname: "Mlambo", number_of_books: 2 }
]

let nextAuthorId = 3
//gettting all authors

router.get("/", (req: Request, res: Response) => {
    return res.status(200).json(authors)
})
//retrieving author  using id

router.get("/:id", [param("id").isInt().withMessage("ID must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    const author = authors.find((author) => author.id === id)

    if (!author) {
        return res.status(404).json({ message: "Author is not found" })
    }
    return res.status(200).json(author)
}
)
//adding an author in the existing array 

router.post("/", [body("name").notEmpty().withMessage("Name is required "),
body("surname").notEmpty().withMessage("Surname of the author is required"),
body("number_of_books").isInt({ min: 1 }).withMessage("Number of books must not be less than 1 ")
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, surname, number_of_books } = req.body
    // Check for duplicate (case-insensitive)
    const duplicateAuthor = authors.find((author) =>
        author.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        author.surname.toLowerCase().trim() === surname.toLowerCase().trim()
    )
    if (duplicateAuthor) {
        return res.status(409).json({
            message: `Author "${name} ${surname}" already exists`,
        })
    }
    const newAuthor = { id: nextAuthorId, name, surname, number_of_books }
    authors.push(newAuthor)
    nextAuthorId++

    return res.status(201).json(newAuthor)
})

// updating an author
router.put("/:id", [param("id").isInt().withMessage("Author id must be a number"),
body("name").notEmpty().withMessage("Author name is required"),
body("surname").notEmpty().withMessage("Surname of the author is required"),
body("number_of_books").isInt({ min: 1 }).withMessage("Number of books must not be less than 1 ")
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    //find the position of the object of author 
    const authorIndex = authors.findIndex((author) => author.id === id)
    //if the index is -1 then it means there's no author with that id 
    if (authorIndex === -1) {
        return res.status(404).json({ message: "Author not found" })
    }

    const { name, surname, number_of_books } = req.body
    const duplicateAuthor = authors.find((author) =>author.id !==id &&
        author.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        author.surname.toLowerCase().trim() === surname.toLowerCase().trim()
    )
    if (duplicateAuthor) {
        return res.status(409).json({
            message: `Author "${name} ${surname}" already exists`,
        })
    }
    const updatedAuthor = { id, name, surname, number_of_books }
    authors[authorIndex] = updatedAuthor

    return res.status(200).json(updatedAuthor)
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
        return res.status(404).json({ message: "Author is not found" })
    }

    // keep all authors that their id is not equal to the one provided 
    authors = authors.filter((author) => author.id !== id)
    return res.status(204).send()
})


export default router
export { authors }
