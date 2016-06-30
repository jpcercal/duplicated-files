const child_process = require('child_process');
const plataform     = require('os').platform();
const $q            = require('../node_modules/q/q');

var Worker = function () {};

Worker.prototype.executeCommand = function (command, args) {
    var deferred = $q.defer();

    this.commandExists(command).then(function () {
        deferred.resolve(child_process.spawn(command, args));
    }, function (errorCode) {
        console.log(
            'The command "' + command + ' ' + args.join(' ') + '" that you are trying run not exists. ' +
            'It exit with the error code ' + errorCode + '.'
        );

        deferred.reject(command, args, errorCode);
    });

    return deferred.promise;
};

Worker.prototype.plataformIsWindows = function () {
    return plataform.indexOf('win') > -1;
};

Worker.prototype.commandExists = function (command) {
    var cmd, args, deferred, spawn;

    if (this.plataformIsWindows()) {
        cmd  = 'where';
        args = [command];
    } else {
        cmd  = 'whereis';
        args = ['ls', command];
    }

    deferred = $q.defer();

    spawn = child_process.spawn(cmd, args, {
        encoding: 'utf8'
    });

    spawn.on('close', function (code) {
        if (code === 0) {
            deferred.resolve(code);
        } else {
            deferred.reject(code);
        }
    });

    return deferred.promise;
};

Worker.prototype.filter = function (childProcess, callback) {
    if (childProcess !== null && typeof childProcess.stdout !== 'undefined') {
        childProcess.stdout.on('data', function(data) {
            callback(data.toString());
        });
    }
};

module.exports = Worker;
