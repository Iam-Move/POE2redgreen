import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import { processImage } from './utils/processImage';

function ColorFixerApp() {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [options, setOptions] = useState({
        sensitivity: 90,
        replaceRed: true,
        replaceGreen: true,
        redResultColor: '#4169E1',   // Royal Blue
        greenResultColor: '#ffffff', // White
        thickness: 0.5,              // Default 0.5px
        noiseFilter: true,
        checkConnectivity: true
    });

    // Paste Support
    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        handleImageUpload(event.target.result);
                    };
                    reader.readAsDataURL(blob);
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    // Re-process when options change
    useEffect(() => {
        if (originalImage) {
            runProcessing(originalImage, options);
        }
    }, [options, originalImage]);

    const handleImageUpload = (imgSrc) => {
        setOriginalImage(imgSrc);
        // runProcessing is handled by useEffect
    };

    const runProcessing = async (imgSrc, currentOptions) => {
        setIsProcessing(true);
        try {
            const result = await processImage(imgSrc, currentOptions);
            setProcessedImage(result);
        } catch (error) {
            console.error("Processing failed:", error);
            alert("이미지 처리 중 오류가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOptionChange = (key, value) => {
        setOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.download = 'poe2-fixed-tree.png';
        link.href = processedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-poe-bg text-gray-200 p-4 font-sans flex flex-col items-center">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-poe-accent mb-2">POE2 Color Blindness Fixer</h1>
                <p className="text-gray-400 text-sm">오프라인 버전 (Offline Version)</p>
            </header>

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-poe-panel p-6 rounded-lg border border-poe-border shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200 border-b border-zinc-700 pb-2">설정 (Settings)</h2>

                        {/* Colors */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={options.replaceRed}
                                        onChange={(e) => handleOptionChange('replaceRed', e.target.checked)}
                                        className="rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span>Red (무기 1) 변경</span>
                                </label>
                                <input
                                    type="color"
                                    value={options.redResultColor}
                                    onChange={(e) => handleOptionChange('redResultColor', e.target.value)}
                                    disabled={!options.replaceRed}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={options.replaceGreen}
                                        onChange={(e) => handleOptionChange('replaceGreen', e.target.checked)}
                                        className="rounded bg-zinc-700 border-zinc-600 text-green-500 focus:ring-green-500"
                                    />
                                    <span>Green (무기 2) 변경</span>
                                </label>
                                <input
                                    type="color"
                                    value={options.greenResultColor}
                                    onChange={(e) => handleOptionChange('greenResultColor', e.target.value)}
                                    disabled={!options.replaceGreen}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">민감도 (Sensitivity)</span>
                                    <span className="text-sm text-poe-accent">{options.sensitivity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={options.sensitivity}
                                    onChange={(e) => handleOptionChange('sensitivity', parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-poe-accent"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">선 굵기 (Width)</span>
                                    <span className="text-sm text-poe-accent">{options.thickness}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="0.5"
                                    value={options.thickness}
                                    onChange={(e) => handleOptionChange('thickness', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-poe-accent"
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-700">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={options.checkConnectivity}
                                    onChange={(e) => handleOptionChange('checkConnectivity', e.target.checked)}
                                    className="rounded bg-zinc-700 border-zinc-600 text-poe-accent focus:ring-poe-accent"
                                />
                                <span>스마트 연결 감지 (노란선 기준)</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                체크 시 고립된 잡티를 무시하고 연결된 선만 칠합니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <ImageUploader onImageUpload={handleImageUpload} />

                    {processedImage && (
                        <div className="bg-poe-panel p-4 rounded-lg border border-poe-border shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-200">결과 미리보기</h3>
                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded shadow transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    이미지 다운로드
                                </button>
                            </div>

                            <div className="relative overflow-hidden rounded border border-zinc-700 bg-black min-h-[300px] flex items-center justify-center">
                                {isProcessing ? (
                                    <div className="text-poe-accent animate-pulse">처리 중...</div>
                                ) : (
                                    <img src={processedImage} alt="Processed" className="max-w-full h-auto" />
                                )}
                            </div>

                            <div className="mt-4 text-xs text-center text-gray-500">
                                이미지를 우클릭하여 '다른 이름으로 저장' 하실 수도 있습니다.
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-12 text-gray-600 text-xs text-center">
                Made by IamMove &bull; Offline Version
            </footer>
        </div>
    );
}

export default ColorFixerApp;
