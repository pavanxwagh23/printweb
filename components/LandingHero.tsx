'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface LandingHeroProps {
    onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
    return (
        <div className="text-center space-y-8 py-16 animate-fade-in">
            <div className="flex justify-center">
                <div className="p-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl animate-pulse-slow">
                    <Printer className="w-20 h-20 text-white" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-700 via-blue-600 to-primary-800 bg-clip-text text-transparent leading-tight">
                    Professional Printing
                    <br />
                    Made Simple
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Upload your documents, customize your print settings, and get instant pricing.
                    Professional quality printing delivered fast.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={onGetStarted} className="btn-primary text-lg px-8 py-4">
                    Get Started
                </button>
                <div className="text-sm text-gray-600">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="card text-center hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Instant Quotes</h3>
                    <p className="text-sm text-gray-600">Get real-time pricing as you configure your print job</p>
                </div>
                <div className="card text-center hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl mb-3">🎨</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Full Customization</h3>
                    <p className="text-sm text-gray-600">Control every aspect of your print job</p>
                </div>
                <div className="card text-center hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Secure & Fast</h3>
                    <p className="text-sm text-gray-600">Your files are processed securely and quickly</p>
                </div>
            </div>
        </div>
    );
}
