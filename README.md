# 🚀 DSA Visualizer

A comprehensive, interactive web application for visualizing Data Structures and Algorithms with a modern, responsive UI built with React and Tailwind CSS.

## ✨ Features

### 🎯 **Modern 3-Column Layout**
- **Left Sidebar**: Algorithm selection, input controls, and configuration options
- **Center Area**: Full-screen visualization canvas with interactive elements
- **Right Sidebar**: Pseudocode, complexity analysis, and results
- **Bottom Controls**: Play/pause/reset/speed controls in a dedicated footer

### 🔧 **Interactive Visualizations**
- **Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort with step-by-step animation
- **Data Structures**: Stack, Queue, Linked List with interactive operations
- **Tree Algorithms**: Binary Search Tree with traversal animations
- **Graph Algorithms**: BFS, DFS, Dijkstra's with interactive graph building

### 🌙 **Advanced UI Features**
- **Dark Mode Toggle**: Seamless theme switching with localStorage persistence
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Smooth Animations**: 300ms transitions for all interactive elements
- **Professional Styling**: Clean borders, rounded corners, and consistent theming

### 📊 **Performance Optimizations**
- **Code Splitting**: Vendor and application code separation
- **Tree Shaking**: Unused code removal for smaller bundles
- **Bundle Optimization**: Optimized static assets and CSS minification
- **Lazy Loading**: Efficient component loading and rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd dsa-visualizer

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development Commands
```bash
npm start          # Start development server
npm run build     # Build for production
npm run test      # Run tests
npm run eject     # Eject from Create React App
```

## 🌐 Deployment

### Vercel Deployment (Recommended)
The project is fully configured for Vercel deployment with:
- `vercel.json` configuration for optimal routing
- React Router SPA support
- Performance optimizations
- SEO-friendly configuration

#### Quick Deploy
1. **Connect to Vercel**: Import your GitHub repository
2. **Build Settings**:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Deploy**: Click deploy and enjoy!

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and deploy!
```

### Other Platforms
The project can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

## 🏗️ Project Structure

```
dsa-visualizer/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.js        # Navigation with dark mode toggle
│   │   ├── Controls.js      # Algorithm execution controls
│   │   ├── VisualizerCanvas.js # Visualization wrapper
│   │   ├── PseudocodePanel.js  # Algorithm pseudocode display
│   │   ├── ComplexityBox.js     # Time/space complexity info
│   │   └── VisualizerLayout.js  # Main layout component
│   ├── pages/               # Main application pages
│   │   ├── SortingVisualizer.js    # Sorting algorithms
│   │   ├── DataStructureVisualizer.js # Data structures
│   │   ├── TreeVisualizer.js       # Tree algorithms
│   │   └── GraphVisualizer.js      # Graph algorithms
│   ├── algorithms/          # Algorithm implementations
│   │   ├── sorting/         # Sorting algorithms
│   │   ├── dataStructures/  # Data structure classes
│   │   ├── trees/           # Tree algorithms
│   │   └── graphs/          # Graph algorithms
│   ├── App.js               # Main app with routing
│   └── index.js             # React entry point
├── public/                  # Static assets
├── vercel.json             # Vercel deployment config
├── craco.config.js         # Build optimizations
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🎨 UI Components

### VisualizerLayout
The main layout component that provides:
- Consistent 3-column layout across all visualizers
- Responsive design with proper breakpoints
- Dark mode support throughout the application
- Smooth transitions and animations

### Navigation & Controls
- **Navbar**: Responsive navigation with dark mode toggle
- **Controls**: Play, pause, next step, reset, and speed controls
- **Sidebar Panels**: Organized information and control sections

### Visualization Components
- **VisualizerCanvas**: Wrapper for all visualization content
- **PseudocodePanel**: Algorithm implementation with line highlighting
- **ComplexityBox**: Detailed complexity analysis with color coding

## 🔧 Configuration

### Tailwind CSS
- Custom color schemes for dark/light modes
- Responsive breakpoints and spacing
- Animation and transition utilities
- Component-specific styling

### Build Optimizations
- **CRACO**: Enhanced build configuration
- **Code Splitting**: Optimized bundle sizes
- **Tree Shaking**: Unused code removal
- **CSS Minification**: Compressed stylesheets

### Environment Variables
```bash
# Production optimizations
GENERATE_SOURCEMAP=false
REACT_APP_ENV=production
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px` - Stacked layout with mobile menu
- **Tablet**: `640px - 1024px` - Adaptive sidebar sizing
- **Desktop**: `> 1024px` - Full 3-column layout

### Mobile Features
- Collapsible navigation menu
- Touch-friendly controls
- Optimized canvas sizing
- Responsive typography

## 🚀 Performance Features

### Build Optimizations
- **Bundle Analysis**: `npm run build:analyze`
- **Code Splitting**: Automatic vendor chunk separation
- **Tree Shaking**: Dead code elimination
- **Scope Hoisting**: Module concatenation

### Runtime Performance
- Efficient React rendering with hooks
- Optimized animations and transitions
- Lazy loading for large visualizations
- Memory-efficient algorithm implementations

## 🔍 SEO & Accessibility

### Search Engine Optimization
- `robots.txt` for crawler guidance
- `sitemap.xml` for page discovery
- Semantic HTML structure
- Meta tags and descriptions

### Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (18+ required)
node --version
```

#### React Router Issues
- Ensure `vercel.json` has proper routing
- Check `public/_redirects` file exists
- Verify build output contains `index.html`

#### Performance Issues
```bash
# Analyze bundle
npm run build:analyze

# Check for large dependencies
npm ls --depth=0
```

## 📚 Learning Resources

### Algorithm Visualizations
- **Sorting**: Understand comparison-based algorithms
- **Data Structures**: Learn fundamental structures
- **Trees**: Explore hierarchical data organization
- **Graphs**: Master graph traversal and pathfinding

### Interactive Features
- Step-by-step algorithm execution
- Real-time complexity analysis
- Visual pseudocode highlighting
- Performance metrics display

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Follow existing component patterns
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add proper TypeScript types (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Tailwind CSS**: For utility-first styling
- **Vercel**: For seamless deployment
- **Open Source Community**: For inspiration and support

---

**Happy Learning! 🎓✨**

*Built with ❤️ using React, Tailwind CSS, and modern web technologies.*
