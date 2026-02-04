# Will You Be My Girlfriend? 💕

A playful, interactive two-page website with an adorable dog character and an impossible-to-click "NO" button.

## Features

- 🐕 **Animated Dog**: Eyes follow your cursor (desktop) or finger (mobile)
- 🎯 **Impossible NO Button**: Moves away when you get close (desktop) or tap it (mobile)
- 📱 **Fully Responsive**: Beautiful on both desktop and mobile devices
- 🎨 **Modern Design**: Soft gradient background with clean, centered card layout
- 🎉 **Success Page**: Celebration GIF when YES is clicked

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:5173/`

## Project Structure

```
awlybgf/
├── index.html          # Main page (the question)
├── yes.html           # Success page (celebration)
├── src/
│   ├── main.js        # Main page logic (NO button movement)
│   ├── yes.js         # Yes page logic
│   ├── styles.css     # Global and responsive styles
│   └── dog/
│       ├── dog.css    # Dog character styles
│       └── dog.js     # Dog eye tracking logic
└── public/            # Static assets
```

## Customization

### Change the GIF

Edit `yes.html` and update the image source:

```html
<img src="YOUR_GIF_URL_HERE" alt="Celebration" />
```

You can use:
- External URL: `https://example.com/your-gif.gif`
- Local file: Place in `/public/` folder and use `/your-gif.gif`

### Adjust NO Button Difficulty

Edit `src/main.js` and modify these constants:

```javascript
const PROXIMITY_THRESHOLD_DESKTOP = 120;  // Distance when button moves (px)
const PROXIMITY_THRESHOLD_MOBILE = 80;    // Mobile threshold
const SAFE_PADDING_DESKTOP = 80;          // Padding from card edges
const SAFE_PADDING_MOBILE = 40;           // Mobile padding
```

- **Increase threshold** = Button moves away sooner (harder to click)
- **Decrease padding** = Button can move closer to edges
- **Decrease threshold** = Need to get closer before it moves (easier)

### Customize Colors

Edit `src/styles.css`:

```css
/* Background gradient */
background: linear-gradient(180deg, #FCD6F3 0%, #F4E7FF 100%);

/* YES button color */
background: #FF63B9;

/* NO button color */
background: #CBCBCB;

/* Dog circle color */
background: rgb(245, 180, 69);
```

## How It Works

### Desktop Behavior
- Dog eyes follow mouse cursor in real-time
- NO button detects mouse proximity and moves to random position
- Button stays within card boundaries with safe padding
- Smooth transitions for natural movement

### Mobile Behavior
- Dog eyes follow finger while touching the screen
- NO button moves immediately when tapped
- Touch events prevented to avoid accidental navigation
- Optimized button sizes for touch targets

### Technical Details
- Built with **Vite** for fast development and optimized builds
- Vanilla JavaScript (no frameworks)
- CSS Grid and Flexbox for responsive layout
- Pointer Events API for unified mouse/touch handling
- CSS custom properties for easy theming

## Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Tips

- The NO button is **intentionally impossible** to click on desktop
- On mobile, it moves away instantly when tapped
- The YES button always works perfectly 😊
- Dog eyes provide visual feedback and charm

## License

Free to use for personal projects. Have fun! 💝
