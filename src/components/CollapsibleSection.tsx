import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultExpanded = true,
  showViewAll = false,
  onViewAll
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-black">{title}</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" style={{ color: '#CF8852' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: '#CF8852' }} />
            )}
          </button>
        </div>
        {showViewAll && isExpanded && (
          <Button
            variant="ghost"
            onClick={onViewAll}
            style={{ color: '#CF8852' }}
          >
            View All
          </Button>
        )}
      </div>
      
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
