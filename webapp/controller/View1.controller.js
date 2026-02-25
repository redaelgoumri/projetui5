sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("rgo.purch.controller.View1", {

        onInit: function () {
            // Local model for UI state (e.g., total count, current search term)
            var oUiModel = new JSONModel({
                totalCount: 0,
                searchDelay: 400, // ms
                isFilterActive: false
            });
            this.getView().setModel(oUiModel, "ui");

            // Attach to the OData request completed event to update counts
            var oModel = this.getOwnerComponent().getModel();
            oModel.metadataLoaded().then(function() {
                console.log("System Online: Metadata synced.");
            });
        },

        /**
         * The "Wild" Search Logic
         * Searches across PO Number, Vendor, and Company Code simultaneously.
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
            var oGrid = this.byId("idHeaderGrid");
            var oBinding = oGrid.getBinding("items");
            
            // Create a Multi-Filter with OR logic
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("Ebeln", FilterOperator.Contains, sQuery),
                        new Filter("Lifnr", FilterOperator.Contains, sQuery),
                        new Filter("Bukrs", FilterOperator.Contains, sQuery)
                    ],
                    and: false // This makes it an 'OR' search
                }));
                this.getView().getModel("ui").setProperty("/isFilterActive", true);
            } else {
                this.getView().getModel("ui").setProperty("/isFilterActive", false);
            }

            // Apply filter to the GridList binding
            oBinding.filter(aFilters);
            
            // UI Feedback for the user
            this._updateTotalCount();
        },

        /**
         * Navigation Logic
         * Source-based retrieval for GridListItems
         */
        onHeaderSelect: function (oEvent) {
            var oItem = oEvent.getSource(); 
            var oContext = oItem.getBindingContext();
            
            if (!oContext) {
                MessageToast.show("Error: Could not retrieve Purchase Order context.");
                return;
            }

            var sPoId = oContext.getProperty("Ebeln");

            // Smooth transition to View2
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                poId: sPoId
            });
        },

        /**
         * Updates the UI model with the number of visible items
         * @private
         */
        _updateTotalCount: function () {
            var oGrid = this.byId("idHeaderGrid");
            var iCount = oGrid.getBinding("items").getLength();
            this.getView().getModel("ui").setProperty("/totalCount", iCount);
        },

        /**
         * Premium settings dialog launcher (Personalization)
         */
        onOpenColumnSettings: function () {
            MessageToast.show("Personalization service starting...");
            // You can use the same TableSelectDialog logic here 
            // to show/hide specific fields within the Grid Cards!
        }
    });
});