import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API } from '../utils/api';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Star, MessageSquare, Users, ThumbsUp, Quote, Send, CheckCircle } from 'lucide-react';



const AnimatedCounter = ({ end, suffix = "", isFloat = false }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentCount = start + (end - start) * easeOut;

                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setCount(end);
                }
            };

            requestAnimationFrame(updateCounter);
        }
    }, [inView, end]);

    const displayValue = isFloat ? count.toFixed(1) : Math.round(count).toLocaleString();

    return <span ref={ref}>{displayValue}{suffix}</span>;
};

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

const Testimonials = () => {
    const location = useLocation();
    const formRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(location.state?.openForm || false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (location.state?.openForm && formRef.current) {
            setTimeout(() => {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location.state]);

    useEffect(() => {
        API.getReviews().then(data => {
            if (data?.reviews) setReviews(data.reviews);
        }).catch(() => { console.error("Failed to load reviews"); });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !content) return setError('Name and review are required');
        setLoading(true);
        setError('');

        try {
            const result = await API.submitReview({ name, role, content, rating });
            if (result.id) {
                // Add the newly created review to the UI instantly
                setReviews([result, ...reviews]);
                setSuccess(true);
                setName(''); setRole(''); setContent(''); setRating(5);
                setError('');
            } else {
                setError(result.error || 'Submission failed');
            }
        } catch (err) {
            console.error("Review submission error:", err);
            setError(`Error: ${err.message || 'Could not connect'}`);
        } finally {
            setLoading(false);
        }
    };



    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    return (
        <div className="pt-24 pb-20">
            {/* Header */}
            <section className="section-padding overflow-hidden">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary font-bold uppercase tracking-widest"
                    >
                        Voice of Customers
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-playfair font-black dark:text-white"
                    >
                        Trusted by <span className="text-primary italic">Thousands.</span>
                    </motion.h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                        From individual households to large retailers, we have built a legacy based on trust and the authentic taste of tradition.
                    </p>
                </div>
            </section>

            {/* Dynamic All Reviews Grid */}
            <section className="section-padding bg-zinc-50 dark:bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className={showAll ? 'max-h-[70vh] overflow-y-auto overscroll-contain pr-4' : ''}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
                            {reviews.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 py-10">No reviews yet. Be the first to share your experience!</div>
                            ) : displayedReviews.map((t, i) => (
                            <motion.div
                                key={t.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 3) * 0.1 }}
                                className="bg-white dark:bg-black p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative group"
                            >
                                <Quote className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" size={50} />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(t.rating || 5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed italic text-sm md:text-base">
                                    "{t.content}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold dark:text-white text-sm">{t.name}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.role || 'Customer'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </div>

                    {reviews.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="px-8 py-3 rounded-full border-2 border-primary/20 hover:border-primary text-primary font-bold transition-all hover:bg-primary/5"
                            >
                                {showAll ? 'Show Less' : `View All ${reviews.length} Reviews`}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Write a Review CTA */}
            <section ref={formRef} className="section-padding bg-zinc-50 dark:bg-black pt-0 pb-20">
                <div className="max-w-4xl mx-auto relative">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!showForm && !success && (
                                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="space-y-3 text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-playfair font-bold dark:text-white">
                                            Tried Eatsee Foods?
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            We'd love to hear about your experience!
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="shrink-0 px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary/30 flex items-center gap-3"
                                    >
                                        <Star size={18} className="fill-white" />
                                        Write a Review
                                    </button>
                                </motion.div>
                            )}

                            {showForm && !success && (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6 relative z-10"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold dark:text-white">Share Your Review</h3>
                                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Your Rating *</p>
                                        <StarRating value={rating} onChange={setRating} size={32} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Your name"
                                                className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Your Role</label>
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={e => setRole(e.target.value)}
                                                placeholder="e.g. Homemaker, Shop Owner"
                                                className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Your Review *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                            placeholder="Tell us about your experience with Eatsee Foods..."
                                            className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-primary dark:text-white resize-none"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2">Reviews will appear after our team approves them.</p>
                                </motion.form>
                            )}

                            {success && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-4 py-8"
                                >
                                    <CheckCircle size={56} className="mx-auto text-primary" />
                                    <h3 className="text-2xl font-bold dark:text-white">Thank you for your review!</h3>
                                    <p className="text-gray-500">Your feedback has been added.</p>
                                    <button onClick={() => { setSuccess(false); setShowForm(false); }} className="px-8 py-3 bg-primary text-white font-bold rounded-xl">
                                        Done
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section-padding bg-primary text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {[
                        { icon: Users, end: 10000, suffix: "+", label: "Happy Families" },
                        { icon: ThumbsUp, end: 99, suffix: "%", label: "Satisfaction Rate" },
                        { icon: MessageSquare, end: 50, suffix: "+", label: "Shop Partners" },
                        { icon: Star, end: 4.9, suffix: "/5", isFloat: true, label: "Average Rating" },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-4">
                            <stat.icon size={40} className="mx-auto opacity-30" />
                            <h3 className="text-4xl font-black">
                                <AnimatedCounter end={stat.end} suffix={stat.suffix} isFloat={stat.isFloat} />
                            </h3>
                            <p className="font-bold text-white/70 uppercase text-xs tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Testimonials;
