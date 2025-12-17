# MP Barbosa Landing Page

This project is a professional personal landing page for showcasing the curriculum and personal projects of MP Barbosa. It serves as an online portfolio to highlight skills, experiences, and contact information, featuring **Material Design components** and **advanced personal projects** with complete modular architecture.

## Project Structure

The project is organized as follows:

```
mpbarbosa_site/src/
├── index.html              # Main landing page with Material Design
├── package.json            # npm configuration with live-server
├── styles/
│   └── main.css           # Material Design styling and theming
├── scripts/
│   └── main.js            # Contact form and smooth scrolling
├── components/             # Individual HTML components
│   ├── header.html        # Standalone header component
│   ├── about.html         # About section component
│   ├── projects.html      # Projects section component
│   └── contact.html       # Contact section component
├── pages/                  # Project redirect pages
│   ├── music_in_numbers.html    # Redirect to music analytics
│   └── guia_turistico.html      # Redirect to travel guide
└── submodules/            # Personal projects (Git submodules)
    ├── music_in_numbers/  # 🎵 Advanced Spotify analytics platform
    │   ├── src/
    │   │   ├── index.html        # (246 lines) - 84.5% reduction
    │   │   ├── artist.html       # (60 lines) - 89.7% reduction
    │   │   ├── styles/           # Modular CSS architecture
    │   │   └── scripts/          # 12+ JavaScript modules
    │   └── docs/                 # Comprehensive documentation
    └── guia_turistico/    # 🗺️ Interactive travel guide
        └── src/           # Travel guide application
```

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mpbarbosa-landing-page.git
   ```

2. Navigate to the project directory:
   ```
   cd mpbarbosa-landing-page
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Open `src/index.html` in your web browser to view the landing page.

## Features

### Core Website Features
- **Material Design UI**: Modern, professional interface with Google Material Components
- **Responsive Design**: Optimal viewing across all devices and screen sizes
- **Interactive Contact Form**: JavaScript-powered form with validation and feedback
- **Smooth Navigation**: Seamless scrolling between sections
- **Professional Styling**: Clean, modern aesthetic with consistent theming

### Featured Personal Projects (Git Submodules)

#### 🎵 Music in Numbers - Advanced Analytics Platform
- **Complete Modular Architecture**: 85.8% code reduction across major pages
- **Professional Features**: Genre analysis, mood detection, personalized insights
- **Technical Excellence**: OAuth 2.0 PKCE, Chart.js visualizations, export capabilities
- **Architecture Achievement**:
  - index.html: 84.5% reduction (1,581→246 lines) with 9 JavaScript modules
  - artist.html: 89.7% reduction (580→60 lines) with 3 specialized modules
- **Status**: Production-ready with enterprise-grade architecture

#### 🗺️ Guia Turístico - Interactive Travel Guide
- Location-based travel recommendations and cultural insights
- Interactive maps with route planning capabilities
- **Status**: Active development

### Development Excellence
- **Zero Build Process**: Direct browser execution with live development server
- **Modern Standards**: HTML5, CSS Grid, ES6+ JavaScript with defer loading
- **Performance Optimized**: Parallel script loading and intelligent caching
- **Accessibility Compliant**: WCAG 2.1 AA standards with semantic markup
- **Development Velocity**: 50% faster implementation using established modular patterns

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
