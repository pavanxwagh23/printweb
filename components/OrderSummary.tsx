'use client';

import React from 'react';
import { UploadedFile, PrintConfig } from '@/types';
import { calculatePrice, estimatePrintTime } from '@/utils/pricing';
import { IndianRupee, Clock, FileCheck, Settings as SettingsIcon } from 'lucide-react';

interface OrderSummaryProps {
    files: UploadedFile[];
    config: PrintConfig;
}

export default function OrderSummary({ files, config }: OrderSummaryProps) {
    if (files.length === 0) {
        return null;
    }

    const priceBreakdown = calculatePrice(files, config);
    const totalPages = files.reduce((sum, file) => sum + (file.pages || 1), 0);
    const estimatedTime = estimatePrintTime(totalPages, config);

    return (
        <div className="card space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2 bg-green-100 rounded-lg">
                    <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            </div>

            {/* File Details */}
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Files ({files.length})
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {files.map((file) => (
                        <div key={file.id} className="flex justify-between text-sm">
                            <span className="text-gray-700 truncate max-w-[200px]">{file.name}</span>
                            <span className="text-gray-500">{file.pages || 1} pages</span>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                        <span>Total Pages:</span>
                        <span>{totalPages}</span>
                    </div>
                </div>
            </div>

            {/* Print Configuration Summary */}
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    Configuration
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Copies:</span>
                        <span className="font-medium text-gray-800">{config.copies}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Color Mode:</span>
                        <span className="font-medium text-gray-800">
                            {config.colorMode === 'color' ? 'Color' : 'Black & White'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium text-gray-800">
                            {config.pageSelection === 'all' ? 'All Pages' :
                                config.pageSelection === 'include' ? `Include: ${config.selectedPages}` :
                                    config.pageSelection === 'exclude' ? `Exclude: ${config.selectedPages}` :
                                        'All Pages'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Paper Size:</span>
                        <span className="font-medium text-gray-800">{config.paperSize}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sides:</span>
                        <span className="font-medium text-gray-800">
                            {config.sides === 'single' ? 'Single Side' : 'Double Side'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Detailed Price Breakdown */}
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Price Breakdown
                </h3>
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-4 space-y-3">
                    {/* Rate */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Rate per page ({config.colorMode === 'color' ? 'Color' : 'B&W'})
                        </span>
                        <span className="font-medium text-gray-800">₹{priceBreakdown.pricePerPage.toFixed(2)}</span>
                    </div>

                    {/* Effective pages */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Effective pages
                            {priceBreakdown.effectivePages !== priceBreakdown.totalPages && (
                                <span className="text-xs text-gray-400 ml-1">(from {priceBreakdown.totalPages})</span>
                            )}
                        </span>
                        <span className="font-medium text-gray-800">{priceBreakdown.effectivePages}</span>
                    </div>

                    {/* Sheets */}
                    {config.sides === 'double' && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Sheets (double-sided)</span>
                            <span className="font-medium text-gray-800">{priceBreakdown.sheets}</span>
                        </div>
                    )}

                    {/* Copies */}
                    {config.copies > 1 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Copies</span>
                            <span className="font-medium text-gray-800">×{config.copies}</span>
                        </div>
                    )}

                    <div className="border-t border-blue-200 my-1" />

                    {/* Base print cost */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                            Print cost
                            <span className="text-xs text-gray-400 ml-1">
                                ({priceBreakdown.effectivePages} pages × ₹{priceBreakdown.pricePerPage.toFixed(2)}{config.copies > 1 ? ` × ${config.copies}` : ''})
                            </span>
                        </span>
                        <span className="font-medium text-gray-800">₹{priceBreakdown.basePrice.toFixed(2)}</span>
                    </div>

                    {/* Double-sided savings */}
                    {priceBreakdown.doubleSidedSavings > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-emerald-600">Double-sided savings</span>
                            <span className="font-medium text-emerald-600">−₹{priceBreakdown.doubleSidedSavings.toFixed(2)}</span>
                        </div>
                    )}


                    {/* Total */}
                    <div className="pt-3 mt-1 border-t-2 border-primary-200 flex justify-between">
                        <span className="font-bold text-gray-800 text-lg">Total:</span>
                        <span className="font-bold text-primary-700 text-2xl">₹{priceBreakdown.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Estimated Print Time</p>
                    <p className="font-semibold text-gray-800">{estimatedTime}</p>
                </div>
            </div>
        </div>
    );
}
