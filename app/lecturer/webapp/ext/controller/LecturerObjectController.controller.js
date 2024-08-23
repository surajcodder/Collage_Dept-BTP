
sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	'jquery.sap.global' // Ensure jQuery is available
], function (ControllerExtension, jQuery) {
	'use strict';
	var oUser;


	return ControllerExtension.extend('lecturer.ext.controller.LecturerObjectController', {
		override: {
			onInit: function () {
				debugger
				// Access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
				// Use for debugging purposes
				//    var oUserdata = new sap.ushell.services.UserInfo().getEmail();
				//     oUser = oUserdata;
				//     alert(oUser);

				// oUser = 'aditya.yadav@peolsolutions.com';
				oUser = 'suman.senapati@peolsolutions.com';
				// Any additional initialization logic can go here
				// var that = this;

				// // Find the Edit button in your view and attach a press event handler
				// this.base.getView().findAggregatedObjects(true, function (control) {
				// Construct the full ID dynamically
				var sUploadButtonId = this.getView().createId("uploadSet-uploadButton");
				var oUploadButton = sap.ui.getCore().byId(sUploadButtonId);

				if (oUploadButton) {
					console.log("Upload button ID:", oUploadButton.getId());
					// You can now manipulate the button, for example, hiding it initially
					//   oUploadButton.setVisible(false);
				}

			},


			routing: {
				onBeforeBinding: async function (oBindingContext) {
					// debugger;
					//send for approval


					console.log("onBeforeBinding called with context:", oBindingContext);


					if (oBindingContext) {
						console.log("Binding Context Path:", oBindingContext.getPath());
					} else {
						console.log("No binding context available.");
						return;
					}


					// Access the Fiori elements extensionAPI via this.base.getExtensionAPI
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
					this.adjustUIControls();
					await this.fetchAndProcessData(sServiceUrl);

				}
			}
		},
		adjustUIControls: function () {
			// debugger
			var that = this;
			setTimeout(function () {
				that.base.getView().findAggregatedObjects(true, function (control) {
					return control.isA("sap.m.Button") ||
						control.isA("sap.m.DatePicker") ||
						control.isA("sap.m.Input") ||
						control.isA("sap.m.TextArea") ||
						control.isA("sap.m.ComboBox");
				}).forEach(function (oControl) {
					var controlId = oControl.getId();
					console.log("Control ID: ", controlId);
					debugger
					// Handle Save Button
					if (oControl.isA("sap.m.Button") && controlId.includes("Save") && oControl.getText().includes("Create")) {
						oControl.setText("Send for approval");
					}


					if (oControl.isA("sap.m.Button") && controlId.includes("Save") && oControl.getVisible() === true) {
						debugger;

						// Get the current view
						var oView = this.base.getView(); // Use `this.getView()` if this code is in the controller

						// Get all controls within the view
						var aAllControls = oView.findAggregatedObjects(true);

						var aUploadkaSets = aAllControls.filter(function (oControl) {
							return oControl.getId().includes("uploadSet-uploader") || oControl.getId().includes("uploadSet-uploadButton");
						});

						aUploadkaSets.forEach(function (oControl) {
							oControl.setVisible(true);
						});




						var aUploadSet = aAllControls.filter(function (oControl) {
							return oControl.getId().includes("uploadSet");
						});

						// aUploadSet.forEach(function (oControl) {
						//     oControl.setUploadEnabled(false)
						// });



						// Loop through each UploadSet control
						aUploadSet.forEach(function (oControl) {
							// Print control details
							console.log("Control ID:", oControl.getId());
							console.log("Control Type:", oControl.getMetadata().getName());

							// Make the control visible and optionally enabled
							if (oControl.isA("sap.m.Button") && oControl.getId().includes("deleteButton")) {
								oControl.setVisible(true);
								oControl.setEnabled(true); // Optional: Enable the button as well
							}
							if (oControl.isA("sap.m.Button") && oControl.getId().includes("editButton")) {
								oControl.setVisible(true);
								oControl.setEnabled(true); // Optional: Enable the button as well
							}
						});

						aUploadSet.forEach(function (oControl) {
							try {
								oControl.setUploadEnabled(true);
							} catch (error) {
								console.log("Error setting UploadEnabled to false for control: ", oControl.getId(), error);
							}
						});

					}


					if (oControl.isA("sap.m.Button") && controlId.includes("Save") && oControl.getVisible() === false) {
						debugger;

						// Get the current view
						var oView = this.base.getView(); // Use `this.getView()` if this code is in the controller

						// Get all controls within the view
						var aAllControls = oView.findAggregatedObjects(true);

						var aUploadkaSets = aAllControls.filter(function (oControl) {
							return oControl.getId().includes("uploadSet-uploader") || oControl.getId().includes("uploadSet-uploadButton");
						});

						aUploadkaSets.forEach(function (oControl) {
							oControl.setVisible(false);
						});

						var aUploadSet = aAllControls.filter(function (oControl) {
							return oControl.getId().includes("uploadSet");
						});

						// aUploadSet.forEach(function (oControl) {
						//     oControl.setUploadEnabled(false)
						// });



						// Loop through each UploadSet control
						aUploadSet.forEach(function (oControl) {
							// Print control details
							console.log("Control ID:", oControl.getId());
							console.log("Control Type:", oControl.getMetadata().getName());

							// Make the control visible and optionally enabled
							if (oControl.isA("sap.m.Button") && oControl.getId().includes("deleteButton")) {
								oControl.setVisible(false);
								oControl.setEnabled(false); // Optional: Enable the button as well
							}
							if (oControl.isA("sap.m.Button") && oControl.getId().includes("editButton")) {
								oControl.setVisible(false);
								oControl.setEnabled(false); // Optional: Enable the button as well
							}
						});

						aUploadSet.forEach(function (oControl) {
							try {
								oControl.setUploadEnabled(false);
							} catch (error) {
								console.log("Error setting UploadEnabled to false for control: ", oControl.getId(), error);
							}
						});

					}
					//   // Handle Age Field
					if (oControl.isA("sap.m.Input") && controlId.includes("Age")) {
						oControl.setEditable(false); //make age field read only
					}



					// Handle Date of Birth (DOB) DatePicker
					if (oControl.isA("sap.m.DatePicker") && controlId.includes("DOB")) {
						console.log("Found DOB field!");

						// Attach change event listener to update age immediately when DOB is selected
						oControl.attachChange(function () {
							var dobValue = oControl.getDateValue();  // Get the DOB value
							if (dobValue) {
								var age = that.calculateAge(dobValue);  // Calculate the age
								that.setAgeField(age);  // Set the age value to the Age field
							}
						});

						// If DOB is already set, calculate and set the Age
						// var dobValue = oControl.getDateValue();  // Get the DOB value if it's already set
						// if (dobValue) {
						// 	var age = that.calculateAge(dobValue);  // Calculate the age
						// 	that.setAgeField(age);  // Set the Age field
						// }
					}

					// Handle Age Field (Input)
					// if (oControl.isA("sap.m.Input") && controlId.includes("Age")) {
					// 	console.log("Found Age field!");

					// 	// Set the Age field when opening the Object Page
					// 	var dobControl = that.base.getView().byId("nwteacher::TeacherObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::DOB::Field-edit");
					// 	if (dobControl) {
					// 		var dobValue = dobControl.getDateValue();  // Get the DOB value
					// 		if (dobValue) {
					// 			var age = that.calculateAge(dobValue);  // Calculate the age
					// 			oControl.setValue(age);  // Set the Age field
					// 		}
					// 	}
					// }
					// if (oControl.isA("sap.m.Button") && controlId.includes("Edit")) {
					// 	oControl.attachPress(function () {
					// 		// Show Upload button only when Edit button is clicked
					// 		var oUploadButton = that.base.getView().byId("UploadButtonId"); // Replace "UploadButtonId" with the actual ID of your Upload button
					// 		if (oUploadButton) {
					// 			oUploadButton.setVisible(true);
					// 		}
					// 	});
					// }


				}.bind(that));
			}.bind(that), 500);  // Adjusted delay to ensure everything is ready
		},


		// calculateAge: function (dob) {
		// 	var today = new Date();
		// 	console.log("Calculating age...");
		// 	var birthDate = new Date(dob);
		// 	var age = today.getFullYear() - birthDate.getFullYear();
		// 	var m = today.getMonth() - birthDate.getMonth();
		// 	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		// 		age--;
		// 	}
		// 	return age;
		// },

		// setAgeField: function (age) {
		// 	var that = this;
		// 	setTimeout(function () {
		// 		that.base.getView().findAggregatedObjects(true, function (control) {
		// 			return control.isA("sap.m.Input") && control.getId().includes("Age");
		// 		}).forEach(function (oControl) {
		// 			oControl.setValue(age);  // Set the Age field value
		// 			console.log("Age field set to:", age);  // Debugging log
		// 		});
		// 	}.bind(that), 500);  // Adjusted delay to ensure everything is ready
		// },

		// _createEntity: function (item) {
		// 	// debugger
		// 	var data = {
		// 		mediaType: item.getMediaType(),
		// 		fileName: item.getFileName(),
		// 		size: item.getFileObject().size,
		// 		url: "", // Set URL if applicable
		// 		TeacherID: this.getView().getBindingContext().getProperty("ID") // Assuming context is set to a Teacher entity
		// 	};
		// 	var settings = {
		// 		url: sServiceUrl + "/items",
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json"
		// 		},
		// 		data: JSON.stringify(data)
		// 	};

		// 	return new Promise(function (resolve, reject) {
		// 		$.ajax(settings)
		// 			.done(function (results) {
		// 				resolve(results.ID);
		// 			})
		// 			.fail(function (err) {
		// 				reject(err);
		// 			});
		// 	});
		// },
		// _uploadContent: function (item, id) {
		// 	var url = `/items(${id})`;
		// 	item.setUploadUrl(url);

		// 	var oUploadSet = this.byId("UploadSet");
		// 	oUploadSet.setHttpRequestMethod("PUT");

		// 	oUploadSet.uploadItem(item);

		// 	// Optional: Attach error handler to track issues
		// 	oUploadSet.attachUploadComplete(function (oEvent) {
		// 		if (oEvent.getParameter("success")) {
		// 			MessageToast.show("Upload successful!");
		// 		} else {
		// 			MessageToast.show("Upload failed.");
		// 		}
		// 	});
		// },
		// onUploadSelectedButton: function () {
		// 	// debugger
		//     var oUploadSet = this.byId("UploadSet");

		//     var items = oUploadSet.getItems();
		//     var that = this;

		//     items.forEach(function (item) {
		//         that._createEntity(item)
		//             .then(function (id) {
		//                 that._uploadContent(item, id);
		//             })
		//             .catch(function (err) {
		//                 console.error("Error creating entity or uploading content:", err);
		//                 MessageToast.show("Error uploading file.");
		//             });
		//     });
		// },

		// _getUploadButton: function(oUploadSet) {
		// 	// Access the internal upload button of the UploadSet
		// 	var oButton = oUploadSet._oFileUploader._getFileUploader().getButton();
		// 	return oButton;
		// },
		fetchAndProcessData: async function (sServiceUrl) {
			var that = this;



			// Perform any asynchronous operations here using jQuery AJAX
			try {
				const response = await new Promise((resolve, reject) => {
					jQuery.ajax({
						url: sServiceUrl + "/Department", // Adjust 'YourEntitySet' as needed
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


				console.log('Fetched data:', response);
				// Log the DepartmentName from the response
				if (response && response.value) {
					response.value.forEach(function (department) {
						console.log('Department Name:', department.DepartmentName);
					});
				} else {
					console.log('No data found or invalid response format');
				}
			} catch (error) {
				console.error('Error fetching data', error);
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


				console.log('Fetched Authorization data:', rollResponse);


				var userRole;
				if (rollResponse && rollResponse.value) {
					rollResponse.value.forEach(function (name) {
						if (name.email === oUser) {
							userRole = name.roll;
						}
					});
				} else {
					console.log('No data found or invalid response format');
				}


				// Extract DepartmentID from the URL
				var sCurrentUrl = window.location.href;
				var hashIndex = sCurrentUrl.indexOf("#");
				var sHash = sCurrentUrl.substring(hashIndex + 1);
				var sDepartmentId;


				// Check if the hash contains the department information
				if (sHash.includes("DepartmentID")) {
					// Extract the part containing DepartmentID
					var idPart = sHash.match(/DepartmentID='([^']+)'/);
					if (idPart && idPart[1]) {
						sDepartmentId = idPart[1]; // Extracted DepartmentID
					}
				}
				console.log("current url", sCurrentUrl);
				console.log("sds");
				console.log("original hash", hashIndex);
				console.log("sadad", sHash);
				console.log("Department id", sDepartmentId);
				console.log("ndnd");


				// Logic for enabling/disabling buttons and making DepartmentName read-only

				if (userRole === 'Admin') {
					debugger
					console.log('same');
					this.base.getView().findAggregatedObjects(true, function (control) {
						return control.isA("sap.m.Button");
					}).forEach(function (oButton) {
						if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete")) {
							oButton.setVisible(true);
							oButton.setEnabled(true);
						}
					});
				} else {
					// debugger
					console.log('different');
					this.base.getView().findAggregatedObjects(true, function (control) {
						return control.isA("sap.m.Button");
					}).forEach(function (oButton) {
						if (oButton.getId().includes("Edit") || oButton.getId().includes("Delete")) {
							oButton.setVisible(false);
							oButton.setEnabled(false);
						}
					});



				}

			} catch (error) {
				console.error('Error fetching Roll data', error);
			}
		}
	});
});










// this.base.getView().findAggregatedObjects(true, function (control) {
//     return control.isA("sap.m.Button") || control.isA("sap.m.Input");
// }).forEach(function (control) {
//     if (control.isA("sap.m.Button")) {
//         if (control.getId().includes("Create") || control.getId().includes("Delete") || control.getId().includes("Edit")) {
//             if ((userRole === 'ece' && sDepartmentId === 'D2') || userRole === 'ADMIN') {
//                 control.setEnabled(true); // Enable buttons for specified departments
//             } else if ((userRole === 'cse' && sDepartmentId === 'D1') || userRole === 'ADMIN') {
//                 control.setEnabled(true); // Enable buttons for specified departments
//             } else {
//                 control.setEnabled(false); // Disable buttons for other departments
//             }
//         }
//     } else if (control.isA("sap.m.Input") && control.getId().includes("DepartmentName")) {
//         // Assuming the ID of the DepartmentName input field contains "DepartmentName"
//         control.setEnabled(userRole === 'ADMIN'); // Make read-only for non-admin users
//     }
// });

