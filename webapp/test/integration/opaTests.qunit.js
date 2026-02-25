/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["rgo.purch/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
