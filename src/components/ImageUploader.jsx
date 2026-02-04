import React, { useCallback } from 'react';

const ImageUploader = ({ onImageUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            onImageUpload(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="border-2 border-dashed border-poe-border bg-poe-panel hover:bg-zinc-800 transition-colors rounded-lg p-10 text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="text-poe-accent text-xl mb-2 font-semibold">
                이미지를 드래그하거나 클릭하여 업로드
            </div>
            <p className="text-gray-400 text-sm">
                POE2 패시브 트리 스크린샷 (.png, .jpg)
            </p>
        </div>
    );
};

export default ImageUploader;
