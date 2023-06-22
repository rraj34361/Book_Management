const { default: mongoose } = require('mongoose')
const bookModel= require('../models/bookModel')
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
    
        let userIdExit= await userModel.findOne({_id: userId})
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

        const createBooks= await bookModel.create(req.body)
        
     return   res.status(201).send({
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

        let getBooks= await bookModel.find(filterBooks)
        .select({_id: 1, title: 1, excerpt: 1, userId: 1, 
            category: 1, reviews: 1, releasedAt: 1})
        .sort({title: 1})

        if(getBooks.length === 0) return res.status(404).send({
            status: false,
            message: 'No books found'
        })

     return   res.status(200).send({
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

        let bookIdExist= await bookModel.findOne({_id: bookId, isDeleted: false}) 
        if(!bookIdExist) return res.status(404).send({
            status: false,
            message: 'bookId not exit'
        })
        bookIdExist = bookIdExist.toObject()
        let reviewsData= await reviewModel.find({bookId: bookIdExist._id, isDeleted : false})
        
        bookIdExist.reviewsData= reviewsData
        bookIdExist.reviews= reviewsData.length

        res.status(200).send({
            status: true,
            data: bookIdExist
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

        let bookIdExist= await bookModel.findOne({_id: bookId, isDeleted: false})
        if(!bookIdExist) return res.status(404).send({
            status: false,
            message: 'book not exit'
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

            bookIdExist.title = title || bookIdExist.title
        }

        if(excerpt){
            if(!isValid(excerpt)) {
                return res.status(400).send({
                    status: false,
                    message: 'provide valid excerpt'
                })
            }

            bookIdExist.excerpt = excerpt  || bookIdExist.excerpt
        }

        if(ISBN){
            if(!validator.isISBN(ISBN)) {
                return res.status(400).send({
                    status: false,
                    message: 'provide valid ISBN'
                })
            }

            bookIdExist.ISBN = ISBN || bookIdExist.ISBN
        }

        bookIdExist.releasedAt= moment().format("YYYY-MM-DD")
        
        const updateBooks= await bookIdExist.save()

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

        let bookIdExist= await bookModel.findOne({_id: bookId, isDeleted: false})
        if(!bookIdExist) return res.status(404).send({
            status: false,
            message: 'book not exit'
        })

        //authorization add here

        bookIdExist.isDeleted= true
        bookIdExist.deletedAt= new Date()

        await bookIdExist.save()

        res.status(200).send({
            status: true,
            message: 'book deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message
        })
    }
}

module.exports = {createBooks, getBooks,  getBooksById, updateBooks, deleteBooksById}