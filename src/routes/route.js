const express= require('express')
const router= express.Router()
const {createUser, userLogin}= require('../controllers/userController')
const {createBooks, getBooks, getBooksById, updateBooks, deleteBooksById}= require('../controllers/bookController')
const {createReview,updateReview,deleteReview} = require('../controllers/reviewController')
const {auth} = require('../middleware/auth')

//=======================user routes======================
router.post('/register', createUser)
router.post('/login', userLogin)


//======================= Book routes======================

router.post('/books',auth, createBooks)
router.get('/books',auth, getBooks)
router.get('/books/:bookId',auth, getBooksById)
router.put('/books/:bookId',auth, updateBooks)
router.delete('/books/:bookId',auth, deleteBooksById)


// ===================== review routes ====================

router.post('/books/:bookId/review', auth, createReview)
router.put('/books/:bookId/review/:reviewId', auth, updateReview)
router.delete('/books/:bookId/review/:reviewId', auth, deleteReview)

module.exports = router


 