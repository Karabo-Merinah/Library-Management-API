import { Router, Request, Response } from "express"
import { param, validationResult } from "express-validator"
import { authors } from "./author_route"
import { books } from "./book_routes"

const author_books_router = Router()

//List all books written by one author

author_books_router.get("/:id/books", [param("id").isInt().withMessage("Author id must be a number")], (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw { message: "Failed Validation", statusCode: 400, errors: errors.array() }
    }
    const id = Number(req.params.id)
    const author = authors.find((author) => author.id === id)

    if (!author) {
        throw { message: "Author not found", statusCode: 404 }
    }

    const authorbooks = books.filter((book) => book.author_id === id)
    return res.json(authorbooks)
})
export default author_books_router