/*global profile:true*/
profile = (function() {
    return {
        resourceTags: {
            test: function() {
                return true;
            },
            copyOnly: function() {
                return true;
            },
            amd: function() {
                return true;
            },
            ignore: function() {
                return true;
            }
        }
    };
})();