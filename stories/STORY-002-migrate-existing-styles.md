# Story 002: Migrate Existing HTML/CSS to React Project

## Story
**As a** developer  
**I want** to migrate the existing CSS files and establish the visual design system  
**So that** the React app maintains the exact same UI design as the HTML prototype

## Priority: High
## Story Points: 2
## Sprint: 1

## Acceptance Criteria

1. **Copy all existing CSS files**
   - Copy `styles.css` to `src/assets/css/styles.css`
   - Copy `course-learning.css` to `src/assets/css/course-learning.css`
   - Import in `src/main.jsx` or `App.jsx`

2. **Extract and organize CSS variables**
   ```css
   /* src/assets/css/variables.css */
   :root {
     /* Extract all colors, fonts, spacing from existing CSS */
     --primary-color: /* from existing */;
     --secondary-color: /* from existing */;
     --font-family: /* from existing */;
   }
   ```

3. **Create base layout components matching HTML structure**
   - `AuthLayout.jsx` - for login page layout
   - `MainLayout.jsx` - for app pages with sidebar
   - `Container.jsx` - wrapper component

4. **Verify visual parity**
   - Create a test page with all UI elements
   - Side-by-side comparison with original HTML
   - Screenshot comparisons for documentation

5. **Set up CSS module support (optional)**
   ```javascript
   // vite.config.js
   export default {
     css: {
       modules: {
         localsConvention: 'camelCase'
       }
     }
   }
   ```

6. **Import fonts and assets**
   - Copy any font files or images
   - Update paths in CSS to match new structure
   - Ensure all assets load correctly

## Technical Notes

- DO NOT modify any existing CSS rules
- Preserve all animations and transitions
- Keep CSS class names identical for easy migration
- Document any CSS-in-JS decisions for future components

## Definition of Done

- [x] All CSS files imported and working
- [x] No visual differences from HTML prototype
- [x] All fonts and images loading correctly
- [x] CSS variables extracted and documented
- [x] Layout components created
- [x] Build process handles CSS correctly

## Dev Agent Record

### Status: Ready for Review
### Agent Model Used: Claude 3.5 Sonnet
### Completion Date: 2025-01-26

### File List
- `/promptmaster-app/src/assets/css/styles.css` - Copied from original
- `/promptmaster-app/src/assets/css/course-learning.css` - Copied from original
- `/promptmaster-app/src/assets/css/variables.css` - Extracted CSS variables
- `/promptmaster-app/src/components/common/AuthLayout.jsx` - Auth page layout
- `/promptmaster-app/src/components/common/MainLayout.jsx` - Main app layout
- `/promptmaster-app/src/components/common/Container.jsx` - Container wrapper
- `/promptmaster-app/src/pages/StyleTest.jsx` - Visual parity test page
- `/promptmaster-app/src/main.jsx` - Updated with CSS imports
- `/promptmaster-app/src/App.jsx` - Updated to show test page
- `/promptmaster-app/src/index.css` - Removed
- `/promptmaster-app/src/App.css` - Removed

### Change Log
- Copied both CSS files to assets/css directory
- Created variables.css with all CSS custom properties
- Imported CSS files in main.jsx in correct order
- Created layout components matching HTML structure
- Created StyleTest page for visual verification
- Removed default Vite CSS files
- All styles preserved without modification
- Linting passes

## Dependencies
- Story 001: React Project Setup

## References
- Existing files: `styles.css`, `course-learning.css`
- PRD: UI Design Goals section