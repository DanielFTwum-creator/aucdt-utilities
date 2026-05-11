import React from 'react';
import { ShapeConfig, ShapeId } from './types';
import { ICON_LIBRARY } from './icon-library';

export const SHAPES: ShapeConfig[] = [
  { id: 'custom', name: 'Custom' },
  { id: 'circle', name: 'Circle' },
  { id: 'square', name: 'Square' },
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'hexagon', name: 'Hexagon' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'pentagon', name: 'Pentagon' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'arrow', name: 'Arrow' },
  { id: 'cross', name: 'Cross' },
  { id: 'droplet', name: 'Droplet' },
  { id: 'bubble', name: 'Bubble' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'flag', name: 'Flag' },
  { id: 'sun', name: 'Sun' },
  { id: 'moon', name: 'Moon' },
  { id: 'camera', name: 'Camera' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'car', name: 'Car' },
  { id: 'music', name: 'Music' },
  { id: 'more', name: 'More' },
];

export const UploadIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const DownloadIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const FileTextIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const UrlIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export const SvgIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

export const ResetIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);

export const PlusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export const MinusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);

export const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const SparkleIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L16 6m-5.293 2.293a1 1 0 010 1.414L6 14m3-3l6 6m-1-10l-6 6m1-10l6 6" />
    </svg>
);

export const XIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ClipboardIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

export const CheckIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const GridIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const PlayIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CheckCircleIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const iconClasses = "w-8 h-8 transition-colors duration-200";
const selectedIconClasses = "text-purple-700";
const defaultIconClasses = "text-gray-500 group-hover:text-purple-600";

export const CustomIcon = ({selected}: {selected: boolean}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

export const CircleIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

export const SquareIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

export const HeartIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const StarIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const HexagonIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 2.5l8.66 5v10L12 22.5 3.34 17.5v-10L12 2.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const DiamondIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const PentagonIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 2.5l9.51 6.91-3.64 11.09H6.13l-3.64-11.09L12 2.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const TriangleIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const ArrowIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M14 4l8 8-8 8v-5H4v-6h10V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const CrossIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const DropletIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M12 22a8 8 0 008-8c0-5.5-8-12-8-12S4 8.5 4 14a8 8 0 008 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const BubbleIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const CloudIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const FlagIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const SunIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const MoonIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d="M21.64 13A9 9 0 117.61 3.07 9 9 0 0021.64 13z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

const findPath = (name: string) => ICON_LIBRARY.find(i => i.name === name)?.path || '';

const LibraryIcon = ({ name, selected }: { name: string, selected: boolean }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <path d={findPath(name)} fill="currentColor" />
    </svg>
);

export const CameraIcon = ({selected}: {selected: boolean}) => <LibraryIcon name="camera" selected={selected} />;
export const CoffeeIcon = ({selected}: {selected: boolean}) => <LibraryIcon name="coffee" selected={selected} />;
export const CarIcon = ({selected}: {selected: boolean}) => <LibraryIcon name="car" selected={selected} />;
export const MusicIcon = ({selected}: {selected: boolean}) => <LibraryIcon name="music" selected={selected} />;

export const MoreIcon = ({selected}: {selected: boolean}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${selected ? selectedIconClasses : defaultIconClasses}`}>
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
    </svg>
);

export const shapeIcons: Record<ShapeId, React.FC<{selected: boolean}>> = {
    custom: CustomIcon,
    circle: CircleIcon,
    square: SquareIcon,
    heart: HeartIcon,
    star: StarIcon,
    hexagon: HexagonIcon,
    diamond: DiamondIcon,
    pentagon: PentagonIcon,
    triangle: TriangleIcon,
    arrow: ArrowIcon,
    cross: CrossIcon,
    droplet: DropletIcon,
    bubble: BubbleIcon,
    cloud: CloudIcon,
    flag: FlagIcon,
    sun: SunIcon,
    moon: MoonIcon,
    camera: CameraIcon,
    coffee: CoffeeIcon,
    car: CarIcon,
    music: MusicIcon,
    more: MoreIcon,
};