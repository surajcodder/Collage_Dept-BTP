// sap.ui.define([
//     'sap/ui/core/mvc/ControllerExtension',
//     'jquery.sap.global', // Ensure jQuery is available
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (ControllerExtension, jQuery)  {
// 	'use strict';
    
//     var oUser;
//     var fieldInputIds;

// 	return ControllerExtension.extend('department.ext.controller.ListController', {
// 		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
// 		override: {
// 			/**
// 			 * Called when a controller is instantiated and its View controls (if available) are already created.
// 			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
// 			 * @memberOf department.ext.controller.ListController
// 			 */
// 			onInit: function () {
//                  // Access the Fiori elements extensionAPI via this.base.getExtensionAPI
//                  var oModel = this.base.getExtensionAPI().getModel();
//                  debugger; // Use for debugging purposes
//                 //  var oUserdata = new sap.ushell.services.UserInfo().getEmail();
//                 //  oUser = oUserdata;
//                  oUser = 'aditya.yadav@peolsolutions.com';
//                 // oUser = 'suman.senapati@peolsolutions.com';
//                  // Any additional initialization logic can go here
//                  // Identify the List control
//                  var oView = this.base.getView();
//                  var aControls = oView.findAggregatedObjects(true);
 
//                  aControls.forEach(function (control) {
//                      console.log("Control ID: ", control.getId(), "Control Type: ", control.getMetadata().getName());
//                  });
//                  // this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     // Check if the control is of type sap.ui.mdc.FilterField
//                  //     if (control.isA("sap.ui.mdc.FilterField")) {
//                  //         // Set the visibility of the FilterField control to false
//                  //         control.setVisible(false);
//                  //     }
//                  // });
 
//                  // this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     // Check if the control is of type sap.ui.mdc.field.FieldInput
//                  //     if (control.isA("sap.ui.mdc.field.FieldInput")) {
//                  //         // Set the visibility of the FieldInput control to false
//                  //         control.setVisible(false);
//                  //     }
//                  // });
//                  // this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     // Check if the control is of type sap.m.Text
//                  //     if (control.isA("sap.m.Title")) {
//                  //         // Set the visibility of the sap.m.Text control to false
//                  //         control.setVisible(false);
//                  //     }
//                  // });
 
//                  // Hide or disable draft-related controls
//                  //  this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     return control.isA("sap.m.Button") && (control.getId().includes("Draft") || control.getId().includes("Save"));
//                  // }).forEach(function (oButton) {
//                  //     oButton.setVisible(false); // Hide draft-related buttons
//                  // });
 
//                  // this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     return control.isA("sap.m.Input") && control.getId().includes("Draft");
//                  // }).forEach(function (oInput) {
//                  //     oInput.setEditable(false); // Set draft-related fields to read-only
//                  // });
//                  // debugger
//                  // var aControls = sap.ui.core.Element.registry.all();
//                  // Access the Popover control
//                  // var oPopover = sap.ui.getCore().byId("__popover0");
//                  // console.log(oPopover);
//                  // // Access the List control
//                  // var oList = sap.ui.getCore().byId("__list0");
//                  // console.log(oList);
//                  // // Access the FixedListItems
//                  // var oItem1 = sap.ui.getCore().byId("__item1");
//                  // var oItem2 = sap.ui.getCore().byId("__item2");
//                  // console.log(oItem1);
//                  // console.log(oItem2);
//                  // Filter and print values of all elements with IDs starting with '__list0-item-'
//                  // this.base.getView().findAggregatedObjects(true, function (control) {
//                  //     // Check if the control is of type sap.ui.mdc.field.FieldInput
//                  //     if (control.isA("sap.ui.mdc.field.FieldInput")) {
//                  //         // Set the control's value with oItem2.mProperties
//                  //         control.setValue(oItem2.mProperties.text);
//                  //     }
//                  // });
//                  // debugger
//                  // const oInternalModelContext = this.getView().getBindingContext("internal");
 
//                  // oInternalModelContext.setProperty("hideDraftInfo", true);
//                  // let fieldInputs = this.byId(this.getView().getId()).findElements(true, function (control) {
//                  //     return control.isA("sap.ui.mdc.field.FieldInput");
//                  // });
             
//                  // // Loop through the controls to find the one with the label "Editing"
//                  // let targetFieldInputId = null;
//                  // fieldInputs.forEach(control => {
//                  //     // Check the associated label
//                  //     let label = control.getParent().getLabel();
 
//                  //     if (label && label === "Editing") {
//                  //         targetFieldInputId = control.getId();
//                  //     }
//                  // });
//                  // this.base.getView().getContent()[0].mAggregations.content.mAggregations.content.setFilterConditions({
//                  //     "$editState": [
//                  //         {
//                  //             "operator": "DRAFT_EDIT_STATE",
//                  //             "values": [
//                  //                 "ALL_HIDING_DRAFTS",
//                  //                 "All (Hiding Drafts)"
//                  //             ],
//                  //             "validated": "Validated"
//                  //         }
//                  //     ]
//                  // });
                 
 
//              },
 
//              /**
//               * Called before the view is rendered.
//               * This is a suitable place to execute code before binding occurs.
//               */
//              routing: {
//                  onBeforeBinding: async function () {
//                      // Access the Fiori elements extensionAPI via this.base.getExtensionAPI
//                      debugger; // Use for debugging purposes
//                      var oModel = this.base.getExtensionAPI().getModel();
 
//                      if (!oModel) {
//                          console.error('Model is not available.');
//                          return;
//                      }
 
//                      var sServiceUrl;
//                      if (typeof oModel.getServiceUrl === "function") {
//                          sServiceUrl = oModel.getServiceUrl(); // For V4 OData models
//                          console.log('Service URL:', sServiceUrl);
//                      } else {
//                          console.error('Unable to determine the service URL.');
//                          return;
//                      }
                     
                    
 
//                      // Perform any asynchronous operations here using jQuery AJAX
//                      try {
//                          const response = await new Promise((resolve, reject) => {
//                              jQuery.ajax({
//                                  url: sServiceUrl + "/Department", // Adjust 'YourEntitySet' as needed
//                                  method: "GET",
//                                  dataType: "json",
//                                  success: function (data) {
//                                      resolve(data);
//                                  },
//                                  error: function (jqXHR, textStatus, errorThrown) {
//                                      reject(new Error(textStatus + ': ' + errorThrown));
//                                  }
//                              });
//                          });
 
//                          console.log('Fetched data:', response);
 
//                          debugger
 
//                          // Log the DepartmentName from the response
//                          if (response && response.value) {
//                              response.value.forEach(function (department) {
//                                  console.log('Department Name:', department.DepartmentName);
 
//                              });
//                          } else {
//                              console.log('No data found or invalid response format');
//                          }
//                      } catch (error) {
//                          console.error('Error fetching data', error);
//                      }
//                      const filterId = this.base.getView().getContent()[0].mAggregations.content.mAggregations.content.mAssociations.filter;
//                      //For fetching data from roll
//                      // Fetch data from Roll entity
//                      try {
//                          const rollResponse = await new Promise((resolve, reject) => {
//                              jQuery.ajax({
//                                  url: sServiceUrl + "/Roll", // Adjust 'YourEntitySet' as needed
//                                  method: "GET",
//                                  dataType: "json",
//                                  success: function (data) {
//                                      resolve(data);
//                                  },
//                                  error: function (jqXHR, textStatus, errorThrown) {
//                                      reject(new Error(textStatus + ': ' + errorThrown));
//                                  }
//                              });
//                          });
 
//                          console.log('Fetched Roll data:', rollResponse);
//                          debugger
//                          var userRole;
//                          if (rollResponse && rollResponse.value) {
//                              rollResponse.value.forEach(function (roll) {
//                                  if (roll.email === oUser) {
//                                      userRole = roll.roll;
//                                  }
//                                  // if (roll.Email === 'mailto:aditya.yadav@peolsolutions.com') {
//                                  //     userRole = roll.roll;
//                                  // }
//                              }.bind(this));
//                          } else {
//                              console.log('No data found or invalid response format');
//                          }
//                          debugger
                         
//                          if (userRole !== 'Admin') {
//                              // Hide "Create" and "Delete" buttons if the user is not an admin
//                              // var filter_bar_visible = sap.ui.getCore().byId("collegelink::DepartmentList--fe::FilterBar::Department").setVisible(false);
//                              this.base.getView().findAggregatedObjects(true, function (control) {
//                                  return control.isA("sap.m.Button");
//                              }).forEach(function (oButton) {
//                                  if (oButton.getId().includes("Create") || oButton.getId().includes("Delete") ) {
//                                      oButton.setVisible(false);
//                                      oButton.setEnabled(false);
//                                  }
//                                 });
                               
//                                  var oFilterBar = sap.ui.getCore().byId(filterId);

//                                  var oFilterConditions = {
//                                      "$editState": [ 
//                                          {
//                                              "operator": "DRAFT_EDIT_STATE",
//                                              "values": [
//                                                  "ALL_HIDING_DRAFTS",
//                                                  "All (Hiding Drafts)"
//                                              ],
//                                              "validated": "Validated"
//                                          }
//                                      ]
//                                  };

//                                  if (oBinding) {
//                                     var oFilter = new Filter({
//                                         path: "IsActiveEntity",
//                                         operator: FilterOperator.EQ,
//                                         value1: true
//                                     });
            
//                                 oBinding.filter([oFilter]);
//                                 }
//                                  oFilterBar.setFilterConditions(oFilterConditions);

//                                  this.base.getView().findAggregatedObjects(true, function (control) {
// 									// Check if the control is of type sap.m.Button
// 									if (control.isA("sap.fe.macros.controls.FilterBar")) {
// 										// Set the visibility of the Button control to false
// 										control.setVisible(false);
// 									}
// 								});


//                                 //  this.base.getView().findAggregatedObjects(true, function (control) {
//                                 //     return control.isA("sap.m.Input") && control.getId().includes("Draft");
//                                 // }).forEach(function (oInput) {
//                                 //     debugger
//                                 //     oInput.setEditable(false); // Set draft-related fields to read-only
//                                 // });
            
//                                 // filterButton.setVisible(false);
                             
//                             //  this.base.getView().findAggregatedObjects(true, function (control) {
//                             //      // Check if the control is of type sap.m.Button
//                             //      if (control.isA("sap.fe.macros.controls.FilterBar")) {
//                             //          // Set the visibility of the Button control to false
//                             //          control.setVisible(false);
//                             //      }
//                             //  });
//                              // var aControls = sap.ui.core.Element.registry.all();
 
//                              // var oPopover = sap.ui.getCore().byId("__popover0");
//                              // console.log(oPopover);
//                              // // Access the List control
//                              // var oList = sap.ui.getCore().byId("__list0");
//                              // console.log(oList);
//                              // // Access the FixedListItems
//                              // var oItem1 = sap.ui.getCore().byId("__item1");
//                              // var oItem2 = sap.ui.getCore().byId("__item2");
//                              // console.log(oItem1);
//                              // console.log(oItem2);
//                              // // Filter and print values of all elements with IDs starting with '__list0-item-'
//                              // this.base.getView().findAggregatedObjects(true, function (control) {
//                              //     // Check if the control is of type sap.ui.mdc.field.FieldInput
//                              //     if (control.isA("sap.ui.mdc.field.FieldInput")) {
//                              //         // Set the control's value with oItem2.mProperties
//                              //         control.setValue(oItem2.mProperties.text);
//                              //     }
//                              // });
 
//                          }
//                          if (userRole === undefined) {
//                              // Hide "Create" and "Delete" buttons if the user is not an admin
//                              // this.base.getView().findAggregatedObjects(true, function (control) {
//                              //     // Check if the control is of type sap.ui.mdc.FilterField
//                              //     if (control.isA("sap.ui.mdc.FilterField")) {
//                              //         // Set the visibility of the FilterField control to false
//                              //         control.setVisible(false);
//                              //     }
//                              // });
//                              this.base.getView().findAggregatedObjects(true, function (control) {
//                                  // Check if the control is of type sap.m.Button
//                                  if (control.isA("sap.fe.macros.controls.FilterBar")) {
//                                      // Set the visibility of the Button control to false
//                                      control.setVisible(false);
//                                  }
//                              });
 
 
//                          }
 
//                      } catch (error) {
//                          console.error('Error fetching Roll data', error);
//                      }
 
 
//                      // Additional logic can be added here after the service URL is retrieved and data is fetched
//                  }
 

// 			}
// 		}
// 	});
// });




// list

sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'jquery.sap.global',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator" // Ensure jQuery is available
], function (ControllerExtension, jQuery, Filter, FilterOperator) {
    'use strict';

    var oUser;

    return ControllerExtension.extend('department.ext.controller.ListController', {
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
                var oUserdata = new sap.ushell.services.UserInfo().getEmail();
               oUser = oUserdata;
                // Uncomment for testing with a fixed email
                // oUser = 'suman.senapati@peolsolutions.com';
                // oUser = 'aditya.yadav@peolsolutions.com';
            },

            onBeforeRendering: async function () {
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
                const filterId = this.base.getView().getContent()[0].mAggregations.content.mAggregations.content.mAssociations.filter;


                // Perform any asynchronous operations here using jQuery AJAX
                try {
                    // Fetch data from Department entity
                    const departmentResponse = await new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: sServiceUrl + "/Department", // Adjust entity set as needed
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
                        departmentResponse.value.forEach(function (department) {
                            console.log('Department Name:', department.DepartmentName);
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
                        var oFilterBar = sap.ui.getCore().byId(filterId);

                    var oFilterConditions = {
                        "$editState": [ 
                            {
                                "operator": "DRAFT_EDIT_STATE",
                                "values": [
                                    "ALL_HIDING_DRAFTS",
                                    "All (Hiding Drafts)"
                                ],
                                "validated": "Validated"
                            }
                        ]
                    };
                    if (oBinding) {
                        var oFilter = new Filter({
                            path: "IsActiveEntity",
                            operator: FilterOperator.EQ,
                            value1: true
                        });

                    oBinding.filter([oFilter]);
                    }
                    oFilterBar.setFilterConditions(oFilterConditions);


                        // // // Hide FilterBar control if user is not an admin
                        this.base.getView().findAggregatedObjects(true, function (control) {
                            return control.isA("sap.fe.macros.controls.FilterBar");
                        }).forEach(function (oFilterBar) {
                            oFilterBar.setVisible(false);
                        });

//                         this.base.getView().findAggregatedObjects(true, function (control) {
//                             return control.isA("sap.m.Button") && (control.getId().includes("Draft") || control.getId().includes("Save"));
//                         }).forEach(function (oButton) {
//                             oButton.setVisible(false); // Hide draft-related buttons
//                         });

//                         this.base.getView().findAggregatedObjects(true, function (control) {
//                             return control.isA("sap.m.Input") && control.getId().includes("Draft");
//                         }).forEach(function (oInput) {
//                             oInput.setEditable(false); // Set draft-related fields to read-only
//                         });

// filterbuton.setVisible(false);



                    }
                }catch (error) {
                    console.error('Error fetching Roll data', error);
                }

                // Additional logic can be added here after the service URL is retrieved and data is fetched
            }
        }
    });
});


