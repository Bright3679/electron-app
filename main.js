const { app, BrowserWindow } = require('electron');
const path = require('path');
const createServer = require('./server/server');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, '/src/js/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            allowRunningInsecureContent: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, '/src/pages/login.html'));
}

const serverApp = createServer();
const PORT = process.env.PORT || 3000;
const server = serverApp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('quit', () => {
    server.close();
});