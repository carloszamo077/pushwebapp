define([], function () {

    var badWords = ["crap", "ugly", "brat", "basterddouch", "shit",
        "fuck you", "fuck", "fuckyou", "fuck u", "fucku",
        "idiota", "mongolo", "caca", "mierda", "hijodeputa", "hijo de puta",
        "puta", "zorra", "malparido", "malparida", "puto", "picha",
        "malnacido"];

    function censore(string, filter) {
        var regex = new RegExp(filter.join("|"), "gi");
        return string.replace(regex, function (match) {
            //replace each letter with a star
            var stars = '';
            for (var i = 0; i < match.length; i++) {
                stars += '*';
            }
            return stars;
        });
    }

    return {
        badWords: badWords,
        censore: censore
    };

});