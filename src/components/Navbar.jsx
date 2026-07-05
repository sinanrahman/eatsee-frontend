import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, MessageCircle } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_URL = `https://wa.me/919562496164?text=${encodeURIComponent("Hi Eatsee Foods, I would like to place an order.")}`;

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [show, setShow] = useState(true);
    const location = useLocation();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShow(false);
            } else {
                setShow(true);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <div className={`fixed top-6 left-0 w-full z-50 transition-transform duration-500 ${show ? 'translate-y-0' : '-translate-y-[200%]'}`}>
            <nav className="max-w-6xl mx-auto w-[95%] bg-black/95 dark:bg-black/95 text-white backdrop-blur-md shadow-2xl py-3 px-4 md:px-6 rounded-full border border-white/10 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center group">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src="/image/logo.png" alt="Eatsee Foods Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === link.path ? 'text-white' : 'text-gray-400'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions (Right) */}
                <div className="hidden lg:flex items-center gap-4">
                    <DarkModeToggle />
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#20b859] transition-all flex items-center gap-2 shadow-lg"
                    >
                        <MessageCircle size={16} /> Order Now
                    </a>
                </div>

                {/* Mobile Toggle */}
                <div className="flex lg:hidden items-center gap-4">
                    <DarkModeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-0 left-0 w-full h-screen bg-white dark:bg-black z-[60] flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <Link to="/" className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img src="/image/logo.png" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="p-2 dark:text-white">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.07 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`text-3xl font-bold flex items-center justify-between group ${location.pathname === link.path ? 'text-primary' : 'text-gray-900 dark:text-white'}`}
                                    >
                                        {link.name}
                                        <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.07 }}
                                className="mt-8"
                            >
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl text-xl font-bold hover:bg-[#20b859] transition-all"
                                >
                                    <MessageCircle size={24} /> Order on WhatsApp
                                </a>
                            </motion.div>
                        </div>

                        <div className="mt-auto flex items-center justify-center gap-6 text-gray-500">
                            <span className="text-sm">9562496164</span>
                            <span className="text-sm">Omassery, Kerala</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
