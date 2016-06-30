const electron = require('electron');
const Screen   = require('./Screen');

const BrowserWindow = electron.BrowserWindow;

var SplashScreen = function () {
    this.window = new BrowserWindow({
        width:  500,
        height: 300,
        icon:   __dirname + '/../public/favicon.ico',
        title: 'Duplicated Files',
        center: true,
        show:   true,
        autoHideMenuBar: true,
        backgroundColor: '#E9E9E9',
        alwaysOnTop: true,
        frame:       false,
        transparent: true,
        resizable:   false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    this.window.loadURL(`file://${__dirname}/../public/splash-screen.html`);

    this.init();
};

SplashScreen.prototype = Object.create(Screen.prototype);

module.exports = SplashScreen;
