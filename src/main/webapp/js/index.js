require.config({
    'paths': {
        'popups': '../node_modules/popups/dist/popupS.min',
        'ibmmfpfanalytics': '../node_modules/ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics',
        'ibmmfpf': '../node_modules/ibm-mfp-web-sdk/ibmmfpf',
        'challengehandler': 'UserLoginChallengeHandler',
        'badwords': 'BadWords',
        'messages': 'Messages',
    }
});

require(['popups', 'ibmmfpfanalytics', 'ibmmfpf', 'challengehandler', 'badwords', 'messages'],
    function (popups, analytics, WL, CH, BW, Msj) {
       var wlInitOptions = {
            mfpContextRoot: '/mfp',
            applicationId: 'com.push.webapp'
        };

        WL.Client.init(wlInitOptions).always(function () {
            //analytics.logger.updateConfigFromServer();
            analytics.enableAutoSend(true);
            console.log('MobileFirstPlatform initialized');
            CH.init();
            WLAuthorizationManager.obtainAccessToken(CH.securityCheckName).then(
                function (accessToken) {
                    WL.Logger.debug("obtainAccessToken onSuccess");
                    app.getApps();
                    showNavBar();
                    showProtectedDiv();
                    analytics.logger.pkg('com.ibm.mfpstarterweb.obtainAccessToken').info('obtainAccessToken onSuccess');
                    analytics.send();
                },
                function (response) {
                    WL.Logger.debug("obtainAccessToken onFailure: " + JSON.stringify(response));
                    analytics.logger.pkg('com.ibm.mfpstarterweb.obtainAccessToken').error('obtainAccessToken onFailure', JSON.stringify(response));
                    analytics.send();
                });

            app.init();
        });

        var packageId = "";
        var all_platforms = "ALL";
        var google_platform = "G";
        var apple_platform = "A";
        var platforms = "";

        var app = {
            //Change language
            "languageChanged": function languageChanged(lang) {
                switch (lang) {
                    case "en":
                        Msj.setEnglish();
                        break;
                    case "en-US":
                        Msj.setEnglish();
                        break;
                    default:
                        break;
                }
            },
            //initialize app
            "init": function init() {
                $("#getToken").on("click", function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    $this.button('loading');
                    setTimeout(function () {
                        $this.button('reset');
                        app.getToken();
                    }, 1000);
                });
                $("#pushTittle").on("click", function (e) {
                    location.reload();
                });

                var userLang = navigator.language || navigator.userLanguage;
                app.languageChanged(userLang);

                //Set names
                document.getElementById("adminLink").addEventListener("click", app.showAdmin, false);
                //document.getElementById("sendbydevice").addEventListener("click", app.rowRightClick, false);

                $("#main_title").html(Msj.Messages.mainTittle);
                $("#login").html(Msj.Messages.loginButton);
                $("#pushTittle").html(Msj.Messages.pushTittle);
                document.getElementById("logout").innerHTML = "<span class='glyphicon glyphicon-log-out'></span> " + Msj.Messages.logoutButton;
                document.getElementById("labelDevices").innerHTML = "<span class='glyphicon glyphicon-phone'></span> " + Msj.Messages.popupDevices;
                document.getElementById("labelUsrname").innerHTML = "<span class='glyphicon glyphicon-user'></span> " + Msj.Messages.popupID;
                document.getElementById("usrname").placeholder = Msj.Messages.popupID;
                document.getElementById("labelPsw").innerHTML = "<span class='glyphicon glyphicon-eye-open'></span> " + Msj.Messages.popupSecret;
                document.getElementById("psw").placeholder = Msj.Messages.popupSecret;
                document.getElementById("labelMsj").innerHTML = "<span class='glyphicon glyphicon-align-left'></span> " + Msj.Messages.popupMessage;
                document.getElementById("msj").placeholder = Msj.Messages.popupMessage + "...";
                document.getElementById("btnSendTo").innerHTML = Msj.Messages.popupSendTo + "<span class='caret'></span> ";
                document.getElementById("usernamep").innerHTML = Msj.Messages.user;
                document.getElementById("passwordp").innerHTML = Msj.Messages.password;
                document.getElementById("username").placeholder = Msj.Messages.user;
                document.getElementById("password").placeholder = Msj.Messages.password;
                document.getElementById("rememberMeText").innerHTML = Msj.Messages.remembermeChk + " <input type='checkbox' id='rememberMe' class='loginInput' /> ";
                document.getElementById("alertDevices").innerHTML = Msj.Messages.alertDevices;
                document.getElementById("loadingApps").innerHTML = Msj.Messages.loadingApps;
                document.getElementById("getToken").innerHTML = "<span class='glyphicon glyphicon-send'></span> " + Msj.Messages.popupSendBtn;
                $('#getToken').data('loading-text', Msj.Messages.popupSendingBtn);


                this.testServerConnection();
            },
            //test server connection
            "testServerConnection": function testServerConnection() {
                var statusElement = document.getElementById("status_mfp");
                WL.AuthorizationManager.obtainAccessToken()
                    .then(
                        function (accessToken) {
                            statusElement.innerHTML = Msj.Messages.connectedMessage;
                            //document.getElementById("dot").style.backgroundColor = "green";
                            /*titleText.innerHTML = "Yay!";
                            statusText.innerHTML = "Connected to MobileFirst Server";*/
                        },
                        function (error) {
                            statusElement.innerHTML = Msj.Messages.connectedFailure;
                            //document.getElementById("dot").style.backgroundColor = "red";
                            /*titleText.innerHTML = "Bummer...";
                            statusText.innerHTML = "Failed to connect to MobileFirst Server";*/
                        }
                    );
            },
            //get app from server 
            "getApps": function getApps() {
                $("#loadMe").modal({
                    backdrop: "static", //remove ability to close modal with click
                    keyboard: false, //remove option to close with keyboard
                    show: true //Display loader!
                });
                setTimeout(function () {
                    var resourceRequest = new WL.ResourceRequest("/adapters/pushWebAdapter/getApps", WL.ResourceRequest.GET);
                    resourceRequest.send().then(
                        (response) => {
                            analytics.logger.pkg('com.ibm.mfpstarterweb.getapps').info('getApps(): Success', response.responseJSON);
                            analytics.send();
                            document.getElementById("displayName").innerHTML = "<span class='glyphicon glyphicon-cog'></span> " + Msj.Messages.hello + response.responseJSON.displayName;
                           var table = new Tabulator("#example-table", {
                                //data: response.responseJSON.items,
                                layout: "fitColumns",
                                dataTreeChildField: "envs",
                                columns: [
                                    { title: Msj.Messages.columnName, field: "displayName" },
                                    { title: Msj.Messages.columnPackageId, field: "name" },
                                    { title: "Android/iOS/Web", field: "environment" },
                                ],
                                selectable: 1,
                                dataTree: true,
                                dataTreeStartExpanded: false,
                                pagination: "local",
                                paginationSize: 10,
                                selectableCheck: function (row) {
                                    //row - row component
                                    return row.getData().name != undefined;
                                },
                                rowSelectionChanged: function (data, row) {
                                    app.rowSelected(data, row);
                                },
                                rowDeselected: function (row) {
                                    cleanPopup();
                                    packageId = "";
                                },
                                /*pageLoaded: function (pageno) {
                                    console.log("Numero de pagina: " + pageno);
                                },
                                rowContext: function (e, row) {
                                    e.preventDefault();
                                    var left = e.pageX;
                                    var top = e.pageY;
                                    var theHeight = $('.popover').height();
                                    $('.popover').show();
                                    $('.popover').css('left', (left + 10) + 'px');
                                    $('.popover').css('top', (top - (theHeight / 2) - 10) + 'px');
                                    console.log("Clic derecho: " + row); 
                                },*/
                            });
                            table.setData(response.responseJSON.items);

                            for (var i in response.responseJSON.items) {
                                $('#nav-pills').append('<li id="' + response.responseJSON.items[i].name + '" role="presentation" class=""><a href="#'
                                    + response.responseJSON.items[i].displayName + '" aria-controls="'
                                    + response.responseJSON.items[i].displayName + '" role="tab" data-toggle="tab">'
                                    + response.responseJSON.items[i].displayName
                                    + '<span class="badge">' + response.responseJSON.items[i].envs.length
                                    + '</span></a></li>');
                                var li = document.getElementById(response.responseJSON.items[i].name);
                                li.addEventListener('click', app.setData, false);
                            }
                            //Tabulator.prototype.registerModule("page", Page);
                        }, (error) => {
                            analytics.logger.pkg('com.ibm.mfpstarterweb.getapps').error('getApps(): ERROR', error.responseJSON);
                            analytics.send();
                            var popupS = require('popups');
                            popupS.alert({
                                content: 'Error. ' + error.responseJSON.errors[0]
                            });
                            console.log('-->  getApps():  ERROR ', error.responseJSON.errors[0]);
                        }
                    );
                    $("#loadMe").modal("hide");
                }, 1000);
            },
            //on row selected 
            "rowSelected": function rowSelected(data, row) {
                if (data.length > 0) {
                    cleanPopup();
                    packageId = row[0]._row.data.name;
                    CH.checkIsLoggedIn();

                    $('#appslist').append('<li id="Todos"><a href="#">' + Msj.Messages.all + '</a></li>');
                    var li = document.getElementById("Todos");
                    li.addEventListener('click', app.setPlatforms, false);
                    for (var i = 0; i < row[0]._row.data.envs.length; i++) {
                        $('#appslist').append('<li id="' + row[0]._row.data.envs[i].environment
                            + '"><a href="#">'
                            + row[0]._row.data.envs[i].environment + '</a></li>');
                        var li = document.getElementById(row[0]._row.data.envs[i].environment);
                        li.addEventListener('click', app.setPlatforms, false);
                    }

                    var resourceRequestDevices = new WL.ResourceRequest("/adapters/pushWebAdapter/getDevices", WL.ResourceRequest.GET);
                    resourceRequestDevices.setQueryParameter("params", "['" + Msj.runtime + "', '" + row[0]._row.data.name + "']");
                    resourceRequestDevices.send().then(
                        (responseDevices) => {
                            if (responseDevices.responseJSON.hasOwnProperty('devices')) {
                                $('#devices').val(responseDevices.responseJSON.devices.length);
                                if (responseDevices.responseJSON.devices.length <= 0) {
                                    $('#alertDevices').show();
                                } else {
                                    $('#alertDevices').hide();
                                }
                            } else {
                                $('#devices').val(0);
                                $('#alertDevices').show();
                            }
                            analytics.logger.pkg('com.ibm.mfpstarterweb.getdevices').info('getdevices: Success', responseDevices.responseJSON);
                        }, (errorDevices) => {
                            analytics.logger.pkg('com.ibm.mfpstarterweb.getdevices').error('getdevices: ERROR', errorDevices.responseJSON);
                            analytics.send();
                            var popupS = require('popups');
                            popupS.alert({
                                content: 'Error. ' + errorDevices.responseJSON.errors[0]
                            });
                        });
                    // generate popup
                    $('#myModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }
            },
            //Right clic on rows
            /*"rowRightClick": function rowRightClick() {
                $('.popover').hide();
                setTimeout(function () {
                    var resourceRequest = new WL.ResourceRequest("/adapters/pushWebAdapter/getPushDeviceRegistration", WL.ResourceRequest.GET);
                    resourceRequest.setQueryParameter("params", "['mfp', 'com.gbm.chat', '" + 0 + "', '" + 5 + "']");
                    resourceRequest.send().then(
                        (response) => {
                            var tableDevices = new Tabulator("#devices-table", {
                                layout: "fitColumns",
                                columns: [
                                    { title: Msj.Messages.columnName, field: "deviceId" },
                                    { title: Msj.Messages.columnPackageId, field: "platform" },
                                ],
                                selectable: 1,
                                dataTree: true,
                                dataTreeStartExpanded: false,
                                pagination: "local",
                                paginationSize: 3,
                                paginationButtonCount: 2,
                                selectableCheck: function (row) {
                                    return row.getData().name != undefined;
                                },
                                rowSelectionChanged: function (data, row) {
                                },
                                rowDeselected: function (row) {
                                },
                                pageLoaded: function (pageno) {
                                    console.log("Numero de pagina: " + pageno);
                                },
                            });
                            tableDevices.setData(response.responseJSON.devices);
                        }, (error) => {
                            analytics.logger.pkg('com.ibm.mfpstarterweb.getapps').error('getApps(): ERROR', error.responseJSON);
                            analytics.send();
                            var popupS = require('popups');
                            popupS.alert({
                                content: 'Error. ' + error.responseJSON.errors[0]
                            });
                            console.log('-->  getApps():  ERROR ', error.responseJSON.errors[0]);
                        }
                    );
                }, 1000);
            },*/
            //get token and send message 
            "getToken": function getToken() {
                var client_id = document.getElementById('usrname').value.trim();
                var client_clave = document.getElementById('psw').value.trim();
                var msjtmp = document.getElementById('msj').value.trim();

                if (!app.validateCredentials(client_id, client_clave, msjtmp, platforms)) {
                    return;
                }
                var message = BW.censore(msjtmp, BW.badWords);
                var resourceRequest = new WL.ResourceRequest("/adapters/pushWebAdapter/getToken", WL.ResourceRequest.GET);
                resourceRequest.setQueryParameter("params", "['" + client_id + "', '" + client_clave + "', '" + packageId + "']");
                resourceRequest.send().then(
                    (response) => {
                        if (checkStatus(response.responseJSON, analytics, packageId)) {
                            console.log('-->  getToken(): Success ', response.responseJSON);
                            analytics.logger.pkg('com.ibm.mfpstarterweb.token').info(' getToken(): Success ');
                            analytics.send();
                            var token = response.responseJSON.access_token;

                            var resourceRequestPush = new WL.ResourceRequest("/adapters/pushWebAdapter/sendPush", WL.ResourceRequest.GET);
                            resourceRequestPush.setQueryParameter("params", "['" + packageId + "','" + token
                                + "', '" + platforms + "' ,'" + message + "']");
                            resourceRequestPush.send().then(
                                (responsePush) => {
                                    if (checkStatus(responsePush.responseJSON, analytics, packageId)) {
                                        $('#myModal').modal("hide");
                                        var displayName = responsePush.responseJSON.displayName;
                                        var obj = {
                                            'Username': displayName,
                                            'Confidential Client ID': client_id,
                                            'Send to': packageId,
                                            'Platforms': platforms,
                                            'Message': message,
                                            'Date': Date()
                                        };
                                        analytics.addEvent(obj);
                                        analytics.logger.pkg('com.ibm.mfpstarterweb.push').info('sendPush(): Success ', obj);
                                        analytics.send();
                                        packageId = "";
                                        console.log('-->  sendPush(): Success ', responsePush.responseJSON);
                                        setTimeout(function () {
                                            swal(Msj.Messages.information_, Msj.Messages.sendPushSuccessMessage_, "success");
                                        }, 500);
                                    } else {
                                        analytics.addEvent({ 'Confidential Client ID': client_id, 'Send Push App Failure': packageId, 'Message': message });
                                        analytics.logger.pkg('com.ibm.mfpstarterweb.push').debug('sendPush(): ERROR', { 'Confidential Client ID': client_id, 'Send Push App Failure': packageId, 'Message': message });
                                        analytics.send();
                                    }
                                }, (errorPush) => {
                                    console.log('-->  sendPush():  ERROR ', errorPush.responseJSON.errors[0]);
                                    analytics.logger.pkg('com.ibm.mfpstarterweb.push').error('sendPush(): ERROR', errorPush.responseJSON);
                                    analytics.send();
                                }
                            );
                        } else {

                        }
                    }, (error) => {
                        console.log('-->  getToken():  ERROR ', error.responseJSON.errors[0]);
                        analytics.logger.pkg('com.ibm.mfpstarterweb.token').error('getToken(): ERROR', error.responseJSON);
                        analytics.send();
                        checkError(error.responseJSON.errors[0]);
                    }
                );
            },
            "showAdmin": function showAdmin() {
                document.getElementById('loginDiv').style.display = 'none';
                document.getElementById('protectedDiv').style.display = 'none';
                document.getElementById('adminDiv').style.display = 'block';
            },
            //validate credentials and message
            "validateCredentials": function validateCredentials(client_id,
                client_clave, message, platforms) {
                var boolean = true;
                if (client_id == "") {
                    document.getElementById("usrname").style.borderColor = "red";
                    $('#usrname').tooltip({ title: "Ingrese el ID", placement: "top" });
                    $('#usrname').tooltip('show');
                    boolean = false;
                } else {
                    document.getElementById("usrname").style.borderColor = "#17a2b8";
                    $('#usrname').tooltip('hide');
                }
                if (client_clave == "") {
                    document.getElementById("psw").style.borderColor = "red";
                    $('#psw').tooltip({
                        title: "Ingrese la credencial",
                        placement: "top"
                    });
                    $('#psw').tooltip('show');
                    boolean = false;
                } else {
                    document.getElementById("psw").style.borderColor = "#17a2b8";
                    $('#psw').tooltip('hide');
                }
                if (message == "") {
                    document.getElementById("msj").style.borderColor = "red";
                    $('#msj').tooltip({ title: "Ingrese el mensaje", placement: "top" });
                    $('#msj').tooltip('show');
                    boolean = false;
                } else {
                    document.getElementById("msj").style.borderColor = "#17a2b8";
                    $('#msj').tooltip('hide');
                }
                if (platforms == "") {
                    document.getElementById("appsbox").style.borderColor = "red";
                    $('#sendTo').tooltip({ title: "Seleccione una opción", placement: "top" });
                    $('#sendTo').tooltip('show');
                    boolean = false;
                } else {
                    document.getElementById("appsbox").style.borderColor = "#17a2b8";
                    $('#sendTo').tooltip('hide');
                }
                return boolean;
            },
            //add platforms to dropdown list
            "setData": function setData() {
                document.getElementById('two').style.display = 'none';
                //var activeTab = $("#one").find(".active");
                var packageId = $(this).attr('id');
                $('#appslist2').empty();
                $('#appsbox2').val("");
                var resourceRequest = new WL.ResourceRequest("/adapters/pushWebAdapter/getApp", WL.ResourceRequest.GET);
                resourceRequest.setQueryParameter("params", "['" + Msj.runtime + "','" + packageId + "']");
                resourceRequest.send().then(
                    (response) => {
                        analytics.logger.pkg('com.ibm.mfpstarterweb.getapp').info('getApp(): Success', response.responseJSON);
                        analytics.send();
                        $('#appslist2').append('<li id="Todos"><a href="#">Todos</a></li>');
                        var li = document.getElementById("Todos");
                        li.addEventListener('click', app.setPlatforms, false);
                        for (var i = 0; i < response.responseJSON.envs.length; i++) {
                            $('#appslist2').append('<li id="' + response.responseJSON.envs[i].environment
                                + '"><a href="#">'
                                + response.responseJSON.envs[i].environment + '</a></li>');
                            var li = document.getElementById(response.responseJSON.envs[i].environment);
                            li.addEventListener('click', app.setPlatforms, false);
                        }
                        document.getElementById('two').style.display = 'block';
                    }, (error) => {
                        document.getElementById('two').style.display = 'none';
                        analytics.logger.pkg('com.ibm.mfpstarterweb.getapp').error('getApp(): ERROR', error.responseJSON);
                        analytics.send();
                        var popupS = require('popups');
                        popupS.alert({
                            content: 'Error. ' + error.responseJSON.errors[0]
                        });
                        console.log('-->  getApp():  ERROR ', error.responseJSON.errors[0]);
                    });
            },
            //add platforms to dropdown list
            "setPlatforms": function setPlatforms() {
                if ($(this).text() == Msj.Messages.all) {
                    platforms = all_platforms;
                    $('#appsbox').val($(this).text());
                } else if ($(this).text() == "android") {
                    platforms = google_platform;
                    $('#appsbox').val($(this).text());
                } else if ($(this).text() == "ios") {
                    platforms = apple_platform;
                    $('#appsbox').val($(this).text());
                } else {
                    $('#appsbox').val("No soportada!!!");
                }
            },
        }
    });

function checkStatus(response, analytics, packageId) {
    if ((response.statusCode == "200" && response.statusReason == "OK") ||
        (response.statusCode == "202" && response.statusReason == "Accepted")) {
        return true;
    } else {
        var message = " ";
        var errorCode = " ";
        var popupS = require('popups');

        if (response.hasOwnProperty('message')) {
            message = response.message;
        }

        if (response.hasOwnProperty('errorCode')) {
            errorCode = response.errorCode;
        }

        switch (errorCode) {
            case 'invalid_client':
                popupS.alert({
                    content: 'Las credenciales son incorrectas.'
                });
                analytics.addEvent({ 'Send Push App Failure': packageId,
                 'Error Message': 'Las credenciales son incorrectas.', 'Date': Date() });
                analytics.logger.pkg('com.ibm.mfpstarterweb.checkStatus').debug('sendPush(): ERROR', 'Las credenciales son incorrectas.');
                analytics.send();
                break;
            case 'invalid_scope':
                popupS.alert({
                    content: 'Las credenciales utilizadas no poseen permiso para la aplicación seleccionada.'
                });
                analytics.addEvent({ 'Send Push App Failure': packageId, 
                'Error Message': 'Las credenciales utilizadas no poseen permiso para la aplicación seleccionada.',
                'Date': Date() });
                analytics.logger.pkg('com.ibm.mfpstarterweb.checkStatus').debug('sendPush(): ERROR', 'Las credenciales utilizadas no poseen permiso para la aplicación seleccionada.');
                analytics.send();
                break;
            default:
                popupS.alert({
                    content: 'Error. ' + message
                });
                analytics.addEvent({ 'Send Push App Failure': packageId, 'Error Message': message, 
                'Date': Date() });
                analytics.logger.pkg('com.ibm.mfpstarterweb.checkStatus').debug('sendPush(): ERROR', 'Error. ' + message);
                analytics.send();
        }
        return false;
    }
}

function checkError(error) {
    var popupS = require('popups');
    switch (error) {
        case '{"errorCode":"invalid_client"}':
            popupS.alert({
                content: 'Las credenciales son incorrectas.'
            });
            break;
        case '{"errorCode":"invalid_scope"}':
            popupS.alert({
                content: 'Las credenciales utilizadas no poseen permiso para la aplicación seleccionada.'
            });
            break;
        default:
            popupS.alert({
                content: 'Error. Desconocido.'
            });
    }
}

function showLoginDiv() {
    $('#myModal').modal('hide');
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('protectedDiv').style.display = 'none';
    document.getElementById('loginDiv').style.display = 'block';
    document.querySelectorAll('statusMsg').innerHTML = "";
}

function showProtectedDiv() {
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('protectedDiv').style.display = 'block';
    //window.location.replace("index.jsp");
}

function showNavBar() {
    document.getElementById('navbar').style.display = 'block';
}

function cleanPopup() {
    document.getElementById("usrname").style.borderColor = "#17a2b8";
    document.getElementById("psw").style.borderColor = "#17a2b8";
    document.getElementById("msj").style.borderColor = "#17a2b8";
    document.getElementById("appsbox").style.borderColor = "#17a2b8";
    $('#usrname').tooltip('hide');
    $('#psw').tooltip('hide');
    $('#msj').tooltip('hide');
    $('#sendTo').tooltip('hide');
    $('#alertDevices').hide();
    $('#devices').val("");
    $('#appslist').empty();
    $('#appsbox').val("");
    platforms = "";
    $('#usrname').val("");
    $('#psw').val("");
    $('#msj').val("");
   // $('.popover').hide();
}



