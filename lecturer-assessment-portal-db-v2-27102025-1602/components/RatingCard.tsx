import React from 'react';
import { Star } from 'lucide-react';
import { RatingCardProps } from '../types';

const RatingCard: React.FC<RatingCardProps> = ({ label, rating, icon }) => (
  <div className="bg-[#F8F6F0] dark:bg-[#2C1810]/60 [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 rounded-lg p-4 border border-[#E6D5C7] dark:border-[#6B1028]">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-[#6B1028] dark:text-[#F4E4BC] [.high-contrast_&]:text-yellow-300">{icon}</div>
      <h3 className="font-medium text-[#2C1810] dark:text-white [.high-contrast_&]:text-white text-sm">{label}</h3>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating ? 'text-[#D4AF37] fill-[#D4AF37] [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:fill-yellow-300' : 'text-[#E6D5C7] dark:text-[#6B1028] [.high-contrast_&]:text-slate-600'
            }
          />
        ))}
      </div>
      <span className="text-lg font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{rating}<span className="text-sm font-normal text-[#2C1810]/70 dark:text-[#E6D5C7]/70 [.high-contrast_&]:text-slate-300">/5</span></span>
    </div>
  </div>
);

export default RatingCard;