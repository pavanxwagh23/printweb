'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';

interface CheckoutModalProps {
    total: number;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CheckoutModal({ total, onClose, onConfirm }: CheckoutModalProps) {
    const [step, setStep] = useState<'payment' | 'success'>('payment');
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProcessing(false);
        setStep('success');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                {step === 'payment' ? (
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <CreditCard className="w-6 h-6 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                        </div>

                        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6">
                            <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                            <p className="text-4xl font-bold text-primary-700">₹{total.toFixed(2)}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="input-field"
                                    maxLength={19}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="input-field"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="input-field"
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="btn-secondary flex-1"
                                disabled={processing}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                                Back
                            </button>
                            <button
                                onClick={handlePayment}
                                className="btn-primary flex-1"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay ₹{total.toFixed(2)}</>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-center text-gray-500">
                            🔒 This is a demo. No actual payment will be processed.
                        </p>
                    </div>
                ) : (
                    <div className="p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-6 bg-green-100 rounded-full">
                                <CheckCircle className="w-20 h-20 text-green-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
                            <p className="text-gray-600">
                                Your print job has been submitted successfully.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-mono font-semibold text-gray-800">
                                    ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-semibold text-gray-800">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-semibold text-green-600">Processing</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            You will receive an email confirmation shortly with pickup details.
                        </p>

                        <button
                            onClick={onConfirm}
                            className="btn-primary w-full"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
