import { Router, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"
import { authors } from "./author_route"

const book_router = Router()

let books = [{ id: 1, title: "How to get away with murder", category: "Thriller", author_id: 1 },
{ id: 2, title: "The rough patch", category: "Educational", author_id: 2 }
]

let nextBookId = 3

//getting all books 
book_router.get("/", (req: Request, res: Response) => {
    res.status(200).json(books)
})

// //getting books by id 

book_router.get("/:id", [param("id").isInt().withMessage("Book id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    const book = books.find((book) => book.id === id)

    if (!book) {
        return res.status(404).json({ message: "Book with id " + id + "is not found" })
    }
    res.status(200).json(book)
})

// create a new book with appended author id 

book_router.post("/", [body("title").notEmpty().withMessage("Title is not required "),
body("category").notEmpty().withMessage("Category is required"),
body("author_id").notEmpty().withMessage("Author id is required")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    const { title, category, author_id } = req.body

    //check if author exist before putting a book 
    const author = authors.find((author) => author.id === Number(author_id))

    if (!author) {
        return res.status(400).json({ message: "No author found with id " + author_id })
    }
    //check if there's no duplicate  book-same title by the same author 
    const duplicatedBook = books.find((book) => book.title === title && book.author_id === Number(author_id))
    if (duplicatedBook) {
        return res.status(409).json({ message: "Book of the same title for this author already exist " })
    }
    const newBook = { id: nextBookId, title, category, author_id:Number(author_id) }
    books.push(newBook)
    nextBookId++
    res.status(201).json(newBook)
})

// updating a book using id 
book_router.put("/:id",[param("id").isInt().withMessage("Book id must be a number"),
body("title").notEmpty().withMessage("Title is not required "),
body("category").notEmpty().withMessage("Category is required"),
body("author_id").notEmpty().withMessage("Author id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
       return res.status(400).json({ error: errors.array() })
    }
    const id = Number(req.params.id)
    const book = books.find((book) => book.id === id)

    if (!book) {
        return res.status(404).json({ message: "No book with the id " + id + " is found" })
    }
    const { title, category, author_id } = req.body

    //check  if author exists before updating the book
    const author = authors.find((author) => author.id === Number(author_id))

    if (!author) {
        return res.status(400).json({ message: "No author found with id " + author_id })
    }

    const updatedBook = { id, title, category, author_id: Number(author_id) }
    books[books.indexOf(book)] = updatedBook
    res.status(200).json(updatedBook)
})

//delete book by id

book_router.delete("/:id", [param("id").isInt().withMessage("Book id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
       return  res.status(400).json({ error: errors.array() })
    }
    const id = Number(req.params.id)
    const book_to_delete = books.find((book) => book.id === id)

    if (!book_to_delete) {
        return res.status(404).json({ message: "No book with the id " + id + " is found" })
    }
    books = books.filter((book) => book.id !== id)
    res.status(204).send()

})

export default book_router

