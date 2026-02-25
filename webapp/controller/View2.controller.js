sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, JSONModel) {
    "use strict";

    return Controller.extend("rgo.purch.controller.View2", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            // Ensure the route name "RouteView2" matches manifest.json exactly
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sPoId = oEvent.getParameter("arguments").poId;
            var oView = this.getView();

            // Perform the Element Binding with Expand
            oView.bindElement({
                path: "/PO_HEADERSet('" + sPoId + "')",
                parameters: {
                    expand: "ZPO_ITEMSSet" // This triggers the OData $expand
                },
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () { oView.setBusy(true); },
                    dataReceived: function () { oView.setBusy(false); }
                }
            });
        },

        _onBindingChange: function () {
            var oElementBinding = this.getView().getElementBinding();

            // If the ID doesn't exist in the backend, navigate back or show error
            if (!oElementBinding.getBoundContext()) {
                this.getOwnerComponent().getRouter().getTargets().display("TargetView1");
            }
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
            }
        }
    });
});