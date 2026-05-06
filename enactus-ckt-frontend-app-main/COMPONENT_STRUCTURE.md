# Enactus CKT-UTAS Website - Component Structure

This document outlines the component-based structure of the React donation website.

## Component Overview

The website has been refactored from a single HTML file into a modular React component structure. Each section of the original website is now a separate, reusable component.

## Components

### 1. Header (`/src/components/Header.jsx`)
- Contains the main navigation menu
- Logo and branding
- Mobile menu toggle
- Search and cart functionality
- Join button

### 2. Hero (`/src/components/Hero.jsx`)
- Main hero section with call-to-action
- Background images and shapes
- Primary messaging and buttons
- Impact statistics display

### 3. Feature (`/src/components/Feature.jsx`)
- Feature cards highlighting key services
- Statistics and achievements
- Call-to-action buttons

### 4. About (`/src/components/About.jsx`)
- Organization information
- Mission, vision, and values
- Achievements and impact
- Team images and statistics

### 5. Service (`/src/components/Service.jsx`)
- Service offerings display
- Service cards with descriptions
- Background images and styling

### 6. Projects (`/src/components/Donation.jsx`)
- Project/donation cards
- Progress bars and funding goals
- Project descriptions and SDG alignment
- View project buttons

### 7. Team (`/src/components/Team.jsx`)
- Team member cards
- Social media links
- Swiper slider for team display
- Background shapes and animations

### 8. Video (`/src/components/Video.jsx`)
- Video section with play button
- Background shapes and styling
- YouTube video integration

### 9. Pricing (`/src/components/Pricing.jsx`)
- Pricing plans display
- Feature checklists
- Call-to-action buttons

### 10. FAQ (`/src/components/FAQ.jsx`)
- Frequently asked questions
- Accordion-style display
- Background images

### 11. Brand (`/src/components/Brand.jsx`)
- Partner/brand logos
- Swiper slider for brand display
- Dark theme styling

### 12. Blog (`/src/components/Blog.jsx`)
- Blog post cards
- Meta information (date, tags)
- Read more buttons

### 13. Footer (`/src/components/Footer.jsx`)
- Contact information
- Quick links and services
- Newsletter signup
- Social media links
- Copyright information

## Usage

All components are imported and used in the main `Home.jsx` component:

```jsx
import {
    Header,
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
    Footer
} from './components';

export default function Home() {
    return (
        <div>
            <Header />
            <Hero />
            <Feature />
            <About />
            <Service />
            <Donation />
            <Team />
            <Video />
            <Pricing />
            <FAQ />
            <Brand />
            <Blog />
            <Footer />
        </div>
    );
}
```

## Benefits of Component Structure

1. **Modularity**: Each section is now a separate, reusable component
2. **Maintainability**: Easier to update individual sections without affecting others
3. **Reusability**: Components can be reused across different pages
4. **Testing**: Individual components can be tested in isolation
5. **Performance**: Better code splitting and lazy loading opportunities
6. **Developer Experience**: Cleaner, more organized codebase

## File Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Feature.jsx
│   ├── About.jsx
│   ├── Service.jsx
│   ├── Donation.jsx
│   ├── Team.jsx
│   ├── Video.jsx
│   ├── Pricing.jsx
│   ├── FAQ.jsx
│   ├── Brand.jsx
│   ├── Blog.jsx
│   ├── Footer.jsx
│   └── index.js
├── Home.jsx
├── App.jsx
└── main.jsx
```

## Styling

All components maintain the original CSS classes and styling from the HTML template. The visual appearance and functionality remain exactly the same as the original website.

