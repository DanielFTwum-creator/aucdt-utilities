
import React, { useState, useEffect } from 'react';

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentQuestionIndex: number;
    answeredIndices: number[];
    onNavigate: (index: number) => void;
}

const NavButton = ({ index, isCurrent, isAnswered, onClick }) => {
    let buttonClass = `w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm transition-all duration-200 ease-in-out border-2`;

    if (isCurrent) {
        buttonClass += ' scale-110 shadow-lg text-black bg-[#B8860B] border-[#B8860B]'; // gold bg, black text
    } else if (isAnswered) {
        buttonClass += ' text-gray-200 bg-green-900/40 border-green-800'; 
    } else {
        buttonClass += ' text-gray-400 bg-black/20 border-transparent hover:border-[#B8860B]/50';
    }

    return (
        <button key={index} data-testid={`navigator-q-${index}`} onClick={onClick} className={buttonClass}>
            {index + 1}
        </button>
    );
};

const NavArrow = ({ direction, onClick, disabled }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-label={direction === 'left' ? 'Previous questions' : 'Next questions'}
        className="w-8 h-10 flex-shrink-0 flex items-center justify-center bg-black/20 rounded-md text-gray-400 hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            {direction === 'left' ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
        </svg>
    </button>
);

const Ellipsis = () => (
    <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
);

const getPaginationItems = (total: number, current: number, pageLimit: number) => {
    if (total <= pageLimit) {
        return Array.from({ length: total }, (_, i) => i);
    }
    
    const sideWidth = Math.max(1, Math.floor((pageLimit - 3) / 2));
    const leftWidth = sideWidth;
    const rightWidth = pageLimit - leftWidth - 3; 

    if (current < leftWidth + 2) {
        // Near the start
        const left = Array.from({ length: pageLimit - 2 }, (_, i) => i);
        return [...left, 'ellipsis_end', total - 1];
    } else if (current > total - rightWidth - 3) {
        // Near the end
        const right = Array.from({ length: pageLimit - 2 }, (_, i) => total - (pageLimit - 2) + i);
        return [0, 'ellipsis_start', ...right];
    } else {
        // In the middle
        const middle = Array.from({ length: pageLimit - 4 }, (_, i) => current - sideWidth + 1 + i);
        return [0, 'ellipsis_start', ...middle, 'ellipsis_end', total - 1];
    }
};

export const QuestionNavigator = ({ totalQuestions, currentQuestionIndex, answeredIndices, onNavigate }: QuestionNavigatorProps) => {
    const ITEMS_PER_PAGE = 10; // Max items to show at once on smaller screens
    
    // For large quizzes, we paginate the navigator itself
    if (totalQuestions > ITEMS_PER_PAGE) {
        const paginationItems = getPaginationItems(totalQuestions, currentQuestionIndex, ITEMS_PER_PAGE);

        return (
            <div className="flex justify-center items-center gap-1 mt-4">
                <NavArrow 
                    direction="left"
                    onClick={() => onNavigate(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                />
                <div className="flex-grow flex justify-center items-center gap-1 sm:gap-2">
                    {paginationItems.map((item, idx) => {
                        if (typeof item === 'string') {
                            return <Ellipsis key={item + idx} />;
                        }
                        return (
                            <NavButton
                                key={item}
                                index={item}
                                isCurrent={currentQuestionIndex === item}
                                isAnswered={answeredIndices.includes(item)}
                                onClick={() => onNavigate(item)}
                            />
                        );
                    })}
                </div>
                 <NavArrow
                    direction="right"
                    onClick={() => onNavigate(Math.min(totalQuestions-1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                />
            </div>
        );
    }

    // Default view for smaller quizzes
    return (
         <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Array.from({ length: totalQuestions }, (_, i) => (
                <NavButton
                    key={i}
                    index={i}
                    isCurrent={currentQuestionIndex === i}
                    isAnswered={answeredIndices.includes(i)}
                    onClick={() => onNavigate(i)}
                />
            ))}
        </div>
    );
};