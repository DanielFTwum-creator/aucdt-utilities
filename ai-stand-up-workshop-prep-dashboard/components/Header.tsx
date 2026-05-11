import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
    return (
        <header className="mb-8 border-b border-[var(--color-border)] pb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-[2.5rem] leading-tight font-bold text-[var(--color-text-primary)] mb-2">Team Stand-up & AI Workshop Strategy</h1>
                    <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">An interactive summary of the team's progress, technical blockers, and preparation for the upcoming AI workshop.</p>
                </div>
                <ThemeSwitcher />
            </div>
        </header>
    );
};

export default Header;