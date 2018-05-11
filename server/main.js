const path = require('path');
const os = require('os');
const { app, BrowserWindow, ipcMain, Tray, Menu, MenuItem, shell, remote, dialog } = require('electron');
const AutoLaunch = require('auto-launch');
const DriverManager = require('./services/driver-manager');
const PackageManager = require('./services/package-manager');

PackageManager.init();

let isAutoLauchEnabled = false;
const autoLauncher = new AutoLaunch({
    name: 'NEEO - Driver Manager',
});
function enableAutoLaunch() {
  autoLauncher.enable().then(() => isAutoLauchEnabled = true);
}
function disableAutoLaunch() {
  autoLauncher.disable().then(() => isAutoLauchEnabled = false);
}
autoLauncher.enable();
autoLauncher.isEnabled()
  .then(function(isEnabled){
    isAutoLauchEnabled = isEnabled;
  });

require('./index');

const assetsDir = path.resolve(__dirname, 'assets');

let tray;

app.on('ready', () => {
  tray = new Tray(path.resolve(assetsDir, 'tray-icon.png'));

  function getMenu() {
    return Menu.buildFromTemplate([
      {label: `Stop All Drivers`, click: () => DriverManager.stopAll()},
      {label: `Start All Drivers`, click: () => DriverManager.startAll()},
      { type: 'separator'},
      {label: `Running Drivers: ${DriverManager.getRunningDrivers().length}`},
      {label: `Installed Drivers: ${DriverManager.getAllDrivers().length}`},
      {label: `Total Memory: ${DriverManager.getAllDrivers().reduce((value, driver) => {
        return value + parseFloat(driver.memory);
      }, 0)}MB`, click: () => DriverManager.startAll()},
      { type: 'separator'},
      {label: 'Open Interface', click: function() { shell.openExternal('http://localhost:3000/') } },
      {label: 'Auto Start', type: 'checkbox', checked: isAutoLauchEnabled, click: () => {
        if (isAutoLauchEnabled) {
          disableAutoLaunch();
        } else {
          enableAutoLaunch();
        }
      }},
      {label: `Shutdown`, click: () => app.quit() }
    ]);
  }

  tray.on('drop-text', function (e, text) {
    dialog.showMessageBox({
      type: 'info',
      title: 'A Feature Idea!',
      message: 'This could be a REALLY nice. If the driver isn\'t on NPM, we could attempt to install from a drag and drop from a git repo or something!'
    });
  })

  tray.on('click', function() {
      tray.popUpContextMenu(getMenu())
  })
});
