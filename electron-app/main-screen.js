const electron = require('electron');
const Screen   = require('./Screen');

const BrowserWindow = electron.BrowserWindow;

var MainScreen = function () {
    this.window = new BrowserWindow({
        width:     800,
        height:    600,
        minWidth:  800,
        minHeight: 600,
        icon:      __dirname + '/../public/favicon.ico',
        title:     'Duplicated Files',
        center:    true,
        show:      true,
        autoHideMenuBar: true,
        backgroundColor: '#E9E9E9'
    });

    this.window.loadURL(`file://${__dirname}/../public/index.html`);

    this.init();
};

MainScreen.prototype = Object.create(Screen.prototype);

module.exports = MainScreen;
