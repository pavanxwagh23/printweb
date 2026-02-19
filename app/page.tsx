'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import FileUpload from '@/components/FileUpload';
import PrintConfigPanel from '@/components/PrintConfigPanel';
import OrderSummary from '@/components/OrderSummary';
import CheckoutModal from '@/components/CheckoutModal';
import { UploadedFile, PrintConfig } from '@/types';
import { calculatePrice } from '@/utils/pricing';
import { ArrowRight, Printer } from 'lucide-react';

// Dynamically import DocumentPreview and PrintPreview to avoid SSR issues with react-pdf
const DocumentPreview = dynamic(() => import('@/components/DocumentPreview'), {
    ssr: false,
    loading: () => <div className="card flex items-center justify-center h-[400px]"><p className="text-gray-500">Loading preview...</p></div>
});



export default function Home() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [config, setConfig] = useState<PrintConfig>({
        copies: 1,
        colorMode: 'bw',
        pageSelection: 'all',
        paperSize: 'A4',
        orientation: 'portrait',
        sides: 'single',
        pagesPerSheet: 1,
    });

    const priceBreakdown = files.length > 0 ? calculatePrice(files, config) : null;

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const handleOrderConfirm = () => {
        setShowCheckout(false);
        setFiles([]);
        setConfig({
            copies: 1,
            colorMode: 'bw',
            pageSelection: 'all',
            paperSize: 'A4',
            orientation: 'portrait',
            sides: 'single',
            pagesPerSheet: 1,
        });
    };

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="glass-effect sticky top-0 z-40 border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-600 rounded-lg">
                                <Printer className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-blue-600 bg-clip-text text-transparent">
                                PrintWeb
                            </h1>
                        </div>
                        {files.length > 0 && (
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-primary-700">
                                    ₹{priceBreakdown?.total.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8 animate-fade-in">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className={`flex items-center gap-2 ${files.length > 0 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${files.length > 0 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                1
                            </div>
                            <span className="font-medium hidden sm:inline">Upload Files</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center gap-2 ${files.length > 0 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${files.length > 0 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                2
                            </div>
                            <span className="font-medium hidden sm:inline">Configure</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center gap-2 text-gray-400`}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-600">
                                3
                            </div>
                            <span className="font-medium hidden sm:inline">Checkout</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* File Upload — full width */}
                        <FileUpload files={files} onFilesChange={setFiles} />

                        {files.length > 0 && (
                            <>
                                {/* Document Preview + Print Config + Order Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                                    <div className="lg:col-span-3">
                                        <DocumentPreview files={files} config={config} />
                                    </div>
                                    <div className="lg:col-span-2 space-y-6">
                                        <PrintConfigPanel
                                            config={config}
                                            onConfigChange={setConfig}
                                            disabled={files.length === 0}
                                        />
                                        <OrderSummary files={files} config={config} />
                                        <button
                                            onClick={handleCheckout}
                                            className="btn-primary w-full text-lg py-4"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckout && priceBreakdown && (
                <CheckoutModal
                    total={priceBreakdown.total}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleOrderConfirm}
                />
            )}
        </main>
    );
}
