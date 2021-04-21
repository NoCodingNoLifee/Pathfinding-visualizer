import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

import menu from './menu';

const isWindows = process.platform === 'win32';

let mainWindow: BrowserWindow | null;

function createWindow() {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  let mainWindow: BrowserWindow,
    x = 50,
    y = 50;
  if (externalDisplay) {
    x += externalDisplay.bounds.x;
    y += externalDisplay.bounds.y;
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    x: x,
    y: y,
    frame: isWindows ? false : true, //Remove frame to hide default menu,
    icon: path.join(__dirname, '../../dist/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  //const menu = Menu.buildFromTemplate(menu);
  //Menu.setApplicationMenu(menu);

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '../../dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  );

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
ipcMain.on(`display-app-menu`, function (e, args) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y,
    });
  }
});
