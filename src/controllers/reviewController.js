const reviewModel = require('./models/Review');
const bookModel = require('./models/Book');
const { default: mongoose } = require('mongoose');
const { isValid } = require('../validation/validator');

// Assuming you're using an Express route handler
const createReview =  async (req, res) => {
  let  { bookId, reviewedBy, rating, review } = req.body;

  try {
     
 if(!isValid(bookId)){
    return res.status(400).send({status : false, message : "missing bookId" })
 }
     
     
 if(reviewedBy){
   if(!isValid(reviewedBy)){
    return res.status(400).send({status : false, message : "reviewedBy should be a name only" })
   }
 }
   reviewedBy = reviewedBy.trim()

     
 if(typeof rating !="number"){
    return res.status(400).send({status : false, message : "rating should be  a number" })
 }
     
     
 if(rating>5 || rating<1){
    return res.status(400).send({status : false, message : "rating should be between 1 to 5 only" })
 }
 
    
 if(review){
    if(!isValid(review)){
     return res.status(400).send({status : false, message : "review should be string only" })
    }
  }

  review = review.trim()

  bookId = bookId.trim()
 if(!mongoose.isValidObjectId(bookId) ){
    return res.status(400).send({status : false, message : "invalid bookId" })
 }
       
    // Check if the book exists and is not deleted
    let  book = await bookModel.findOne({ _id: bookId, isDeleted: false })    //not exists it would give error
    
    if (!book) {
      return res.status(404).json({ status : false , message: 'Book not found' });
    }
    book = book.toObject()
    book.reviews += 1;
    await book.save()
    const reviewer = reviewModel.create({ bookId, reviewedBy,reviewedAt : Date.now(), rating, review } )
      book.reviewsData = reviewer
    return res.status(201).json({status : true,  message: 'Review added successfully', data : book });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status : false , error: error.message });
  }
};


const updateReview = async (req,res)=>{
    try {
        const { bookId, reviewId } = req.params;


        let  {reviewedBy, rating, review } = req.body;
        
 if(reviewedBy){
    if(!isValid(reviewedBy)){
     return res.status(400).send({status : false, message : "reviewedBy should be a name only" })
    }
  }
    reviewedBy = reviewedBy.trim()

   if(rating){    
 if(typeof rating !="number"){
    return res.status(400).send({status : false, message : "rating should be  a number" })
 }
   }
    
 if(rating>5 || rating<1){
    return res.status(400).send({status : false, message : "rating should be between 1 to 5 only" })
 }
       
 if(review){
    if(!isValid(review)){
     return res.status(400).send({status : false, message : "reviewedBy should be a name only" })
    }
  }
  review = review.trim()

  const book = await bookModel.findOne({ _id: bookId, isDeleted: false }) 
  const reviewer = await reviewModel.findOne({ _id: reviewId, isDeleted: false });

if (!book) {
  return res.status(404).send({status:false,  message: 'Book not found' });
}
const leanBook = book.toObject()
if (!reviewer) {
  return res.status(404).send({status:false,  message: 'reviewer not found' });
}
reviewer.review = review;
reviewer.rating = rating;
reviewer.reviewerName = reviewedBy;
reviewer.reviewedAt = Date.now()

await reviewer.save()

const Allreviewer = reviewModel.find({bookId,isDeleted : false})
leanBook.reviewsData = Allreviewer
 return res.status(200).send({status:true, message : 'Book list', data : leanBook})
    } catch (error) {
        console.log(error) ;   
        return res.status(500).send({status : false , error : error.message})
    }
}



const deleteReview = async(req,res)=>{
  try{  const { bookId, reviewId } = req.params;

    const book = await bookModel.findOne({_id : bookId, isDeleted : false})

    if(!book) return res.status(404).send({status : false , message : " book with this id doesn't exists"})

    const review = await reviewModel.findOne({_id : reviewId, isDeleted : false})

    if(!review) return res.status(404).send({status : false , message : " review with this id doesn't exists"})
      book.reviews--
    await book.save()
   review.isDeleted = true
    await review.save()

    return res.status(200).send({status :  true, message : "review deleted successfully"})

}catch(err){
  console.log(err)
  return res.status(500).send({status:false,  error : err.message})
}
}


module.exports =  {createReview,updateReview,deleteReview}