'use client';

import React from 'react';
import { PrintConfig } from '@/types';
import { Settings, Palette, FileText, Maximize2, Layers } from 'lucide-react';

interface PrintConfigPanelProps {
    config: PrintConfig;
    onConfigChange: (config: PrintConfig) => void;
    disabled?: boolean;
}

export default function PrintConfigPanel({ config, onConfigChange, disabled }: PrintConfigPanelProps) {
    const updateConfig = (updates: Partial<PrintConfig>) => {
        onConfigChange({ ...config, ...updates });
    };

    return (
        <div className="card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2 bg-primary-100 rounded-lg">
                    <Settings className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Print Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Copies */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Number of Copies</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={config.copies}
                        onChange={(e) => updateConfig({ copies: parseInt(e.target.value) || 1 })}
                        disabled={disabled}
                        className="input-field"
                    />
                </div>

                {/* Color Mode */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateConfig({ colorMode: 'bw' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.colorMode === 'bw'
                                ? 'bg-gray-800 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Black & White
                        </button>
                        <button
                            onClick={() => updateConfig({ colorMode: 'color' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.colorMode === 'color'
                                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Color
                        </button>
                    </div>
                </div>

                {/* Page Selection */}
                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Page Selection
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <button
                            onClick={() => updateConfig({ pageSelection: 'all', selectedPages: '' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.pageSelection === 'all'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Pages
                        </button>
                        <button
                            onClick={() => updateConfig({ pageSelection: 'include' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.pageSelection === 'include'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Include Pages Only
                        </button>
                        <button
                            onClick={() => updateConfig({ pageSelection: 'exclude' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.pageSelection === 'exclude'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Exclude Pages
                        </button>
                    </div>
                    {(config.pageSelection === 'include' || config.pageSelection === 'exclude') && (
                        <div className="animate-slide-up">
                            <input
                                type="text"
                                value={config.selectedPages || ''}
                                onChange={(e) => updateConfig({ selectedPages: e.target.value })}
                                placeholder={config.pageSelection === 'include'
                                    ? "e.g., 1-5, 8, 10 (only these will print)"
                                    : "e.g., 3, 7-9 (these will be skipped)"}
                                disabled={disabled}
                                className="input-field mt-2"
                            />
                        </div>
                    )}
                </div>

                {/* Paper Size */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" />
                        Paper Size
                    </label>
                    <select
                        value={config.paperSize}
                        onChange={(e) => updateConfig({ paperSize: e.target.value as PrintConfig['paperSize'] })}
                        disabled={disabled}
                        className="input-field"
                    >
                        <option value="A4">A4 (210 × 297 mm)</option>
                        <option value="Legal">Legal (8.5 × 14 in)</option>
                        <option value="Letter">Letter (8.5 × 11 in)</option>
                    </select>
                </div>

                {/* Orientation */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Orientation</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateConfig({ orientation: 'portrait' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.orientation === 'portrait'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Portrait
                        </button>
                        <button
                            onClick={() => updateConfig({ orientation: 'landscape' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.orientation === 'landscape'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Landscape
                        </button>
                    </div>
                </div>

                {/* Sides */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Print Sides
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateConfig({ sides: 'single' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.sides === 'single'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Single Side
                        </button>
                        <button
                            onClick={() => updateConfig({ sides: 'double' })}
                            disabled={disabled}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${config.sides === 'double'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Double Side
                        </button>
                    </div>
                </div>

                {/* Pages Per Sheet */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Pages Per Sheet</label>
                    <select
                        value={config.pagesPerSheet}
                        onChange={(e) => updateConfig({ pagesPerSheet: parseInt(e.target.value) as PrintConfig['pagesPerSheet'] })}
                        disabled={disabled}
                        className="input-field"
                    >
                        <option value={1}>1 page</option>
                        <option value={2}>2 pages</option>
                        <option value={4}>4 pages</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
