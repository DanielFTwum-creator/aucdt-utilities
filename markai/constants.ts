
import React from 'react';
import { Platform, PlatformDetail } from './types';

// Icon components are now defined directly in this file to break a circular dependency.
// Fix: Converted JSX to React.createElement calls to make the components valid in a .ts file.
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props}, 
    React.createElement('rect', { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }),
    React.createElement('path', { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
    React.createElement('line', { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" })
  )
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props},
    React.createElement('path', { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
  )
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props},
    React.createElement('path', { d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" })
  )
);
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props},
    React.createElement('path', { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
    React.createElement('rect', { x: "2", y: "9", width: "4", height: "12" }),
    React.createElement('circle', { cx: "4", cy: "4", r: "2" })
  )
);
const EmailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props},
    React.createElement('path', { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
    React.createElement('polyline', { points: "22,6 12,13 2,6" })
  )
);


export const PLATFORM_DETAILS: PlatformDetail[] = [
  { id: Platform.Instagram, name: 'Instagram', icon: InstagramIcon, description: 'Short, punchy caption with relevant hashtags.' },
  { id: Platform.Facebook, name: 'Facebook', icon: FacebookIcon, description: 'Engaging post, slightly longer, can include links.' },
  { id: Platform.Twitter, name: 'Twitter / X', icon: TwitterIcon, description: 'Concise tweet, under 280 characters, uses hashtags.' },
  { id: Platform.LinkedIn, name: 'LinkedIn', icon: LinkedInIcon, description: 'Professional tone, suitable for articles or updates.' },
  { id: Platform.Email, name: 'Email', icon: EmailIcon, description: 'Full email body with subject line A/B test variants.' },
];
