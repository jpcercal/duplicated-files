const electron = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu          = electron.Menu;
const Tray          = electron.Tray;

require('./node_modules/dotenv/lib/main').config({
    path: __dirname + '/.env'
});

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

server.start(function () {
    if (server.isStarted()) {
        console.info('The HTTP Server was started.');
    }

    if (server.nodeIsStarted()) {
        console.info('PID [node]: ' + server.getNodePid());
    }

    if (server.javaIsStarted()) {
        console.info('PID [java]: ' + server.getJavaPid());
    }

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

app.on('quit', function () {
    console.info('Killing dependencies...');

    if (server.nodeIsStarted()) {
        process.kill(server.getNodePid());
    }

    if (server.javaIsStarted()) {
        process.kill(server.getJavaPid());
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
