'use client'
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, Search, ChevronDown, User, Heart, Plus, X, Trash2, Award, TrendingUp, MessageSquare } from 'lucide-react';
import { safeFetch } from '@/Utils/safeFetch';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
import { useLoader } from '@/app/Provider/loader/loaderProvider';

export default function ZylmaProductReviews({prop}) {
  const {showLoader, hideLoader} = useLoader();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const uid = prop?.uid;
  const pid = prop?.pid;
  const {showAlert} = useAlert();
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    title: '',
    content: ''
  });

  const [reviews, setReviews] = useState([]);

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
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
    setShowAddReview(false);
    if (!newReview.name || !newReview.title || !newReview.content || !pid || !uid) {
      if(!newReview.name || !newReview.title || !newReview.content || !pid) {
        showAlert.error("Please provide all fields");
      } else {
        handelLogin();
      }
      hideLoader();
      return;
    }
    newReview.pid = pid;
    newReview.uid = uid;
    try {
      const res = await safeFetch('/api/Review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview), 
      });
      setReviews(res);
      hideLoader();
      showAlert.success('Review submitted successfully');
    } catch (error) {
      hideLoader();
      showAlert.error('Unable to submit review');
      console.log(error);
    }
    setNewReview({ name: '', rating: 5, title: '', content: ''});
  };

  const renderStars = (rating, size = 'w-4 h-4', interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
        } ${interactive ? 'cursor-pointer hover:text-amber-400 hover:scale-110 transition-all duration-200' : ''}`}
        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };

  useEffect(() => {
    async function getData() {
      try {
        const params = new URLSearchParams();
        params.set('pid', pid);
        const query = params.toString();
        const res = await safeFetch(`/api/Review?${query}`, {}, 0);
        if (!res) {
          throw new Error("Failed to fetch reviews");
        }
        setReviews(res);
      } catch (err) {
        console.error("Caught error:", err.message);
        return null;
      }
    }
    getData();
  }, []);

  const handledelete = async(id, uid) => {
    showLoader();
    const params = new URLSearchParams();
    params.set('id', id);
    params.set('uid', uid);
    const query = params.toString();
    try {
      const res = await safeFetch(`/api/Review?${query}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      hideLoader();
      showAlert.success("Review has been deleted successfully");
      setReviews((prev) => prev.filter(r => r._id !== id));
    } catch (error) {
      hideLoader();
      showAlert.error("Unable to delete the review");
      console.log(error);
    }
  };

  const handelLogin = () => {
    showAlert.confirm('You need to be logged in to continue. Would you like to login now?',
      () => {router.push('/Authentication')}, 
      {
        title: "Login Required",
        confirmText: "Login",
        cancelText: "Cancel",
        onCancel: () => {console.log('User cancel the action')}
      }
    );
  };

  const toggleExpanded = (id) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
         
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-1">  
            <h3 className="flex gap-3 items-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 transition-all"> 
              <div className="bg-amber-400 p-2 rounded-xl shadow-lg">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 fill-slate-900" />
              </div>
              Customer Reviews
            </h3>
            <p className="text-sm sm:text-base text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Real experiences from verified customers
            </p>
          </div>
          
          <button
            onClick={() => setShowAddReview(true)}
            className="relative z-1 bg-amber-400 text-slate-900 hover:bg-amber-300 hover:scale-105 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl whitespace-nowrap self-start sm:self-auto group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Write Review</span>
          </button>
        </div>

       
        {showAddReview && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-1 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-2 rounded-xl">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Write a Review</h4>
                </div>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl p-2 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {renderStars(newReview.rating, 'w-8 h-8', true, (rating) => setNewReview({...newReview, rating}))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    required
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Summarize your experience"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Experience</label>
                  <textarea
                    required
                    rows={5}
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm resize-none transition-all"
                    placeholder="Share your detailed experience with this product..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl hover:from-amber-500 hover:to-amber-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
       
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 lg:p-8 space-y-6 sticky top-4">
              
              
              <div className="text-center pb-6 border-b border-slate-200">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-2xl mb-4">
                  <div className="text-4xl font-bold text-white">
                    {averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="flex justify-center mb-3">
                  {renderStars(Math.round(averageRating), 'w-6 h-6')}
                </div>
                <p className="text-slate-600 font-medium">Based on {reviews.length} reviews</p>
              </div>

             
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Rating Breakdown
                </h4>
                {ratingDistribution.map((count, index) => {
                  const rating = 5 - index;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3 group">
                      <span className="w-6 text-slate-700 font-medium text-sm">{rating}</span>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500 ease-out group-hover:from-amber-500 group-hover:to-amber-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-slate-600 text-right font-medium text-sm">{count}</span>
                    </div>
                  );
                })}
              </div>

           
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h5 className="font-semibold text-slate-800 text-sm">Verified Reviews</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All reviews are from verified customers who purchased this product
                </p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-2 space-y-6">
            
            
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                
              
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>

              
                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">⭐ 5 Stars</option>
                    <option value="4">⭐ 4 Stars</option>
                    <option value="3">⭐ 3 Stars</option>
                    <option value="2">⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>

              
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="newest">🕐 Newest</option>
                    <option value="oldest">📅 Oldest</option>
                    <option value="highest">⬆️ Highest</option>
                    <option value="lowest">⬇️ Lowest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            
            <div className="space-y-4">
              {sortedReviews.slice(0, 3).map((review) => {
                const isExpanded = expandedReviews.has(review._id);
                const shouldTruncate = review.content.length > 200;
                
                return (
                  <div key={review._id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    
                      <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-slate-800 text-lg">{review.name}</h4>
                          {review.rating === 5 && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">Top Rated</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex gap-1">
                            {renderStars(review.rating, 'w-4 h-4')}
                          </div>
                          <span className="text-sm text-slate-500 font-medium">
                            {new Date(review.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      {review?.uid == uid && (
                        <button 
                          onClick={() => handledelete(review._id, uid)} 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      )}
                    </div>

                 
                    <div className="mb-4 ml-16">
                      <h5 className="font-bold text-slate-800 mb-2 text-base">{review.title}</h5>
                      <p className="text-slate-600 leading-relaxed">
                        {shouldTruncate && !isExpanded 
                          ? `${review.content.substring(0, 200)}...` 
                          : review.content
                        }
                      </p>
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpanded(review._id)}
                          className="text-amber-600 hover:text-amber-700 font-semibold text-sm mt-2 flex items-center gap-1 group"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            
            {reviews.length > 3 && (
              <div className="text-center pt-6">
                <button className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto">
                  <MessageSquare className="w-5 h-5" />
                  View All {reviews.length} Reviews
                </button>
              </div>
            )}

           
            {sortedReviews.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">No Reviews Found</h4>
                  <p className="text-slate-500 max-w-md">
                    Try adjusting your search or filter criteria to find what you're looking for
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}