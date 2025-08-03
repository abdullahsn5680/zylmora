import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, Search, ChevronDown, User, Heart, Plus, X } from 'lucide-react';

export default function ZylmaProductReviews() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedReviews, setLikedReviews] = useState(new Set());
  const [showAddReview, setShowAddReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    productSize: 'Medium',
    productColor: 'Black',
    title: '',
    content: ''
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2025-01-15",
      productSize: "Medium",
      productColor: "Navy Blue",
      title: "Absolutely love this piece!",
      content: "The quality is outstanding and the fit is perfect. I've received so many compliments when wearing this. The fabric feels premium and the stitching is flawless. Definitely worth every penny!",
      helpful: 24,
     
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "2025-01-12",
      productSize: "Large",
      productColor: "Black",
      title: "Great quality, runs slightly small",
      content: "Really impressed with the material and craftsmanship. The design is exactly what I was looking for. Only issue is it runs a bit small, so I'd recommend sizing up. Customer service was excellent when I had questions.",
      helpful: 18,
      
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: 5,
      date: "2025-01-10",
      productSize: "Small",
      productColor: "White",
      title: "Perfect for any occasion",
      content: "This has become my go-to piece! I can dress it up for work or down for weekends. The versatility is amazing and it holds up well after multiple washes. Fast shipping too!",
      helpful: 31,
    
    },
    {
      id: 4,
      name: "David Park",
      rating: 3,
      date: "2025-01-08",
      productSize: "Medium",
      productColor: "Gray",
      title: "Good but not exceptional",
      content: "It's a decent piece but I expected more for the price point. The design is nice but the material feels a bit thin. Not bad, just not what I was hoping for based on the photos.",
      helpful: 12,
     
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 5,
      date: "2025-01-05",
      productSize: "Large",
      productColor: "Rose Gold",
      title: "Exceeded my expectations!",
      content: "I was hesitant to order online but this completely exceeded my expectations. The color is even more beautiful in person and the fit is incredibly flattering. Will definitely be ordering more from Zylma!",
      helpful: 27,
      
    }
  ]);

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
      case 'helpful': return b.helpful - a.helpful;
      default: return 0;
    }
  });

  const toggleLike = (reviewId) => {
    const newLiked = new Set(likedReviews);
    if (newLiked.has(reviewId)) {
      newLiked.delete(reviewId);
    } else {
      newLiked.add(reviewId);
    }
    setLikedReviews(newLiked);
  };

  const handleSubmitReview = async () => {
   
    if (!newReview.name || !newReview.title || !newReview.content) {
      return;
    }
    
    setIsSubmitting(true);

   
    await new Promise(resolve => setTimeout(resolve, 1500));

    const review = {
      id: Math.max(...reviews.map(r => r.id)) + 1,
      name: newReview.name,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      productSize: newReview.productSize,
      productColor: newReview.productColor,
      title: newReview.title,
      content: newReview.content,
      helpful: 0,
     
    };

    setReviews([review, ...reviews]);
    setNewReview({
      name: '',
      rating: 5,
      productSize: 'Medium',
      productColor: 'Black',
      title: '',
      content: ''
    });
    setIsSubmitting(false);
    setShowAddReview(false);
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

  return (
    <section className="py-6 lg:py-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        
       
        <div className="mb-8 flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className=''>  
            <h3 className=" flex gap-2 items-center text-xl lg:text-3xl font-bold text-slate-800 mb-2 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="#FFD700">
  <path d="M24 4l5.09 10.26 11.36 1.65-8.23 8.02 1.94 11.33L24 30.77l-10.16 5.33 1.94-11.33-8.23-8.02 11.36-1.65L24 4z"/>
</svg>
 Customer Reviews</h3>
            <p className="text-sm lg:text-base text-slate-600">
              See what our customers are saying about this product
            </p>
          </div>
          <button
            onClick={() => setShowAddReview(true)}
            className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Review
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
                    <option value="helpful">Most Helpful</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

        
            <div className="space-y-4">
              {sortedReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                
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
                      <div className="flex flex-wrap gap-1 text-xs text-slate-500">
                        <span>{review.productSize}</span>
                        <span>•</span>
                        <span>{review.productColor}</span>
                      </div>
                    </div>
                  </div>

               
                  <div className="mb-3">
                    <h5 className="font-semibold text-slate-800 mb-1 text-sm">{review.title}</h5>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{review.content}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-300 ${
                        likedReviews.has(review.id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${likedReviews.has(review.id) ? 'fill-current' : ''}`} />
                      <span>Helpful ({review.helpful + (likedReviews.has(review.id) ? 1 : 0)})</span>
                    </button>
                    <div className="text-xs text-slate-400">
                      #{review.id}
                    </div>
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