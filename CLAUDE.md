# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML/CSS/JavaScript website for ScaleX, a business acceleration program for e-commerce companies. The website is built with vanilla technologies focusing on performance, conversion optimization, and responsive design.

## Architecture & Structure

**Core Pages:**
- `index.html` - Main landing page with hero section, services, testimonials, and results carousel
- `demo-vsl.html` - Video sales letter page with conversion-focused content
- `demo-book.html` - Appointment booking page with Calendly integration
- `growth-roadmap.html` - Alternative demo page (legacy)
- `metodologia.html` - Methodology explanation page

**Key Components:**
- **Results Carousel**: Quantitative client results with autoplay, hover pause, and navigation indicators
- **Hero Section**: Responsive headlines, CTA buttons, client logos carousel
- **Glassmorphism Navigation**: Fixed header with backdrop blur effects
- **Floating Orbs**: Animated background elements
- **Responsive Design**: Mobile-first approach with breakpoints at 320px, 768px, 1024px, 1920px

**CSS Architecture:**
- `styles.css` - Main stylesheet with all components and responsive rules
- `demo-vsl-styles.css` - Specific styles for VSL page
- `demo-book-styles.css` - Specific styles for booking page

**JavaScript:**
- `script.js` - Vanilla JS for interactions, animations, form handling, and carousel functionality
- Uses Lucide icons library for iconography
- Intersection Observer API for scroll animations

## Development Commands

**Local Development:**
```bash
# Serve static files locally
python -m http.server 8000
# or
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

**File Operations:**
```bash
# View all HTML pages
ls *.html

# Check image assets
ls *.png *.jpg

# View main stylesheet
less styles.css
```

## Design System

**Colors:**
- Primary: Gradient blue/purple (#4F46E5 → #7C3AED)
- Secondary: Green (#10B981)
- Background: Dark (#0F172A)
- Text: White/light gray

**Typography:**
- Font: Inter (Google Fonts)
- Headlines: Optimized for multiple words per line (line-height: 1.15)

**Components:**
- Cards: 16px border-radius, subtle shadows
- Buttons: Gradient effects with hover states
- Carousels: Smooth animations with autoplay
- Forms: Calendly widget integration

## Key Features

**Conversion Flow:**
- Landing page CTAs → `demo-vsl.html`
- VSL page CTA → `demo-book.html`
- Final booking through integrated Calendly widget

**Performance Optimizations:**
- Optimized images and assets
- CSS organized for efficiency
- Vanilla JavaScript (no frameworks)
- Asynchronous script loading

**Responsive Behavior:**
- Container widths: Desktop (1800px max), Laptop (1500px max), Tablet (90%), Mobile (95%)
- Cards stack vertically on mobile
- Carousel shows fewer items on smaller screens
- Touch-friendly interactions

## Content Management

When editing content, maintain the conversion-focused copy structure. Key sections include:
- Hero headlines (exactly 2 lines on mobile)
- Client results in carousel (7 quantitative results)
- Service cards (4 clean, minimal cards)
- Leadership profiles (João and Luiz)
- Client testimonials and logos

## Testing

Since this is a static site, testing involves:
- Cross-browser compatibility
- Responsive design on different screen sizes
- Form functionality (Calendly integration)
- Image loading and optimization
- JavaScript interactions and animations