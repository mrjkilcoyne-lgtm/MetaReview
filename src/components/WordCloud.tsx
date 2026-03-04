import React from 'react';
import { WordFrequency } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  words: WordFrequency[];
}

export const WordCloud: React.FC<Props> = ({ words }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">Key Themes</h3>
      <div className="flex flex-wrap gap-4 items-center justify-center min-h-[200px]">
        {words.map((word, i) => {
          const size = Math.max(0.8, Math.min(2.5, word.value / 2));
          return (
            <span
              key={i}
              className={cn(
                "transition-all hover:scale-110 cursor-default font-medium",
                word.type === 'praise' ? "text-emerald-600" : "text-rose-500"
              )}
              style={{ fontSize: `${size}rem`, opacity: 0.6 + (word.value / 10) }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
