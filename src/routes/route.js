const express= require('express')
const router= express.Router()
const {createUser, userLogin}= require('../controllers/userController')
const {auth}= require('../middlewares/auth')
const {createBooks, getBooks,  getBooksById, updateBooks, deleteBooksById}= require('../controllers/booksController')
const {createReview, updateReview, deleteReview}= require('../controllers/reviewController')

router.post('/register', createUser)
router.post('/login', userLogin)

router.post('/books', auth, createBooks)
router.get('/books', auth, getBooks)
router.get('/books/:bookId', auth, getBooksById)
router.put('/books/:bookId', auth, updateBooks)
router.delete('/books/:bookId', auth, deleteBooksById)

router.post('/books/:bookId/review', auth, createReview)
router.put('/books/:bookId/review/:reviewId', auth, updateReview)
router.delete('/books/:bookId/review/:reviewId', auth, deleteReview)


module.exports = router

