const electron = require('electron');

const BrowserWindow = electron.BrowserWindow;

var Screen = function () {};

Screen.prototype.init = function (e) {
    if (this.window instanceof BrowserWindow) {
        this.window.on('closed', function () {
            console.info('Window closed.');
            this.window = null;
        });
    }
};

Screen.prototype.getBrowserWindow = function () {
    return this.window;
};

module.exports = Screen;
