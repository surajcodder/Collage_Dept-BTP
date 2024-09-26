sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'jquery.sap.global',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator" // Ensure jQuery is available
], function (ControllerExtension, jQuery, Filter, FilterOperator) {
    'use strict';

    var oUser;

    return ControllerExtension.extend('teacher.ext.controller.TeacherListController', {
        // this section allows extending lifecycle hooks or hooks provided by Fiori elements
        override: {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf collegelink.ext.controller.ListController
             */
            onInit: function () {
                // Access the Fiori elements extensionAPI via this.base.getExtensionAPI
                var oModel = this.base.getExtensionAPI().getModel();
                // var oUserdata = new sap.ushell.services.UserInfo().getEmail();
                // oUser = oUserdata;
                // Uncomment for testing with a fixed email
                oUser = 'suman.senapati@peolsolutions.com';
                // oUser = 'aditya.yadav@peolsolutions.com';
            },
//
            onBeforeRendering: async function (oBindingContext) {
                // Access the Fiori elements extensionAPI via this.base.getExtensionAPI
                debugger; // Use for debugging purposes
                var oModel = this.base.getExtensionAPI().getModel();

                if (!oModel) {
                    console.error('Model is not available.');
                    return;
                }

                var sServiceUrl;
                if (typeof oModel.getServiceUrl === "function") {
                    sServiceUrl = oModel.getServiceUrl(); // For V4 OData models
                    console.log('Service URL:', sServiceUrl);
                } else {
                    console.error('Unable to determine the service URL.');
                    return;
                }
               
                // Perform any asynchronous operations here using jQuery AJAX
                try {
                    // Fetch data from Department entity
                    const departmentResponse = await new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: sServiceUrl + "/Teacher", // Adjust entity set as needed
                            method: "GET",
                            dataType: "json",
                            success: function (data) {
                                resolve(data);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                reject(new Error(textStatus + ': ' + errorThrown));
                            }
                        });
                    });

                    console.log('Fetched data:', departmentResponse);
                    // Log the DepartmentName from the response
                    if (departmentResponse && departmentResponse.value) {
                        departmentResponse.value.forEach(function (teacher) {
                            console.log('Teacher Name:', teacher.Name);
                        });
                    } else {
                        console.log('No data found or invalid response format');
                    }
                } catch (error) {
                    console.error('Error fetching Department data', error);
                }

                try {
                    // Fetch data from Roll entity
                    const rollResponse = await new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: sServiceUrl + "/Roll", // Adjust entity set as needed
                            method: "GET",
                            dataType: "json",
                            success: function (data) {
                                resolve(data);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                reject(new Error(textStatus + ': ' + errorThrown));
                            }
                        });
                    });

                    console.log('Fetched Roll data:', rollResponse);

                    var userRole;
                    if (rollResponse && rollResponse.value) {
                        rollResponse.value.forEach(function (item) {
                            if (item.email === oUser) {
                                userRole = item.roll;
                            }
                        });
                    } else {
                        console.log('No data found or invalid response format');
                    }
                    var oTable = this.getView().findAggregatedObjects(true, function (control) {
                        return control.isA("sap.ui.table.Table") || control.isA("sap.m.Table");
                    })[0];
                    debugger
                    var oBinding = oTable.getBinding("items");


                    if (userRole !== 'Admin') {
                        // Hide "Create" and "Delete" buttons if the user is not an admin
                        this.base.getView().findAggregatedObjects(true, function (control) {
                            return control.isA("sap.m.Button");
                        }).forEach(function (oButton) {
                            if (oButton.getId().includes("Create") || oButton.getId().includes("Delete")) {
                                oButton.setVisible(false);
                            }
                        });
            

                        // Hide FilterBar for non-admin users
                        this.base.getView().findAggregatedObjects(true, function (control) {
                            return control.isA("sap.fe.macros.controls.FilterBar");
                        }).forEach(function (oFilterBar) {
                            oFilterBar.setVisible(false);
                        });

                        this.base.getView().getContent()[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content.setFilterConditions({
                            "$editState": [
                                {
                                    "operator": "DRAFT_EDIT_STATE",
                                    "values": ["ALL_HIDING_DRAFTS"],
                                    "validated": "Validated"
                                }
                            ]
                        });
                    }
                } catch (error) {
                    console.error('Error fetching Roll data', error);
                }

                // Additional logic can be added here after the service URL is retrieved and data is fetched
               

            }
        }
    });
});



