'use client'
import React, { useState,useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, Search, ChevronDown, User, Heart, Plus, X, Trash2 } from 'lucide-react';
import { safeFetch } from '@/Utils/safeFetch';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
import { useLoader } from '@/app/Provider/loader/loaderProvider';
export default function ZylmaProductReviews({prop}) {
  const {showLoader,hideLoader}=useLoader();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uid = prop?.uid;
  const pid = prop?.pid;
  const {showAlert} =useAlert();
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    title: '',
    content: ''
  });

  const [reviews, setReviews] = useState([]);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter !== 'all' && review.rating !== parseInt(selectedFilter)) return false;
    if (searchTerm && !review.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !review.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
   
      default: return 0;
    }
  });



  const handleSubmitReview = async () => {
   
   showLoader();
    setShowAddReview(false)
    if (!newReview.name || !newReview.title || !newReview.content  || !pid   || !uid ) {
        if(!newReview.name || !newReview.title || !newReview.content  || !pid ){
      showAlert.error("PLease provide all fileds")
        }else{
          handelLogin();
        }
       hideLoader();
    
  return
    }
    newReview.pid =pid;
    newReview.uid =uid;
try {
  const res = await safeFetch('/api/Review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview), 
      });
 setReviews(res)
      hideLoader();
     showAlert.success('Review submitted successfuly')
  
    
} catch (error) {
    hideLoader();
showAlert.error('Unable to submit review')
  console.log(err);
}
  
    setNewReview({ name: '',
    rating: 5,
    title: '',
    content: '',})
  };

  const renderStars = (rating, size = 'w-4 h-4', interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };
   useEffect(()=>{
    async function getData() {
  try {
    const params = new URLSearchParams();
params.set('pid', pid);
const  query = params.toString();
        const res = await safeFetch(`/api/Review?${query}`,{},0);

    if (!res) {
      
      throw new Error("Failed to fetch reviews");
    }

    const data = res
   setReviews(data)
  } catch (err) {
    console.error("Caught error:", err.message);
    return null;
  }
}
getData();
   },[])
const handledelete =async(id,uid)=>{
  showLoader();
      const params = new URLSearchParams();
  params.set('id', id);
  params.set('uid',uid)
const  query = params.toString();
try {
  const res = await safeFetch(`/api/Review?${query}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
         
      });
     hideLoader();
    showAlert.success("Review has been deleted successfully")
  setReviews((prev) => prev.filter(r => r._id !== id)) 


} catch (error) {
    hideLoader();
 showAlert.error("Unable to delete the review")
  console.log(err);
}
}
    const handelLogin=()=>{
    showAlert.confirm('You need to be logged in to continue. Would you like to login now?',
  () => {router.push('/Authentication')}, 
  {
    title: "Login Required",
    confirmText: "Login",
    cancelText: "Cancel",
    onCancel: () => {console.log('User cancel the action')}
  })
   }
  return (
    <section className="py-6 lg:py-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        
       
       <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-100">
  <div className="">  
    <h3 className="flex gap-2 items-center text-lg sm:text-xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2 transition-colors"> 
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        className="sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex-shrink-0" 
        viewBox="0 0 48 48" 
        fill="#FFD700"
      >
        <path d="M24 4l5.09 10.26 11.36 1.65-8.23 8.02 1.94 11.33L24 30.77l-10.16 5.33 1.94-11.33-8.23-8.02 11.36-1.65L24 4z"/>
      </svg>
      Customer Reviews
    </h3>
    <p className="text-xs sm:text-sm lg:text-base text-slate-600">
      See what our customers are saying about this product
    </p>
  </div>
  
  <button
    onClick={() => setShowAddReview(true)}
    className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-md font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg whitespace-nowrap self-start sm:self-auto"
  >
    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
    <span className="hidden xs:inline">Add Review</span>
    <span className="xs:hidden">Add</span>
  </button>
</div>

   
        {showAddReview && (
          <div className="fixed inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-800">Write a Review</h4>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md p-1 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm transition-all"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {renderStars(newReview.rating, 'w-6 h-6', true, (rating) => setNewReview({...newReview, rating}))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm transition-all"
                    placeholder="Review title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm resize-none transition-all"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-all duration-300 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 space-y-4 lg:space-y-6 hover:shadow-lg transition-all duration-300">
              
           
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating), 'w-4 h-4 lg:w-5 lg:h-5')}
                </div>
                <p className="text-slate-600 text-sm">Based on {reviews.length} reviews</p>
              </div>

            
              <div className="space-y-2">
                {ratingDistribution.map((count, index) => {
                  const rating = 5 - index;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-4 text-slate-600">{rating}</span>
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 lg:h-2">
                        <div 
                          className="bg-yellow-400 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-6 text-slate-600 text-right text-xs lg:text-sm">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            
           
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-3">
            
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                  />
                </div>

              
                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-md px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

               
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-md px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

        
            <div className="space-y-4">
              {sortedReviews.slice(0, 3).map((review) => (
                <div key={review._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800 truncate">{review.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating, 'w-3 h-3')}
                        <span className="text-xs text-slate-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                     
                    </div>
                   {review?.uid==uid &&<div onClick={()=>handledelete(review._id,uid)} className="flex text-red-600"><Trash2 width={22}/></div>}
                  </div>

               
                  <div className="mb-3">
                    <h5 className="font-semibold text-slate-800 mb-1 text-sm">{review.title}</h5>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{review.content}</p>
                  </div>

                
                </div>
              ))}
            </div>

       
            {reviews.length > 3 && (
              <div className="text-center pt-4">
                <button className="bg-slate-100 hover:bg-slate-800 text-slate-800 hover:text-white px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg">
                  View All {reviews.length} Reviews
                </button>
              </div>
            )}

            {sortedReviews.length === 0 && (
              <div className="flex justify-center items-center h-full py-12">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🔍</div>
                  <h4 className="text-xl font-semibold text-slate-800">No Reviews Found</h4>
                  <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}