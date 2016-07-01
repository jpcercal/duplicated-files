const $q     = require('../node_modules/q/q');
const Worker = require('./Worker');

var HttpServer = function () {
    this.pid = {
        node: null,
        java: null
    };
};

HttpServer.prototype.getNodePid = function () {
    return this.pid.node;
};

HttpServer.prototype.getJavaPid = function () {
    return this.pid.java;
};

HttpServer.prototype.nodeIsStarted = function () {
    return this.pid.node !== null;
};

HttpServer.prototype.javaIsStarted = function () {
    return this.pid.java !== null;
};

HttpServer.prototype.javaIsDisabled = function () {
    if (process.env.HTTP_SERVER_JAVA_DISABLED === 'undefined') {
        return false;
    }

    var validValues = [
        '1',
        'true',
        'yes',
        'on'
    ];

    var currentValue = process.env.HTTP_SERVER_JAVA_DISABLED;

    return validValues.indexOf(currentValue.toLowerCase()) > -1;
};

HttpServer.prototype.isStarted = function () {
    return this.nodeIsStarted() && (this.javaIsStarted() || this.javaIsDisabled());
};

HttpServer.prototype.start = function (callbackSuccess, callbackError) {
    var executeNodeServer = function () {
        var executor = new Worker();

        var cmd  = 'node';
        var args = [
            './node_modules/http-server/bin/http-server',
            executor.plataformIsWindows() ? 'c:/' : '/',
            '8080'
        ];

        var deferred = $q.defer();

        executor.executeCommand(cmd, args).then(function (childProcess) {
            childProcess.on('close', function (code) {
                console.log('Node: ChildProcess was closed with the exit code ' + code);
            });

            executor.filter(childProcess, function (line) {
                if (line.indexOf('Hit CTRL-C to stop the server') != -1) {
                    deferred.resolve(childProcess.pid);
                }
            });
        }, function (command, args, errorCode) {
            deferred.reject(command, args, errorCode);
        });

        return deferred.promise;
    };

    var executeJavaServer = function () {
        var executor = new Worker();

        var cmd  = 'java';
        var args = [
            '-jar',
            './target/comparator-0.0.1-SNAPSHOT.jar'
        ];

        var deferred = $q.defer();

        var showLine = false;

        var deferred = $q.defer();

        executor.executeCommand(cmd, args).then(function (childProcess) {
            childProcess.on('close', function (code) {
                console.log('Java: ChildProcess was closed with the exit code ' + code);
            });

            executor.filter(childProcess, function (line) {
                if (showLine === true) {
                    console.info(line);
                }

                if (line.indexOf('Started App in') != -1) {
                    showLine = true;
                    deferred.resolve(childProcess.pid);
                }
            });
        }, function (command, args, errorCode) {
            deferred.reject(command, args, errorCode);
        });

        return deferred.promise;
    };

    var self = this;

    if (this.javaIsDisabled()) {
        return executeNodeServer().then(function (processId) {
            self.pid.node = processId;
            callbackSuccess(processId, null);
        }, function (command, args, errorCode) {
            callbackError(command, args, errorCode);
        });
    } else {
        return $q.all([
            executeNodeServer(),
            executeJavaServer()
        ]).then(function (processIds) {
            self.pid.node = processIds[0];
            self.pid.java = processIds[1];
            callbackSuccess(processIds[0], processIds[1]);
        }, function (errors) {
            callbackError(errors);
        });
    }
};

module.exports = HttpServer;
