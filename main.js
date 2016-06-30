const electron = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu          = electron.Menu;
const Tray          = electron.Tray;

const SplashScreen = require('./electron-app/splash-screen.js');
const ErrorScreen  = require('./electron-app/error-screen.js');
const MainScreen   = require('./electron-app/main-screen.js');
const HttpServer   = require('./electron-app/http-server.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainScreen;
let splashScreen;
let errorScreen;

let server = new HttpServer();

server.start(function (nodePid, javaPid) {
    console.info('Status of dependencies: ' + (server.isStarted() ? 'ON' : 'OFF'));

    console.info('PID [node]: ' + server.getNodePid());
    console.info('PID [java]: ' + server.getJavaPid());

    mainScreen = (new MainScreen()).getBrowserWindow();

    splashScreen.close();
}, function (errors) {
    errorScreen = (new ErrorScreen()).getBrowserWindow();

    splashScreen.close();

    console.log(errors);
});

function createSplashScreen () {
    splashScreen = (new SplashScreen()).getBrowserWindow();
}

app.on('ready', createSplashScreen);

app.on('window-all-closed', function () {
    console.info('Running the event "window-all-closed".');

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    console.info('Running the event "activate".');

    if (mainScreen === null) {
        createSplashScreen();
    }
});

app.on('browser-window-created', function (e, window) {
    console.info('Running the event "browser-window-created".');

    window.setMenu(null);
});
