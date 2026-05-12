"use client"

import { Info, Settings, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import CaroSettingDialog from './dialogs/CaroSettingModal';
import CaroGameRulesModal from './dialogs/GameRulesModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CaroGameInfo = () => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isGameRule, setIsGameRule] = React.useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Mobile layout - floating menu button and overlay
    if (isMobile) {
        return (
            <>
                {/* Floating Menu Button */}
                <div className="fixed top-4 right-4 z-[50]">
                    <motion.button
                        onClick={toggleMenu}
                        className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Menu className="h-6 w-6" />
                    </motion.button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                            onClick={closeMenu}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-4 right-4 bg-white rounded-2xl shadow-2xl p-4 min-w-[200px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Game Options</h3>
                                    <button
                                        onClick={closeMenu}
                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setIsGameRule(true);
                                            closeMenu();
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <Info className="h-5 w-5 text-blue-600" />
                                        <span className="text-gray-700 font-medium">Game Rules</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(true);
                                            closeMenu();
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-left"
                                    >
                                        <Settings className="h-5 w-5 text-purple-600" />
                                        <span className="text-gray-700 font-medium">Settings</span>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modals */}
                <CaroSettingDialog open={isSettingsOpen} setOpen={setIsSettingsOpen} />
                <CaroGameRulesModal open={isGameRule} setOpen={setIsGameRule} />
            </>
        );
    }

    // Desktop layout - fixed position buttons
    return (
        <>
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={() => setIsGameRule(prev => !prev)}
                    className="group relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Info className="h-5 w-5" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Game Rules
                    </div>
                </motion.button>

                <motion.button
                    onClick={() => setIsSettingsOpen(prev => !prev)}
                    className="group relative p-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Settings className="h-5 w-5" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Game Settings
                    </div>
                </motion.button>
            </div>

            {/* Modals */}
            <CaroSettingDialog open={isSettingsOpen} setOpen={setIsSettingsOpen} />
            <CaroGameRulesModal open={isGameRule} setOpen={setIsGameRule} />
        </>
    );
};

export default CaroGameInfo;