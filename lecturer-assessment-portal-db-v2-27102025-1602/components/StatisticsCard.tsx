
import React from 'react';

interface StatisticsCardProps {
    title: string;
    value: string;
    suffix?: string;
    colorClass: string;
    icon: React.ReactNode;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, suffix, colorClass, icon }) => {
    return (
        <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-l-4 border-[#E6D5C7] dark:border-[#6B1028] border-l-[#D4AF37] [.high-contrast_&]:border-l-yellow-300 flex items-center gap-4">
             <div className={`p-3 rounded-full bg-opacity-10 ${colorClass}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-[#2C1810]/80 dark:text-[#E6D5C7]/80 [.high-contrast_&]:text-white mb-1">{title}</h3>
                <p className="text-3xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">
                    {value}
                    {suffix && <span className="text-xl font-medium text-[#2C1810]/70 dark:text-[#E6D5C7]/70 [.high-contrast_&]:text-slate-300">{suffix}</span>}
                </p>
            </div>
        </div>
    );
}

export default StatisticsCard;