//@ui5-bundle lecturer/Component-preload.js
sap.ui.require.preload({
	"lecturer/Component.js":function(){
sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("lecturer.Component",{metadata:{manifest:"json"}})});
},
	"lecturer/ext/controller/LecturerListController.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","jquery.sap.global","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,jQuery,t,r){"use strict";var o;return e.extend("lecturer.ext.controller.LecturerListController",{override:{onInit:function(){var e=this.base.getExtensionAPI().getModel();o="suman.senapati@peolsolutions.com"},onBeforeRendering:async function(){debugger;var e=this.base.getExtensionAPI().getModel();if(!e){console.error("Model is not available.");return}var n;if(typeof e.getServiceUrl==="function"){n=e.getServiceUrl();console.log("Service URL:",n)}else{console.error("Unable to determine the service URL.");return}const a=this.base.getView().getContent()[0].mAggregations.content.mAggregations.content.mAssociations.filter;try{const e=await new Promise((e,t)=>{jQuery.ajax({url:n+"/Teacher",method:"GET",dataType:"json",success:function(t){e(t)},error:function(e,r,o){t(new Error(r+": "+o))}})});console.log("Fetched data:",e);if(e&&e.value){e.value.forEach(function(e){console.log("Teacher Name:",e.Name)})}else{console.log("No data found or invalid response format")}}catch(e){console.error("Error fetching Department data",e)}try{const e=await new Promise((e,t)=>{jQuery.ajax({url:n+"/Roll",method:"GET",dataType:"json",success:function(t){e(t)},error:function(e,r,o){t(new Error(r+": "+o))}})});console.log("Fetched Roll data:",e);var i;if(e&&e.value){e.value.forEach(function(e){if(e.email===o){i=e.roll}})}else{console.log("No data found or invalid response format")}var s=this.getView().findAggregatedObjects(true,function(e){return e.isA("sap.ui.table.Table")||e.isA("sap.m.Table")})[0];debugger;var l=s.getBinding("items");if(i!=="Admin"){this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")}).forEach(function(e){if(e.getId().includes("Create")||e.getId().includes("Delete")){e.setVisible(false)}});var c=sap.ui.getCore().byId(a);var u={$editState:[{operator:"DRAFT_EDIT_STATE",values:["ALL_HIDING_DRAFTS","All (Hiding Drafts)"],validated:"Validated"}]};if(l){var d=new t({path:"IsActiveEntity",operator:r.EQ,value1:true});l.filter([d])}c.setFilterConditions(u);this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.fe.macros.controls.FilterBar")}).forEach(function(e){e.setVisible(false)})}}catch(e){console.error("Error fetching Roll data",e)}}}})});
},
	"lecturer/ext/controller/LecturerObjectController.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","jquery.sap.global"],function(e,jQuery){"use strict";var t;return e.extend("lecturer.ext.controller.LecturerObjectController",{override:{onInit:function(){debugger;var e=this.base.getExtensionAPI().getModel();t="suman.senapati@peolsolutions.com";var o=this.getView().createId("uploadSet-uploadButton");var n=sap.ui.getCore().byId(o);if(n){console.log("Upload button ID:",n.getId())}},routing:{onBeforeBinding:async function(e){console.log("onBeforeBinding called with context:",e);if(e){console.log("Binding Context Path:",e.getPath())}else{console.log("No binding context available.");return}var t=this.base.getExtensionAPI().getModel();if(!t){console.error("Model is not available.");return}var o;if(typeof t.getServiceUrl==="function"){o=t.getServiceUrl();console.log("Service URL:",o)}else{console.error("Unable to determine the service URL.");return}this.adjustUIControls();await this.fetchAndProcessData(o)}}},adjustUIControls:function(){var e=this;setTimeout(function(){e.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")||e.isA("sap.m.DatePicker")||e.isA("sap.m.Input")||e.isA("sap.m.TextArea")||e.isA("sap.m.ComboBox")}).forEach(function(t){var o=t.getId();console.log("Control ID: ",o);debugger;if(t.isA("sap.m.Button")&&o.includes("Save")&&t.getText().includes("Create")){t.setText("Send for approval")}if(t.isA("sap.m.Button")&&o.includes("Save")&&t.getVisible()===true){debugger;var n=this.base.getView();var a=n.findAggregatedObjects(true);var s=a.filter(function(e){return e.getId().includes("uploadSet-uploader")||e.getId().includes("uploadSet-uploadButton")});s.forEach(function(e){e.setVisible(true)});var i=a.filter(function(e){return e.getId().includes("uploadSet")});i.forEach(function(e){console.log("Control ID:",e.getId());console.log("Control Type:",e.getMetadata().getName());if(e.isA("sap.m.Button")&&e.getId().includes("deleteButton")){e.setVisible(true);e.setEnabled(true)}if(e.isA("sap.m.Button")&&e.getId().includes("editButton")){e.setVisible(true);e.setEnabled(true)}});i.forEach(function(e){try{e.setUploadEnabled(true)}catch(t){console.log("Error setting UploadEnabled to false for control: ",e.getId(),t)}})}if(t.isA("sap.m.Button")&&o.includes("Save")&&t.getVisible()===false){debugger;var n=this.base.getView();var a=n.findAggregatedObjects(true);var s=a.filter(function(e){return e.getId().includes("uploadSet-uploader")||e.getId().includes("uploadSet-uploadButton")});s.forEach(function(e){e.setVisible(false)});var i=a.filter(function(e){return e.getId().includes("uploadSet")});i.forEach(function(e){console.log("Control ID:",e.getId());console.log("Control Type:",e.getMetadata().getName());if(e.isA("sap.m.Button")&&e.getId().includes("deleteButton")){e.setVisible(false);e.setEnabled(false)}if(e.isA("sap.m.Button")&&e.getId().includes("editButton")){e.setVisible(false);e.setEnabled(false)}});i.forEach(function(e){try{e.setUploadEnabled(false)}catch(t){console.log("Error setting UploadEnabled to false for control: ",e.getId(),t)}})}if(t.isA("sap.m.Input")&&o.includes("Age")){t.setEditable(false)}if(t.isA("sap.m.DatePicker")&&o.includes("DOB")){console.log("Found DOB field!");t.attachChange(function(){var o=t.getDateValue();if(o){var n=e.calculateAge(o);e.setAgeField(n)}})}}.bind(e))}.bind(e),500)},fetchAndProcessData:async function(e){var o=this;try{const t=await new Promise((t,o)=>{jQuery.ajax({url:e+"/Department",method:"GET",dataType:"json",success:function(e){t(e)},error:function(e,t,n){o(new Error(t+": "+n))}})});console.log("Fetched data:",t);if(t&&t.value){t.value.forEach(function(e){console.log("Department Name:",e.DepartmentName)})}else{console.log("No data found or invalid response format")}}catch(e){console.error("Error fetching data",e)}try{const o=await new Promise((t,o)=>{jQuery.ajax({url:e+"/Roll",method:"GET",dataType:"json",success:function(e){t(e)},error:function(e,t,n){o(new Error(t+": "+n))}})});console.log("Fetched Authorization data:",o);var n;if(o&&o.value){o.value.forEach(function(e){if(e.email===t){n=e.roll}})}else{console.log("No data found or invalid response format")}var a=window.location.href;var s=a.indexOf("#");var i=a.substring(s+1);var r;if(i.includes("DepartmentID")){var l=i.match(/DepartmentID='([^']+)'/);if(l&&l[1]){r=l[1]}}console.log("current url",a);console.log("sds");console.log("original hash",s);console.log("sadad",i);console.log("Department id",r);console.log("ndnd");if(n==="Admin"){debugger;console.log("same");this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")}).forEach(function(e){if(e.getId().includes("Edit")||e.getId().includes("Delete")){e.setVisible(true);e.setEnabled(true)}})}else{console.log("different");this.base.getView().findAggregatedObjects(true,function(e){return e.isA("sap.m.Button")}).forEach(function(e){if(e.getId().includes("Edit")||e.getId().includes("Delete")){e.setVisible(false);e.setEnabled(false)}})}}catch(e){console.error("Error fetching Roll data",e)}}})});
},
	"lecturer/ext/fragment/FileAttachment.fragment.xml":'<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"  xmlns:upload="sap.m.upload" xmlns:macros="sap.fe.macros"><VBox core:require="{ handler: \'lecturer/ext/fragment/FileAttachment\'}"><Button text="FileAttachment" press="handler.onPress" /><App id="app"><pages><Page id="page" showHeader="false"><upload:UploadSet\n                    id="uploadSet"\n                    instantUpload="false"\n                    uploadEnabled="true"\n                    afterItemEdited="handler.onAfterItemEdited"\n                    beforeItemEdited="handler.onAfterItemEdited"\n                    afterItemAdded="handler.onAfterItemAdded"\n                    uploadCompleted="handler.onUploadCompleted"   \n\t\t\t\t\tafterItemRemoved="handler.onAfterItemRemoved"          \n                    items="{\n                                path: \'techToFile\',\n                                parameters: {\n                                    $orderby: \'createdAt desc\'\n                                },\n                                templateShareable: false}" \n                                mode="MultiSelect"><upload:toolbar><OverflowToolbar id="_IDGenOverflowToolbar1"><ToolbarSpacer id="_IDGenToolbarSpacer1"/><upload:UploadSetToolbarPlaceholder id="_IDGenUploadSetToolbarPlaceholder1" /></OverflowToolbar></upload:toolbar><upload:items><upload:UploadSetItem \n                            id="_IDGenUploadSetItem1"\n                                fileName="{fileName}"\n                                mediaType="{mediaType}"\n                                url="{url}"\n                                openPressed="handler.onOpenPressed"><upload:attributes><ObjectAttribute id="_IDGenObjectAttribute1" \n                                        title="Uploaded By"\n                                        text="{createdBy}"\n                                        active="true"/><ObjectAttribute id="_IDGenObjectAttribute2"\n                                        title="Uploaded on"\n                                        text="{createdAt}"\n                                        active="true"/><ObjectAttribute id="_IDGenObjectAttribute3"\n                                        title="File Size"\n                                        text="{size}"\n                                        active="true"/></upload:attributes></upload:UploadSetItem></upload:items></upload:UploadSet></Page></pages></App></VBox></core:FragmentDefinition>',
	"lecturer/ext/fragment/FileAttachment.js":function(){
sap.ui.define(["sap/m/MessageToast"],function(e){"use strict";var t;return{onAfterItemAdded:function(e){var t=e.getSource().getParent();var r=t.getBindingContext().getProperty("ttuuid");debugger;var o=e.getParameter("item");var a=e.oSource.getModel().getServiceUrl();var i=/Teacher.*$/;var s=window.location.href.match(i);if(s){var n=s[0]}var l={mediaType:o.getMediaType(),fileName:o.getFileName(),size:o.getFileObject().size,ttuuid:r};var c=window.location.href.split("#")[1];var u={url:a+n+"/techToFile",method:"POST",headers:{"Content-type":"application/json"},data:JSON.stringify(l)};new Promise((e,t)=>{$.ajax(u).done((t,r,o)=>{e(t.ID)}).fail(e=>{t(e)})}).then(e=>{var t=a+`Files(ID=${e},IsActiveEntity=false)/content`;var r=this.byId("uploadSet");o.setUrl(t);r.setUploadUrl(t);r.setHttpRequestMethod("PUT");r.uploadItem(o)}).catch(e=>{console.log(e)})},onUploadCompleted:function(t){var r=this.byId("uploadSet");r.removeAllIncompleteItems();e.show("Uploaded successfully!")},onOpenPressed:async function(e){debugger;var t=e.oSource.getModel().getServiceUrl();var r;if(e.oSource.mProperties.url.substring(0,14)==="/Files"){r=t+e.oSource.mProperties.url.substring(1)}if(r){e.oSource.mProperties.url=r}},onAfterItemRemoved:async function(e){debugger;var t=e.oSource.getModel().getServiceUrl();const r=/^(.*?),IsActiveEntity=/;let o=e.mParameters.item.mProperties.url.match(r);let a=o[1]+",IsActiveEntity=false)";$.ajax({url:t+a,method:"DELETE"})},onAfterItemEdited:async function(e){debugger;var t=e.oSource.getModel().getServiceUrl();const r=/^(.*?),IsActiveEntity=/;let o=e.mParameters.item.mProperties.url.match(r);let a=o[1]+",IsActiveEntity=false) ";let i={fileName:e.getParameter("item").getFileName()};$.ajax({url:t+a,method:"PATCH",contentType:"application/json",data:JSON.stringify(i),success:function(e){console.log("Update successful:",e)},error:function(e){console.error("Update failed:",e)}})}}});
},
	"lecturer/i18n/i18n.properties":'# This is the resource bundle for lecturer\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Lecturer Info\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n\n#XFLD,33\nflpTitle=Teacher App\n',
	"lecturer/manifest.json":'{"_version":"1.59.0","sap.app":{"id":"lecturer","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{Teacher}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.14.4","toolsId":"64036955-77a2-45e6-ae01-03c3d86e11d2"},"dataSources":{"mainService":{"uri":"odata/v4/my/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}},"crossNavigation":{"inbounds":{"TeacherApp-display":{"semanticObject":"TeacherApp","action":"display","title":"{{flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.127.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.ushell":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"lecturer.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{},"routes":[{"pattern":":?query:","name":"TeacherList","target":"TeacherList"},{"pattern":"Teacher({key}):?query:","name":"TeacherObjectPage","target":"TeacherObjectPage"},{"pattern":"Teacher({key})/techToFile({key2}):?query:","name":"FilesObjectPage","target":"FilesObjectPage"}],"targets":{"TeacherList":{"type":"Component","id":"TeacherList","name":"sap.fe.templates.ListReport","options":{"settings":{"contextPath":"/Teacher","variantManagement":"Page","navigation":{"Teacher":{"detail":{"route":"TeacherObjectPage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"type":"ResponsiveTable"}}}}}},"TeacherObjectPage":{"type":"Component","id":"TeacherObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"contextPath":"/Teacher","navigation":{"techToFile":{"detail":{"route":"FilesObjectPage"}}},"content":{"body":{"sections":{"FileAttachment":{"template":"lecturer.ext.fragment.FileAttachment","position":{"placement":"After","anchor":"GeneratedFacet1"},"title":"FileAttachment"}}}}}}},"FilesObjectPage":{"type":"Component","id":"FilesObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"contextPath":"/Teacher/techToFile"}}}}},"extends":{"extensions":{"sap.ui.controllerExtensions":{"sap.fe.templates.ListReport.ListReportController":{"controllerName":"lecturer.ext.controller.LecturerListController"},"sap.fe.templates.ObjectPage.ObjectPageController":{"controllerName":"lecturer.ext.controller.LecturerObjectController"}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"Dept_router"}}'
});
//# sourceMappingURL=Component-preload.js.map
