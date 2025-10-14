# 🏛️ Century Museum

An immersive, interactive web application that takes users on a cinematic journey through history, exploring influential figures from the 17th to 20th centuries.

## ✨ Features

### Core Experience
- **Cinematic Landing Page** - Animated intro sequence with word animations, transitions, and video backgrounds
- **Interactive Museum Rooms** - Four century-themed rooms (1600s-1900s) with unique visual identities
- **Historical Persons Gallery** - Carousel-based selection system with 20 historically diverse figures
- **Immersive Room Views** - Flip-card interactions revealing biographies and notable works
- **Educational Games** - Three engaging game modes to test historical knowledge

### Professional Enhancements
- **Design System** - Consistent color palette, typography, and spacing variables
- **Toast Notifications** - Professional, accessible notification system
- **Custom Modals** - Elegant modal dialogs replacing browser alerts
- **Loading States** - Skeleton screens and loading indicators
- **Lazy Loading** - Optimized image loading with intersection observer
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Accessibility** - WCAG 2.1 AA compliance with ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Live Server, Python SimpleHTTPServer, or similar)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MikkoOnniPeltonen/Museum-by-centuries.git
cd Museum-by-centuries
```

2. **Start a local server**

Using Python 3:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx http-server
```

Using VS Code Live Server:
- Right-click on `index.html`
- Select "Open with Live Server"

3. **Open in browser**
```
http://localhost:8000
```

## 📁 Project Structure

```
Museum-by-centuries/
├── index.html                  # Main landing page
├── index.js                    # Landing page logic
├── roomClass.js                # Room data model (legacy)
├── components/                 # Reusable UI components
│   ├── toast.js               # Toast notification system
│   ├── toast.css              # Toast styles
│   ├── modal.js               # Modal dialog system
│   ├── modal.css              # Modal styles
│   └── loading.css            # Loading states & skeletons
├── data/                       # JSON data files
│   └── historical-persons.json # Historical figures database
├── utils/                      # Utility functions
│   ├── dataLoader.js          # Data fetching & caching
│   └── lazyLoad.js            # Image lazy loading
├── styles/                     # Stylesheets
│   ├── design-system.css      # CSS variables & tokens
│   └── styles.css             # Main styles
├── historical-persons/         # Person selection page
│   ├── historicalPersonsPage.html
│   └── historicalPersonsPage.js
├── room-view/                  # Room display page
│   ├── roomViewPage.html
│   └── roomViewPage.js
├── game/                       # Game modes
│   ├── gamePage.html
│   └── gamePage.js
└── images/                     # Image assets
    ├── portraits/             # Historical person portraits
    ├── notableWorks/          # Notable works images
    └── logo/                  # Logo assets
```

## 🎨 Design System

The project uses a comprehensive design system with CSS custom properties:

### Color Palette
```css
--color-primary: #3f87a6;
--color-secondary: #f69d3c;
--color-accent: #ffd700;
```

### Century Themes
- **1600s**: Brown/Earthy tones
- **1700s**: Blue/Royal tones
- **1800s**: Purple/Victorian tones
- **1900s**: Gray/Modern tones

### Typography Scale
- Font sizes from `--text-xs` (12px) to `--text-7xl` (72px)
- Font weights from `--font-light` (300) to `--font-extrabold` (800)

### Spacing System
- Consistent spacing from `--space-1` (4px) to `--space-32` (128px)

## 🔧 Usage Examples

### Toast Notifications

```javascript
import { toast } from './components/toast.js';

// Success notification
toast.success('Person added to room!');

// Error notification
toast.error('Failed to load data');

// Custom options
toast.info('Welcome to the museum', {
    duration: 5000,
    position: 'top-center'
});
```

### Modal Dialogs

```javascript
import { Modal } from './components/modal.js';

// Confirmation dialog
const confirmed = await Modal.confirm(
    'Clear all selected persons?',
    'Confirm Action'
);

if (confirmed) {
    // User clicked confirm
}

// Alert dialog
await Modal.alert('Room is empty!', 'Notice');

// Custom modal
const modal = new Modal({
    title: 'Custom Modal',
    message: 'This is a custom modal',
    icon: 'warning',
    confirmText: 'Proceed',
    onConfirm: () => console.log('Confirmed')
});
modal.show();
```

### Data Loading

```javascript
import { dataLoader } from './utils/dataLoader.js';

// Load all historical persons
const persons = await dataLoader.loadHistoricalPersons();

// Filter by century
const persons1800s = dataLoader.getPersonsByCentury('1800s');

// Search persons
const results = dataLoader.searchPersons('einstein');

// Get all traits
const traits = dataLoader.getAllTraits();
```

### Lazy Loading Images

```javascript
import { lazyLoader } from './utils/lazyLoad.js';

// HTML
<img data-src="image.jpg" alt="Description" class="lazy-image">

// JavaScript - auto-initializes on page load
// Or manually observe:
const image = document.querySelector('.lazy-image');
lazyLoader.observe(image);

// Background images
<div data-bg-src="background.jpg" class="hero"></div>
```

## 🎮 Game Modes

### 1. Trait Matcher
Match historical figures by shared traits (writers, scientists, leaders, etc.)

### 2. Century Pairing
Correctly match each person to their century

### 3. Time Jumpers
Identify figures from different centuries in a mixed group

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility Features

- Semantic HTML with proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Screen reader announcements
- High contrast mode support
- Reduced motion preferences respected
- Color contrast ratios meet WCAG AA standards

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance Optimization

- Lazy loading for images
- CSS custom properties for theming
- Intersection Observer for efficient visibility detection
- LocalStorage for persistent state
- Debounced scroll handlers
- Minified CSS animations

## 📊 Data Structure

### Historical Person Object
```json
{
  "id": "unique-id",
  "century": "1900s",
  "name": "Albert Einstein",
  "lifespan": "(1879-1955)",
  "image": "../images/portraits/Albert_Einstein.jpg",
  "bio": "Description...",
  "notableWork": "../images/notableWorks/Albert_Einstein_relativity.jpg",
  "descriptionOfWork": "Description...",
  "traits": ["scientist", "mathematician", "writer"],
  "region": "Europe",
  "profession": "Theoretical Physicist"
}
```

## 🔮 Future Enhancements

- [ ] Audio soundscapes for each century
- [ ] Advanced search and filtering
- [ ] Timeline visualization
- [ ] Dark mode toggle
- [ ] Social sharing features
- [ ] Multilingual support
- [ ] Print-friendly views
- [ ] Offline capability with Service Worker
- [ ] Analytics integration
- [ ] Backend API integration

## 🙏 Acknowledgments

### Third-Party Resources
- **Tailwind CSS** - Styling framework (https://tailwindcss.com)
- **Background Video** - Pixabay (https://pixabay.com)
- **Social Media Icons** - Wikimedia Commons

### Historical Content
- Historical biographies compiled from various educational sources
- Portrait images and notable works illustrations are used for educational purposes
- All historical information is presented for non-commercial educational use

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for history enthusiasts and lifelong learners**
