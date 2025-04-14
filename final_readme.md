### 🚀 Running the Dashboard Locally

To run the Netflix/Streaming Trends Analyzer dashboard locally, a **local server is required** because modern browsers block local file access when using `fetch()`.

#### 🟢 Option 1: VS Code + Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**
2. Install the **Live Server** extension:
   - Click the Extensions icon (or press `Ctrl+Shift+X`)
   - Search for `"Live Server"` and click **Install**
3. Right-click on `index.html` and select **“Open with Live Server”**
4. The dashboard will open in your browser

#### 🔵 Option 2: Python (If Python is installed)
1. Open a terminal
2. Navigate to your project folder:
   ```bash
   cd /path/to/your/project
   ```
3. Start a local server:
   ```bash
   python -m http.server
   ```
4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

#### 🔶 Option 3: Node.js (Alternative)
1. Install the server (if not already installed):
   ```bash
   npm install -g http-server
   ```
2. Start the server:
   ```bash
   http-server .
   ```
3. Open your browser at:
   ```
   http://localhost:8080
   ```

> **Note:** Opening `index.html` by double-clicking will not work properly due to browser security restrictions. Always use a local server.

