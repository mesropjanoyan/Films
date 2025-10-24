# Film Companion Guide - Slideshow Edition

A modern, responsive single-page web app showcasing the anime films that inspired famous live-action movies.

## 📁 Directory Structure

```
Films/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── README.md           # This file
└── images/             # Image directory
    ├── ghost-in-shell/
    │   ├── poster.jpg
    │   ├── screengrab1.jpg
    │   ├── screengrab2.jpg
    │   └── ...
    ├── matrix/
    ├── perfect-blue/
    ├── black-swan/
    ├── paprika/
    ├── inception/
    └── millennium-actress/
```

## 🎬 How to Add Images

### Image Naming Convention

For each film, create a folder in `images/` with the film ID and add:

1. **Poster (Required)**: `poster.jpg` - Always the first slide
2. **Screengrabs (Optional)**: `screengrab1.jpg`, `screengrab2.jpg`, etc.
   - Number them sequentially (1, 2, 3...)
   - Add as many as you want
   - They'll appear in numerical order
3. **Trailer**: Automatically added as the last slide (embedded YouTube)

### Film IDs

- `ghost-in-shell` - Ghost in the Shell (1995)
- `matrix` - The Matrix (1999)
- `perfect-blue` - Perfect Blue (1997)
- `black-swan` - Black Swan (2010)
- `paprika` - Paprika (2006)
- `inception` - Inception (2010)
- `millennium-actress` - The Millennium Actress (2001)

### Example

To add images for Ghost in the Shell:

```
images/ghost-in-shell/
├── poster.jpg           # Movie poster (first slide)
├── screengrab1.jpg      # Scene from the movie
├── screengrab2.jpg      # Another scene
└── screengrab3.jpg      # Another scene
```

Then refresh the page or run in the browser console:
```javascript
reloadSlideshow('ghost-in-shell')
```

## 🔧 JavaScript Functions

Open the browser console (F12) to use these functions:

### Reload Slideshow After Adding Images
```javascript
reloadSlideshow('ghost-in-shell')
```

### Update YouTube Trailer
```javascript
updateTrailer('ghost-in-shell', 'YOUTUBE_VIDEO_ID')
```

### Add Further Reading Links
```javascript
addFilmLink('links-system', 'Article Title', 'https://example.com')
```

Available link sections:
- `links-system` - First Course (Ghost in the Shell / Matrix)
- `links-self` - Second Course (Perfect Blue / Black Swan)
- `links-bridge` - Third Course (Paprika / Inception)
- `links-dessert` - Dessert Course (Millennium Actress)

## 🎨 Features

- **Intuitive Slideshow**: Navigate with arrow buttons, click indicators, or swipe on mobile
- **Keyboard Navigation**: Use arrow keys to navigate slides, 'H' to scroll to top
- **Touch Swipe Support**: Swipe left/right on mobile devices
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Embedded Trailers**: YouTube trailers automatically embedded as last slide
- **Smooth Animations**: Fade transitions and scroll animations
- **Apple-Inspired Design**: Clean, minimal, elegant interface

## 📱 Supported Image Formats

- `.jpg` / `.jpeg` (recommended)
- `.png`
- `.webp`

For best results, use high-quality images with a 2:3 aspect ratio (portrait orientation) for posters.

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Add your images to the appropriate folders
3. Refresh the page to see your images in the slideshows
4. Use the console functions to reload specific slideshows without refreshing

## 🎯 Tips

- **High-Quality Images**: Use images at least 800x1200 pixels for posters
- **Sequential Naming**: Always number screengrabs sequentially (1, 2, 3...)
- **Lazy Loading**: Images load as needed for better performance
- **Placeholders**: Helpful placeholders show where images should go

Enjoy your film marathon! 🍿
