import React from 'react';

interface ProgrammeIconProps {
    programmeId: string;
    className?: string;
}

const ProgrammeIcon: React.FC<ProgrammeIconProps> = ({ programmeId, className = 'w-10 h-10 mb-3' }) => {
    switch (programmeId) {
        case 'jd': // Jewellery Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Jewellery Design Icon</title>
                    <path d="M12 2L14.5 9H9.5L12 2Z" fill="#D4AF37"/>
                    <path d="M6 9L12 22L18 9H6Z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 9H14.5" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'dm': // Digital Media
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Digital Media Icon</title>
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#8B1538" strokeWidth="2"/>
                    <path d="M7 20H17" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 16V20" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="8" cy="9" r="1" fill="#D4AF37"/>
                    <path d="M12 9H16" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 12H14" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        case 'fd': // Fashion Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Fashion Design Icon</title>
                    <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" fill="#D4AF37"/>
                    <path d="M8 7H16L17 14H7L8 7Z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14L9 22H15L17 14" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'pd': // Product Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Product Design Icon</title>
                    <circle cx="12" cy="12" r="3" stroke="#D4AF37" strokeWidth="2"/>
                    <path d="M12 2V5" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 19V22" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 12H2" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 12H19" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.0711 4.92896L16.9497 7.05029" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7.05029 16.9497L4.92896 19.0711" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.0711 19.0711L16.9497 16.9497" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7.05029 7.05029L4.92896 4.92896" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        default:
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Default Icon</title>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2 2 0 0 1 6 2z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
    }
};

export default ProgrammeIcon;
