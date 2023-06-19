const express= require('express')
const router= express.Router()
const {createUser, userLogin}= require('../controllers/userController')
const {createBooks, getBooks, getBooksById, 
    updateBooks, deleteBooksById}= require('../controllers/bookController')

router.post('/register', createUser)
router.post('/login', userLogin)

router.post('/books', createBooks)
router.get('/books', getBooks)
router.get('/books/:bookId', getBooksById)
router.put('/books/:bookId', updateBooks)
router.delete('/books/:bookId', deleteBooksById)