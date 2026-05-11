import React from 'react';
import {
    Hero,
    Feature,
    About,
    Service,
    Donation,
    Team,
    Video,
    Pricing,
    FAQ,
    Brand,
    Blog,
    Competition,
    Alumni
} from './components';

export default function Home() {
    return (
        <div>
            <Hero />
            <Feature />
            <About />
            <Service />
            <Donation />
            <Team />
            <Alumni />
            <Video />
            <Pricing />
            <Competition />
            <FAQ />
            <Brand />
            <Blog />
        </div>
    );
}


