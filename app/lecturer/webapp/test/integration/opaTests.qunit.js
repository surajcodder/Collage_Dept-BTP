sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'lecturer/test/integration/FirstJourney',
		'lecturer/test/integration/pages/TeacherList',
		'lecturer/test/integration/pages/TeacherObjectPage',
		'lecturer/test/integration/pages/FilesObjectPage'
    ],
    function(JourneyRunner, opaJourney, TeacherList, TeacherObjectPage, FilesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('lecturer') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTeacherList: TeacherList,
					onTheTeacherObjectPage: TeacherObjectPage,
					onTheFilesObjectPage: FilesObjectPage
                }
            },
            opaJourney.run
        );
    }
);