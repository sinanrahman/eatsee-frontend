import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, Send, CheckCircle } from 'lucide-react';
import { API } from '../utils/api';



const StarRating = ({ value, onChange, size = 28 }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange && onChange(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
            >
                <Star
                    size={size}
                    className={star <= value
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-zinc-600 hover:text-amber-300'}
                />
            </button>
        ))}
    </div>
);

const ReviewCard = ({ review, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-black p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative group"
    >
        <Quote className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" size={50} />
        <div className="flex gap-1 mb-5">
            {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-7 leading-relaxed italic text-sm md:text-base">
            "{review.content}"
        </p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {review.name[0]}
            </div>
            <div>
                <h4 className="font-bold dark:text-white text-sm">{review.name}</h4>
                <p className="text-xs text-gray-500">{review.role || 'Customer'}</p>
            </div>
        </div>
    </motion.div>
);

const ReviewSection = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        API.getReviews().then(data => {
            if (data?.reviews) setReviews(data.reviews);
        }).catch(() => { console.error("Failed to load reviews"); });
    }, []);

    return (
        <section className="section-padding bg-zinc-50 dark:bg-black">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="text-primary font-mono font-bold uppercase tracking-[0.3em] text-xs">Real Stories</span>
                    <h2 className="text-4xl md:text-6xl font-playfair font-black dark:text-white leading-tight tracking-tighter">
                        What Our<br />
                        <span className="text-primary italic">Community Says.</span>
                    </h2>
                </div>

                {/* Review Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...reviews].sort((a, b) => b.rating - a.rating).slice(0, 2).map((review, i) => (
                        <ReviewCard key={review.id} review={review} index={i} />
                    ))}
                    
                    {/* Add Review Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/testimonials', { state: { openForm: true } })}
                        className="bg-primary/5 hover:bg-primary/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[300px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Star size={24} className="text-primary fill-primary/20" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2 font-playfair">Share Your Story</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Tried Eatsee Foods? We'd love to hear about your experience!
                        </p>
                        <div className="mt-6 text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Write a Review <span className="text-xl">→</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
