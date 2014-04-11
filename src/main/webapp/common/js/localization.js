angular.module('localization', []).run(function ($locale) {
	var localeMapping = {"en-us": "en_US", "fi-fi": "fi_FI", "sv-se": "sv-SE"};

	jQuery.i18n.properties({
		name: 'messages',
		path: '../common/i18n/',
		mode: 'map',
		language: localeMapping[$locale.id],
		callback: function () {
		}
	});
})
	.filter('i18n', ['$rootScope', '$locale', function () {
		return function (text) {
			return jQuery.i18n.prop(text);
		};
	}]);
