import { Router, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"
import { authors } from "./author_route"

const book_router = Router()

let books = [{ id: 1, title: "How to get away with murder", category: "Thriller",year:2020, author_id: 1 },
{ id: 2, title: "The rough patch", category: "Educational", year:2025,author_id: 2 }
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
        throw { message: "Validation failed", statusCode: 400, errors: errors.array() }
    }
    const id = Number(req.params.id)
    const book = books.find((book) => book.id === id)

    if (!book) {
        throw { message: "Book with id " + id + "is not found", statusCode: 404 }
    }
    res.status(200).json(book)
})

// create a new book with appended author id 

book_router.post("/", [body("title").isString().trim().notEmpty().withMessage("Title is  required and must be a string "),
body("category").isString().trim().notEmpty().withMessage("Category is required and must be a string"),
body("author_id").isInt().withMessage("Author id  must be a number"),
body("year").isInt().withMessage("Year of the book was published must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw { message: "Validation failed", statusCode: 400, errors: errors.array() }
    }
    const { title, category, year,author_id } = req.body

    //check if author exist before putting a book 
    const author = authors.find((author) => author.id === Number(author_id))

    if (!author) {
        throw {message: "No author found with id " + author_id ,statusCode:404}
    }
    //check if there's no duplicate  book-same title by the same author 
    const duplicatedBook = books.find((book) => book.title === title && book.author_id === Number(author_id))
    if (duplicatedBook) {
        throw { message: "Book of the same title for this author already exist ", statusCode: 409 }
    }
    const newBook = { id: nextBookId, title,category,year:Number(year),author_id: Number(author_id) }
    books.push(newBook)
    nextBookId++
    res.status(201).json(newBook)
})

// updating a book using id 
book_router.put("/:id", [param("id").isInt().withMessage("Book id must be a number"),
body("title").isString().trim().notEmpty().withMessage("Title is required and must be a string "),
body("category").isString().trim().notEmpty().withMessage("Category is required and must be a string "),
body("year").isInt().withMessage("Year book  is published must be a number "),
body("author_id").isInt().withMessage("Author id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw { message: "Validation failed", statusCode: 400, errors: errors.array() }
    }
    const id = Number(req.params.id)
  
    const bookIndex = books.findIndex((book) => book.id === id)
    //if the index is -1 then it means there's no author with that id 
    if (bookIndex === -1) {
        throw { message: "No book with the id " + id + " is found", statusCode: 404 }
    }
    const { title, category, year,author_id } = req.body

    //check  if author exists before updating the book
    const author = authors.find((author) => author.id === Number(author_id))

    if (!author) {
        throw { message: "No author found with id " + author_id, statusCode: 404 }
    }

    const updatedBook = { id, title, category, year:Number(year),author_id: Number(author_id) }
    books[bookIndex] = updatedBook
    res.status(200).json(updatedBook)
})

//delete book by id

book_router.delete("/:id", [param("id").isInt().withMessage("Book id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw { message: "Validation failed", statusCode: 400, errors: errors.array() }
    }
    const id = Number(req.params.id)
    const book_to_delete = books.find((book) => book.id === id)

    if (!book_to_delete) {
        throw { message: "No book with the id " + id + " is found", statusCode: 404 }
    }
    books = books.filter((book) => book.id !== id)
    res.status(204).send()

})

export default book_router

