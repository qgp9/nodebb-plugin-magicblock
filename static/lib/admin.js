'use strict';
/* globals $, app, socket */

define('admin/plugins/magicblock', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('magicblock', $('.magicblock-settings'));

		$('#save').on('click', function() {
			Settings.save('magicblock', $('.magicblock-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'magicblock-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});
