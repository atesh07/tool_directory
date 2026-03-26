"use client";

import React, { useState } from 'react';
// 1. Import the browser-specific build directly
import * as mammoth from 'mammoth/mammoth.browser.min.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function ToolClint() {
  const [loading, setLoading] = useState(false);

  const convertToPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // 2. Note: In the browser build, mammoth uses 'convertToHtml' 
      // directly on the imported object
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      const html = result.value;

      // Create hidden container for rendering
      const container = document.createElement('div');
      container.style.width = '794px'; // A4 width at 96 DPI
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.position = 'absolute';
      container.style.left = '-9999px'; // Move off-screen
      container.innerHTML = html;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { 
        scale: 2,
        useCORS: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${file.name.replace(".docx", "")}.pdf`);

      document.body.removeChild(container);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error processing file. Please ensure it is a valid .docx file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 border-4 border-dashed border-blue-100 rounded-2xl bg-white shadow-sm hover:border-blue-300 transition-colors">
      <div className="flex flex-col items-center">
        <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all">
          {loading ? 'Processing...' : 'Select Word Document'}
          <input 
            type="file" 
            accept=".docx" 
            className="hidden" 
            onChange={convertToPdf} 
            disabled={loading}
          />
        </label>
        <p className="mt-4 text-gray-500 text-sm">Upload .docx files to convert to PDF instantly</p>
      </div>
    </div>
  );
}