define(['popups','ibmmfpfanalytics', 'ibmmfpf'], function (popups, analytics, WL) {
    var securityCheckName = 'UserLogin';

    function init() {
        var isChallenged = false;
        var userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(securityCheckName);

        document.getElementById("login").addEventListener("click", login);
        document.getElementById("login").addEventListener("onkeypress", login);
        document.getElementById("logout").addEventListener("click", logout);

        userLoginChallengeHandler.securityCheckName = securityCheckName;

        userLoginChallengeHandler.handleChallenge = function (challenge) {
            WL.Logger.debug("handleChallenge");
            showLoginDiv();
            isChallenged = true;
            var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
            if (challenge.errorMsg !== null) {
                statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
            }
            document.getElementById("statusMsg").innerHTML = statusMsg;

        };

        userLoginChallengeHandler.handleSuccess = function (data) {
            WL.Logger.debug("handleSuccess");
            isChallenged = false;
            document.getElementById("rememberMe").checked = false;
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            //document.getElementById("helloUser").innerHTML = "Hello, " + data.user.displayName;
            showNavBar();
            showProtectedDiv();
            analytics.addEvent({ 'Login': 'onSuccess' });
            analytics.send();
        };

        userLoginChallengeHandler.handleFailure = function (error) {
            WL.Logger.debug("handleFailure: " + error.failure);
            isChallenged = false;
            if (error.failure !== null) {
                if (error.failure == "Account blocked") {
                    document.getElementById("loginDiv").style.display = "none";
                    document.getElementById("statusMsg").innerHTML = "Your account is blocked. Try again later.";
                }
                var popupS = require('popups');
                popupS.alert({
                    content: error.failure
                });
                //alert(error.failure);
            } else {
                var popupS = require('popups');
                popupS.alert({
                    content: "Failed to login."
                });
                //alert("Failed to login.");
            }
        };

        function login() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var rememberMeState = document.getElementById("rememberMe").checked;
            if (username === "" || password === "") {
                var popupS = require('popups');
                popupS.alert({
                    content: "Username and password are required."
                });
                //alert("Username and password are required");
                return;
            }
            if (isChallenged) {
                userLoginChallengeHandler.submitChallengeAnswer({ 'username': username, 'password': password, rememberMe: rememberMeState });
            } else {
                WLAuthorizationManager.login(securityCheckName, { 'username': username, 'password': password, rememberMe: rememberMeState }).then(
                    function () {
                        WL.Logger.debug("login onSuccess");
                        analytics.addEvent({ 'Login': 'onSuccess' });
                        analytics.send();
                    },
                    function (response) {
                        WL.Logger.debug("login onFailure: " + JSON.stringify(response));
                        analytics.addEvent({ 'Login': 'onFailure' });
                        analytics.send();
                    });
            }
        }

        function logout() {
            WLAuthorizationManager.logout(securityCheckName).then(
                function () {
                    WL.Logger.debug("logout onSuccess");
                    analytics.addEvent({ 'Logout': 'onSuccess' });
                    analytics.send();
                    location.reload();
                },
                function (response) {
                    WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
                });
        }

        return userLoginChallengeHandler;
    }

    function checkIsLoggedIn() {
        WLAuthorizationManager.obtainAccessToken(securityCheckName).then(
            function () {
            },
            function (response) {
                WL.Logger.debug("checkIsLoggedIn onFailure: " + JSON.stringify(response));
            });
    }

    return {
        init: init,
        securityCheckName: securityCheckName,
        checkIsLoggedIn: checkIsLoggedIn
    };
});

