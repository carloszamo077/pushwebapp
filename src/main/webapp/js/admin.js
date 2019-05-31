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

    });