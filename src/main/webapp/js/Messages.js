define([], function () {

    var runtime = "mfp";
    var Messages = {
        mainTittle: "Notificaciones MobileFirst",
        loginButton: "Iniciar Sesión",
        user: "Usuario",
        password: "Contraseña",
        remembermeChk: "Recordarme",
        pushTittle: "Envio de Notificaciones",
        connectedMessage: "Conectado al servidor de MobileFirst",
        connectedFailure: "Fallo la conexión al servidor de MobileFirst...",
        logoutButton: "Finalizar Sesión",
        columnName: "Nombre",
        columnPackageId: "ID de paquete",
        columnDeviceId: "ID del Dispositivo",
        columnPlatform: "Plataforma",
        columnUserId: "Usuario",
        popupTittle: "Notificación",
        popupDevices: "Dispositivos",
        popupID: "ID de cliente",
        popupSecret: "Secreto de cliente",
        popupMessage: "Mensaje",
        popupSendTo: "Enviar a: ",
        popupSendBtn: "Enviar",
        popupSendingBtn: "Enviando...",
        information_: "Información!",
        sendPushSuccessMessage_: "Su mensaje fue enviado correctamente!",
        hello: "Hola, ",
        alertDevices: "<strong>Advertencia!</strong> No existen dispositivos registrados.",
        loadingApps: "Cargando apps del servidor de MobileFirst...",
        all: "Todos",
    };

    //set English lenguage
    function setEnglish() {
        Messages.mainTittle = "MobileFirst Notifications";
        Messages.loginButton = "Login";
        Messages.user = "Username";
        Messages.password = "Password";
        Messages.remembermeChk = "Remember me";
        Messages.pushTittle = "Push Notifications";
        Messages.connectedMessage = "Connected to MobileFirst Server";
        Messages.connectedFailure = "Failed to connect to MobileFirst Server...";
        Messages.logoutButton = "Logout";
        Messages.columnName = "Name";
        Messages.columnPackageId = "Package";
        Messages.columnDeviceId = "Device ID";
        Messages.columnPlatform = "Platform";
        Messages.columnUserId = "User ID"
        Messages.popupTittle = "Notification";
        Messages.popupDevices = "Devices";
        Messages.popupID = "Client ID";
        Messages.popupSecret = "Client Secret";
        Messages.popupMessage = "Message";
        Messages.popupSendTo = "Send to: ";
        Messages.popupSendBtn = "Send";
        Messages.popupSendingBtn = "Sending...";
        Messages.information_ = "Information!";
        Messages.sendPushSuccessMessage_ = "Your message was accepted!";
        Messages.hello = "Hello, ";
        Messages.alertDevices = "<strong>Warning!</strong> No devices found.";
        Messages.loadingApps = "Loading apps from MobileFirst Server...";
        Messages.all = "All";
    }

    return {
        runtime: runtime,
        Messages: Messages,
        setEnglish : setEnglish
    };

});