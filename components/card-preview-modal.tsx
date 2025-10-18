"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CardPreviewModal({ isOpen, onClose }: CardPreviewModalProps) {
  const [activeCard, setActiveCard] = useState<'afifa' | 'rehan'>('afifa');

  if (!isOpen) return null;

  const cardPath = activeCard === 'afifa' 
    ? '/Afifa & Rehan Card.pdf'
    : '/Rehan & Afifa Card.pdf';

  const cardLabel = activeCard === 'afifa' 
    ? 'Afifa & Rehan Card'
    : 'Rehan & Afifa Card';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif text-[#c91b21]">Wedding Card Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 px-6 pt-4 border-b border-gray-200">
          <button
            onClick={() => setActiveCard('afifa')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeCard === 'afifa'
                ? 'text-[#c91b21] border-b-2 border-[#c91b21]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Afifa&apos;s Card
          </button>
          <button
            onClick={() => setActiveCard('rehan')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeCard === 'rehan'
                ? 'text-[#c91b21] border-b-2 border-[#c91b21]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rehan&apos;s Card
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-6">
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <iframe
              src={`${cardPath}#toolbar=0`}
              className="w-full h-[600px] rounded"
              title={cardLabel}
            />
          </div>
        </div>

        {/* Footer with Download Option */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {cardLabel}
          </p>
          <a
            href={cardPath}
            download={cardLabel}
            className="px-4 py-2 bg-[#c91b21] text-white rounded font-semibold hover:bg-[#a01820] transition-colors"
          >
            Download Card
          </a>
        </div>
      </div>
    </div>
  );
}
