# 🧩 Dynamic Maze Solver

A beautiful, interactive web application that visualizes pathfinding algorithms in real-time. Built with HTML, TailwindCSS, and JavaScript, featuring modern glass morphism design and responsive layout.

![Maze Solver Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![Responsive](https://img.shields.io/badge/Responsive-Yes-blue) ![No Build Tools](https://img.shields.io/badge/Build%20Tools-None-orange)

## ✨ Features

### 🎯 **Core Functionality**
- **Custom Grid Dimensions**: Create N×M mazes (5×5 to 50×50)
- **Dynamic Source & Destination**: Click to place start and end points
- **Interactive Wall Editing**: Toggle walls by clicking cells
- **Real-time Visualization**: Watch algorithms explore the maze

### 🧠 **Pathfinding Algorithms**
- **Dijkstra's Algorithm**: Guaranteed shortest path finder
- **A* Algorithm**: Optimized with Manhattan distance heuristic
- **Side-by-side Comparison**: Run both algorithms and compare performance

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful translucent interface
- **Light & Dark Themes**: Toggle between themes with persistent preference
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Works on all devices (mobile to desktop)
- **Interactive Elements**: Engaging hover effects and visual feedback

### 📊 **Performance Analytics**
- **Execution Time**: Precise timing for each algorithm
- **Steps Explored**: Count of cells examined
- **Path Distance**: Length of the shortest path found
- **Real-time Stats**: Live updates during solving

## 🚀 Quick Start

### **Option 1: Direct Download**
1. Download all files (`index.html`, `styles.css`, `script.js`)
2. Open `index.html` in any modern web browser
3. Start creating and solving mazes!

### **Option 2: Local Server**
```bash
# If you have Python installed
python -m http.server 8000

# If you have Node.js installed
npx serve .

# Then open http://localhost:8000
```

## 🎮 How to Use

### **1. Setup Your Maze**
- 📏 **Set Dimensions**: Enter rows and columns (5-50 each)
- 🎲 **Generate Maze**: Click "Generate Maze" for random layout
- 🎯 **Place Source**: Select "Set Source" mode and click a cell
- 🏁 **Place Destination**: Select "Set Destination" mode and click a cell

### **2. Customize (Optional)**
- 🧱 **Edit Walls**: Select "Toggle Wall" mode and click cells
- ⚡ **Choose Algorithm**: Select Dijkstra's or A* from dropdown
- 🌙 **Switch Themes**: Click the theme toggle button (🌙/☀️) in the header

### **3. Solve & Analyze**
- 🚀 **Solve Maze**: Click "Solve Maze" to watch the algorithm work
- 📊 **Compare Algorithms**: Use "Run Both Algorithms" for comparison
- 📈 **View Stats**: Check execution time, steps, and path distance

## 🛠️ Technical Details

### **Built With**
- **HTML5**: Semantic structure
- **TailwindCSS**: Utility-first CSS framework
- **JavaScript (ES6+)**: Modern vanilla JavaScript
- **CSS3**: Custom animations and glass morphism effects

### **Architecture**
```
📁 Project Structure
├── 📄 index.html      # Main HTML structure
├── 🎨 styles.css      # Custom CSS and animations
├── ⚙️ script.js       # Application logic
└── 📖 README.md       # Documentation
```

### **Key Components**
- **MazeSolver Class**: Main application logic
- **Pathfinding Algorithms**: Dijkstra's and A* implementations
- **Responsive Grid System**: Dynamic cell sizing
- **Animation Engine**: Smooth visualization effects

## 🎨 Design Features

### **Glass Morphism UI**
- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Modern, elegant appearance
- **Dual Theme Support**: Light and dark modes with smooth transitions

### **Responsive Design**
- **Mobile First**: Optimized for small screens
- **Breakpoints**: 640px, 768px, 1024px
- **Adaptive Layouts**: Grid columns adjust by screen size
- **Scalable Typography**: Font sizes adapt to device

### **Interactive Elements**
- **Hover Effects**: 3D transforms and glows
- **Click Feedback**: Visual response to user actions
- **Smooth Transitions**: 0.3s ease animations
- **Loading States**: Visual feedback during processing

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|---------|
| Chrome | 70+ | ✅ Full Support |
| Firefox | 65+ | ✅ Full Support |
| Safari | 12+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |

## 🔧 Customization

### **Adding New Algorithms**
```javascript
// In script.js, add your algorithm to the MazeSolver class
async yourAlgorithm() {
    // Implementation here
    // Use this.animateCell(row, col, 'explored') for visualization
}
```

### **Styling Modifications**
```css
/* In styles.css, customize colors */
.glass-effect {
    background: rgba(your-color, 0.25);
    /* Modify other properties */
}
```

### **Grid Customization**
```javascript
// Modify in script.js
this.rows = parseInt(document.getElementById('gridRows').value) || 10;
this.cols = parseInt(document.getElementById('gridCols').value) || 10;
```

## 🚀 Performance Optimizations

- **Hardware Acceleration**: CSS transforms use GPU
- **Efficient Algorithms**: Optimized pathfinding implementations
- **Dynamic Cell Sizing**: Responsive to grid dimensions
- **Async Operations**: Non-blocking UI during solving
- **Memory Management**: Proper cleanup of event listeners

## 🐛 Troubleshooting

### **Common Issues**

**Maze not generating?**
- Check if grid dimensions are between 5-50
- Ensure JavaScript is enabled in your browser

**Algorithms not working?**
- Make sure source and destination are placed
- Verify there's a valid path between points

**Performance issues on large grids?**
- Try smaller grid sizes (under 30×30)
- Close other browser tabs for better performance

**Responsive issues?**
- Clear browser cache and reload
- Check if you're using a supported browser version

## 📈 Future Enhancements

- 🎯 **More Algorithms**: BFS, DFS, Greedy Best-First
- 🎨 **Custom Themes**: User-defined color schemes
- 💾 **Save/Load**: Export maze configurations
- 🔄 **Animation Speed**: Adjustable visualization speed
- 📊 **Advanced Analytics**: Path visualization comparison
- 🎮 **Game Mode**: Timed challenges and scoring

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Submit pull requests
- 📖 Improve documentation

## 👨‍💻 Author

Created with ❤️ for educational purposes and algorithm visualization.

---

**Happy Pathfinding! 🗺️✨**

> "The best way to understand an algorithm is to watch it work."
