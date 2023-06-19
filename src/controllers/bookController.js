const { default: mongoose } = require('mongoose')
const booksModel= require('../models/bookModel')
const userModel= require('../models/userModel')
const reviewModel= require('../models/reviewModel')
const {isValid}= require('../validation/validator')
const moment= require('moment')
const validator= require('validator')


const createBooks= async (req, res) => {
    try {
        let {title, excerpt, userId, ISBN, 
            category, subcategory}= req.body
    
        if(!isValid(title) || !isValid(excerpt) || !isValid(userId) 
        || !isValid(ISBN) || !isValid(category) || !isValid(subcategory)){
            return res.status(400).send({
                status: false,
                message: 'please provide valid detail'
            })
        }
    
        let userIdValid= mongoose.isValidObjectId(userId)
        if(!userIdValid) return res.status(400).send({
            status: false,
            message: 'please provide valid userId'
        })
    
        let userIdExit= await userModel.findOne({_id: userId, isDeleted : false})
        if(!userIdExit) return res.status(404).send({
            status: false,
            message: 'UserId not exit'
        })

        let isbnIsValid= validator.isISBN(ISBN)
        if(!isbnIsValid) return res.status(400).send({
            status: false,
            message: 'please provide valid isbn'
        })

        req.body.releasedAt= moment().format("YYYY-MM-DD")

        const createBooks= await booksModel.create(req.body)
        
        res.status(201).send({
            status: true,
            data: createBooks
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const getBooks= async (req, res) => {
    try {
        let {userId, category, subcategory}= req.query

        let filterBooks= {isDeleted: false}

        if(userId){
            filterBooks.userId= userId
        }

        if(category){
            filterBooks.category= category
        }

        if(subcategory){
            filterBooks.subcategory= subcategory
        }

        let getBooks= await booksModel.find(filterBooks)
        .select({_id: 1, title: 1, excerpt: 1, userId: 1, 
            category: 1, reviews: 1, releasedAt: 1})
        .sort({title: 1})

        if(getBooks.length === 0) return res.status(404).send({
            status: false,
            message: 'No books found'
        })

        res.status(200).send({
            status: true,
            data: getBooks
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const getBooksById= async (req, res) => {
    try {
        let {bookId}= req.params

        if(!isValid(bookId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide bookId'
        })

        let bookIdExit= await booksModel.findOne({_id: bookId, isDeleted: false}) 
        if(!bookIdExit) return res.status(404).send({
            status: false,
            message: 'bookId not exit'
        })
        bookIdExit = bookIdExit.toObject()
        let reviewsData= await reviewModel.find({bookId: bookIdExit._id})
        
        bookIdExit.reviewsData= reviewsData
        bookIdExit.reviews= reviewsData.length

        res.status(200).send({
            status: true,
            data: bookIdExit
        })
    } catch (error) {
       res.status(500).send({
        status: false,
        error: error.message
       }) 
    }
}

// ********************************************************************************** //

const updateBooks= async (req, res) => {
    try {
        let {bookId}= req.params

        if(!isValid(bookId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide bookId'
        })

        let bookIdExit= await booksModel.findOne({_id: bookId, isDeleted: false})
        if(!bookIdExit) return res.status(404).send({
            status: false,
            message: 'bookId not exit'
        })

        //authorization add here

        let {title, excerpt, ISBN}= req.body

        if(title){
            if(!isValid(title)) {
                return res.status(400).send({
                    status: false,
                    message: 'provide valid title'
                })
            }

            bookIdExit.title= title
        }

        if(excerpt){
            if(!isValid(excerpt)) {
                return res.status(400).send({
                    status: false,
                    message: 'provide valid excerpt'
                })
            }

            bookIdExit.excerpt= excerpt
        }

        if(ISBN){
            if(!validator.isISBN(ISBN)) {
                return res.status(400).send({
                    status: false,
                    message: 'provide valid ISBN'
                })
            }

            bookIdExit.ISBN= ISBN
        }

        bookIdExit.releasedAt= moment().format("YYYY-MM-DD")
        
        const updateBooks= await bookIdExit.save()

        res.status(200).send({
            status: true,
            data: updateBooks
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

// ********************************************************************************** //

const deleteBooksById= async (req, res) => {
    try {
        let {bookId}= req.params

        if(!isValid(bookId)) return res.status(404)
        .send({
            status: false,
            message: 'please provide bookId'
        })

        let bookIdExit= await booksModel.findOne({_id: bookId, isDeleted: false})
        if(!bookIdExit) return res.status(404).send({
            status: false,
            message: 'bookId not exit'
        })

        //authorization add here

        bookIdExit.isDeleted= true
        bookIdExit.deletedAt= new Date()

        await bookIdExit.save()

        res.status(200).send({
            status: true,
            message: ''
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

module.exports = {createBooks, getBooks,  getBooksById, updateBooks, deleteBooksById}