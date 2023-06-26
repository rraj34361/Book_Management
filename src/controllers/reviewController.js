const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel');
const { default: mongoose } = require('mongoose');
const { isValid } = require('../validation/validator');

// Assuming you're using an Express route handler
const createReview =  async (req, res) => {
  try {
  let {bookId} = req.params
  let  {reviewedBy, rating, review} = req.body;

 if(!isValid(bookId)){
    return res.status(404)
    .send({status : false, message : "missing bookId" })
 }

 if(!mongoose.isValidObjectId(bookId) ){
  return res.status(400)
  .send({status : false, message : "invalid bookId" })
}
    // Check if the book exists and is not deleted
 let book = await bookModel
    .findOne({ _id: bookId, isDeleted: false })    //not exists it would give error
    
 if (!book) {
      return res.status(404)
      .json({
        status : false ,
        message: 'Book not found' 
      });
    }

        
 if(reviewedBy){
   if(!isValid(reviewedBy)){
    return res.status(400)
    .send({
      status : false, 
      message : "reviewedBy should be a name only" 
    })
   }
 }
   
 if(typeof rating !="number"){
    return res.status(400)
    .send({status : false, message : "rating should be  a number" })
 }
         
 if(rating>5 || rating<1){
    return res.status(400)
    .send({
      status : false, 
      message : "rating should be between 1 to 5 only" 
    })
 }
   
 if(review){
    if(!isValid(review)){
     return res.status(400)
     .send({
      status : false, 
      message : "review should be string only" 
    })
    }
  }
   
//     // Check if the book exists and is not deleted
//  let book = await bookModel
//     .findOne({ _id: bookId, isDeleted: false })    //not exists it would give error
    
//  if (!book) {
//       return res.status(404)
//       .json({
//         status : false ,
//         message: 'Book not found' 
//       });
//     }

    book.reviews += 1;
    await book.save()
    book = book.toObject()

    const reviewer = await reviewModel
    .create({ bookId, reviewedBy,reviewedAt : Date.now(), rating, review } )

    book.reviewsData = reviewer

    return res.status(201)
    .json({
      status : true,  
      message: 'Review added successfully', 
      data : book 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ 
      status : false , 
      error: error.message 
    });
  }
};

// ********************************************************************************** //

const updateReview = async (req,res)=>{
  try {
   const { bookId, reviewId } = req.params;

   if(!mongoose.isValidObjectId(bookId) ){
    return res.status(400)
    .send({status : false, message : "invalid bookId" })
  }

  if(!mongoose.isValidObjectId(reviewId) ){
    return res.status(400)
    .send({status : false, message : "invalid reviewId" })
  }
  const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
  if (!book) {
    return res.status(404).send({
      status:false,  message: 'Book not found' 
    });
  }

//   //authorization
//   if(req["x-api-key"].userId != book.userId){
//     return res.status(403).send({
//         status: false,
//         message: "unauthorized, userId not same"
//     })
// }

  const leanBook = book.toObject()

  const reviewer = await reviewModel
  .findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
  if (!reviewer) {
  return res.status(404).send({
    status:false,  message: 'reviewer not found' 
  });
 }  

  let {reviewedBy, rating, review} = req.body;
        
  if(Object.keys(req.body).length === 0){
      return res.status(400).send({
        status: false,
        message: "please provide detail for update"
      })
    }
        
 if(reviewedBy){
    if(!isValid(reviewedBy)){
     return res.status(400).send({
      status : false, 
      message : "reviewedBy should be a name only" 
    })
    }
    reviewer.reviewedBy = reviewedBy
  }
     
  if(rating){    
    if(typeof rating !="number"){
    return res.status(400).send({
      status : false, 
      message : "rating should be  a number" 
    })
   }
   if(rating>5 || rating<1){
    return res.status(400).send({
      status : false, 
      message : "rating should be between 1 to 5 only" 
    })
   }
   reviewer.rating = rating
 }
         
 if(review){
    if(!isValid(review)){
     return res.status(400).send({
      status : false, 
      message : "reviewedBy should be a name only" 
    })
    }
    reviewer.review = review
  }
 
 reviewer.reviewedAt = Date.now()

 const updateReview= await reviewer.save()
 
 leanBook.reviewsData = updateReview
 return res.status(200).send({
  status:true, message : 'Book list', 
  data : leanBook   
})
  } catch (error) {   
    return res.status(500).send({
      status : false , 
      error : error.message
    })
  }
}

// ********************************************************************************** //

const deleteReview = async(req,res)=>{
  try{  
    const {bookId, reviewId} = req.params;

    if(!mongoose.isValidObjectId(bookId) ){
      return res.status(404)
      .send({status : false, message : "invalid bookId" })
    }
  
    if(!mongoose.isValidObjectId(reviewId) ){
      return res.status(404)
      .send({status : false, message : "invalid reviewId" })
    }

    const book = await bookModel.findOne({_id : bookId, isDeleted : false})
    if(!book) return res.status(404).send({
      status : false , 
      message : " book with this id doesn't exists"
    })

  //   //authorization
  // if(req["x-api-key"].userId != book.userId){
  //   return res.status(403).send({
  //       status: false,
  //       message: "unauthorized, userId not same"
  //   })
  // }

    const review = await reviewModel
    .findOne({_id : reviewId, bookId: bookId, isDeleted : false})
    if(!review) return res.status(404).send({
      status : false , 
      message : " review with this id doesn't exists"
    })

    book.reviews = book.reviews - 1
    await book.save()
    review.isDeleted = true
    await review.save()

    return res.status(200).send({
      status :  true, 
      message : "review deleted successfully"
    })

}catch(err){
  return res.status(500).send({
    status:false,  
    error : err.message
  })
}
}


module.exports =  {createReview, updateReview, deleteReview}