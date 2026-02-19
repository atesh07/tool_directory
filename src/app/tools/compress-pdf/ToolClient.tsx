"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Lock, File as FileIcon, Download, Loader2, Settings } from "lucide-react";

export default function ToolClient() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("recommended");
  const [isCompressing, setIsCompressing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setDownloadUrl(null); // Reset previous downloads
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", compressionLevel);

    try {
      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Compression failed");

      // Create a downloadable blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error compressing file:", error);
      alert("Failed to compress the PDF. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  // View 1: The Uploader (Matches your image)
  if (!file) {
    return (
      <div 
        {...getRootProps()} 
        className={`bg-white border-2 border-dashed transition-colors duration-200 ease-in-out cursor-pointer py-20 px-4 flex flex-col items-center justify-center
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 mb-6 text-lg">Drop PDF file here or</p>
        
        <button className="bg-[#0066cc] hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-md text-lg transition-colors">
          Select PDF
        </button>
        
        <div className="flex items-center text-gray-400 mt-6 text-sm">
          <Lock size={14} className="mr-2" />
          <span>Your files are secure</span>
        </div>
      </div>
    );
  }

  // View 2: File Selected & Settings
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-600">
            <FileIcon size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{file.name}</h3>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button 
          onClick={() => { setFile(null); setDownloadUrl(null); }}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Remove
        </button>
      </div>

      <div className="mb-8">
        <h4 className="flex items-center text-md font-semibold text-gray-800 mb-4">
          <Settings size={18} className="mr-2 text-gray-600" />
          Compression Level
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "low", label: "Low Compression", desc: "High quality, less compression" },
            { id: "recommended", label: "Recommended", desc: "Good quality, good compression" },
            { id: "extreme", label: "Extreme Compression", desc: "Lower quality, high compression" },
          ].map((option) => (
            <label 
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                compressionLevel === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="compression"
                value={option.id}
                checked={compressionLevel === option.id}
                onChange={(e) => setCompressionLevel(e.target.value)}
                className="hidden"
              />
              <div className="font-semibold text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {!downloadUrl ? (
          <button
            onClick={handleCompress}
            disabled={isCompressing}
            className="bg-[#0066cc] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md flex items-center disabled:opacity-50"
          >
            {isCompressing ? (
              <><Loader2 className="animate-spin mr-2" size={20} /> Compressing...</>
            ) : (
              "Compress PDF"
            )}
          </button>
        ) : (
          <a
            href={downloadUrl}
            download={`compressed_${file.name}`}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md flex items-center transition-colors"
          >
            <Download className="mr-2" size={20} /> Download Compressed PDF
          </a>
        )}
      </div>
    </div>
  );
}