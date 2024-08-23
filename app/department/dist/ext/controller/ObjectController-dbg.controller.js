sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
    'use strict';

    var oUser;

	return ControllerExtension.extend('department.ext.controller.ObjectController', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			
			onInit: function () {
                 // you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
                 var oModel = this.base.getExtensionAPI().getModel();
                //  oUser = 'suman.senapati@peolsolutions.com';
                //  oUser = 'aditya.yadav@peolsolutions.com';
                 var oUserdata = new sap.ushell.services.UserInfo().getEmail();
                 oUser = oUserdata;
		},
        routing: {
            onBeforeBinding: async function () {
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


                try {
                    const approvedTeachersResponse = await new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: sServiceUrl + "/Teacher?$filter=Status eq 'Approved'", // Adjust 'Teachers' and 'status' as per your actual entity and field names
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
                

                    console.log('Fetched Approved Teachers:', approvedTeachersResponse);
                }catch (error) {
                    console.error('Error fetching Teacher data', error);
                }

                // Fetch data from Roll entity
                try {
                    const rollResponse = await new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: sServiceUrl + "/Roll", // Adjust 'YourEntitySet' as needed
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
                        rollResponse.value.forEach(function (roll) {
                            if (roll.email === oUser) {
                                userRole = roll.roll;
                            }
                        });
                    } else {
                        console.log('No data found or invalid response format');
                    }

                    var oEvent = this.getView().getBindingContext(); // Example: getting the binding context
                    var objPath = oEvent.getPath(); // Gets the full path from the context
                    var departmentID = null;

                    // Extract DepartmentID using a regular expression
                    var match = objPath.match(/DepartmentID='([^']+)'/);
                    if (match && match[1]) {
                        departmentID = match[1];
                    }

                    if (departmentID) {
                        // Fetch the Department record with the matching DepartmentID
                        const departmentResponse = await new Promise((resolve, reject) => {
                            jQuery.ajax({
                                url: sServiceUrl + "/Department?$filter=DepartmentID eq '" + departmentID + "'", // Adjust the query as needed
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

                        console.log('Fetched Department data:', departmentResponse);

                        

                        var departmentName;
                        if (departmentResponse && departmentResponse.value && departmentResponse.value.length > 0) {
                            departmentName = departmentResponse.value[0].DepartmentName;
                        }

                        console.log('DepartmentName:', departmentName);
                        debugger
                        // Compare userRole with departmentName
                        const oControl = this.base.getView().mAggregations.content[0]; //.mAggregations.headerTitle.$mainArea[0].childNodes[0].childNodes[2].childNodes[0].childNodes;

                            const buttons = oControl.findAggregatedObjects(true, function (control) {
                                return control.isA("sap.m.Button") && (control.getId().includes("Edit") || control.getId().includes("Delete"));
                            });
                            const editButton = buttons[0];
                            const deleteButton = buttons[1];
                            // Compare userRole with departmentName
                            if(userRole === 'Admin'){
                                this.base.getView().findAggregatedObjects(true, function (control) {
                                    return control.isA("sap.m.Button");
                                }).forEach(function (oButton) {
                                    // if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete") || oButton.getId().includes("Create")) {
                                    //     // oButton.setVisible(true);
                                    //     // oButton.setEnabled(true);
                                    // }
                                    // if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete") || oButton.getId().includes("Create")) {
                                    //         // oButton.setVisible(true);
                                    //         oButton.setEnabled(true);
                                    //     }
                                    if(editButton){
                                        // oButton.setVisible(true);
                                        editButton.setEnabled(true);
                                    }
                                    if(deleteButton){
                                        deleteButton.setVisible(true);
                                        deleteButton.setEnabled(true);
                                    }

                                });
                            }
                            else if ((userRole && departmentName && userRole === departmentName)) {
                                console.log('same');
                                this.base.getView().findAggregatedObjects(true, function (control) {
                                    return control.isA("sap.m.Button");
                                }).forEach(function (oButton) {
                                    // if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete") || oButton.getId().includes("Create")) {
                                    //     // oButton.setVisible(true);
                                    //     // oButton.setEnabled(true);
                                    // }
                                    // if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete") || oButton.getId().includes("Create")) {
                                    //         // oButton.setVisible(true);
                                    //         oButton.setEnabled(true);
                                    //     }
                                    if(editButton){
                                        // oButton.setVisible(true);
                                        editButton.setEnabled(true);
                                    }
                                    if(deleteButton){
                                        deleteButton.setVisible(false);
                                        deleteButton.setEnabled(false);
                                    }

                                });
                            } else {
                                console.log('different');
                                this.base.getView().findAggregatedObjects(true, function (control) {
                                    return control.isA("sap.m.Button");
                                }).forEach(function (oButton) {
                                    if(editButton && deleteButton){
                                        editButton.setVisible(false);
                                        deleteButton.setVisible(false);
                                        editButton.setEnabled(false);
                                        deleteButton.setEnabled(false);
                                    }
                                    if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete") || oButton.getId().includes("Create")) {
                                        // oButton.setVisible(false);
                                        oButton.setEnabled(false);
                                    }
                                });
                            }
                    }

                } catch (error) {
                    console.error('Error fetching Roll data', error);
                }

                if (userRole !== 'Admin') {
                    debugger
                    this.base.getView().findAggregatedObjects(true, function (control) {
                        return control.isA("sap.m.Input") && control.getBindingPath("value") === "DepartmentName";
                    }).forEach(function (oInput) {
                        oInput.setEditable(false); // Make the DepartmentName field non-editable
                    });
                }

                // Additional logic can be added here after the service URL is retrieved and data is fetched
            }
        }
    }

	});
});
