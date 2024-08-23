sap.ui.define([
    "sap/m/MessageToast",
], function (MessageToast) {
    'use strict';
    var GlobalID;
    return {
        onAfterItemAdded: function (oEvent) {
            var oView = oEvent.getSource().getParent();
            var ttuuid = oView.getBindingContext().getProperty("ttuuid");
            debugger
            var item = oEvent.getParameter("item");


            var baseUrl = oEvent.oSource.getModel().getServiceUrl();


            var pattern = /Teacher.*$/;
            var match = window.location.href.match(pattern);
            if (match) {
                var entityUrl = match[0];
            }

            
            // Create Entity and Upload Content logic

            var data = {
                mediaType: item.getMediaType(),
                fileName: item.getFileName(),
                size: item.getFileObject().size,
                ttuuid: ttuuid

            };

            var hashPart = window.location.href.split('#')[1];


            var settings = {
                url: baseUrl + entityUrl + "/techToFile",
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify(data)
            };

            new Promise((resolve, reject) => {
                $.ajax(settings)
                    .done((results, textStatus, request) => {
                        resolve(results.ID);
                    })
                    .fail((err) => {
                        reject(err);
                    });
            }).then((id) => {
                var url = baseUrl + `Files(ID=${id},IsActiveEntity=false)/content`;
                var oUploadSet = this.byId("uploadSet");
                item.setUrl(url)
                oUploadSet.setUploadUrl(url); // Update the upload URL
                oUploadSet.setHttpRequestMethod("PUT"); // Set HTTP request method to PUT
                oUploadSet.uploadItem(item); // Upload the item
            }).catch((err) => {
                console.log(err);
            });

        },

        onUploadCompleted: function (oEvent) {

            var oUploadSet = this.byId("uploadSet"); // Adjust to get the correct reference
            oUploadSet.removeAllIncompleteItems();
            // oUploadSet.getBinding("items").refresh();
            MessageToast.show("Uploaded successfully!");

        },


        onOpenPressed: async function (oEvent) {
            debugger
            var baseUrl = oEvent.oSource.getModel().getServiceUrl();
            var fileurl;
            if(oEvent.oSource.mProperties.url.substring(0,6) === "/Files"){
                fileurl = baseUrl + oEvent.oSource.mProperties.url.substring(1);
            }
            if(fileurl){
                oEvent.oSource.mProperties.url = fileurl;
            }
            
            // let fileurl = oEvent.oSource.mProperties.url;
           
        },



        onAfterItemRemoved: async function (oEvent) {
            // debugger
            // var item = oEvent.getParameter("item");
            // var id = item.getBindingContext().getProperty("ID");
            // var urll = `/odata/v4/my/UploadedFiles(ID=${id},IsActiveEntity=false)`

            // $.ajax({ 
            // 	url: urll,
            // 	method: "DELETE"
            // })

            debugger
            var baseUrl = oEvent.oSource.getModel().getServiceUrl()
            const regex = /^(.*?),IsActiveEntity=/;

            let match = oEvent.mParameters.item.mProperties.url.match(regex);
            let urll = match[1] + ",IsActiveEntity=false)";
            urll = urll.replace(/^.*\/Files/, "/Files");
            $.ajax({
                url: baseUrl + urll,
                method: "DELETE"

            })
        },



        onAfterItemEdited: async function (oEvent) {
            // var item = oEvent.getParameter("item");
            // var id = item.getBindingContext().getProperty("ID");
            // var urll = `/odata/v4/my/UploadedFiles(ID=${id},IsActiveEntity=false)`

            // $.ajax({
            //     url: urll,
            //     method: "PUT"
            // })
            debugger
            var baseUrl = oEvent.oSource.getModel().getServiceUrl()
            const regex = /^(.*?),IsActiveEntity=/;
            let match = oEvent.mParameters.item.mProperties.url.match(regex);
            let urll = match[1] + ",IsActiveEntity=false) ";
            urll = urll.replace(/^.*\/Files/, "/Files");

            // Prepare the data payload for PATCH
            let data = {
                fileName: oEvent.getParameter("item").getFileName(), // Example field to update
                // Add any other fields that need to be updated here
            };

            // Send PATCH request using jQuery's ajax method
            $.ajax({
                url: baseUrl + urll,
                method: "PATCH",  // Use PATCH instead of PUT
                contentType: "application/json",  // Set content type to JSON
                data: JSON.stringify(data),  // Send the data as JSON string
                success: function (response) {
                    // Handle success response
                    console.log("Update successful:", response);
                },
                error: function (error) {
                    // Handle error response
                    console.error("Update failed:", error);
                }
            });
        },

    };
});
