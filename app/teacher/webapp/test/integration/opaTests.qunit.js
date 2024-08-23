sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'teacher/test/integration/FirstJourney',
		'teacher/test/integration/pages/TeacherList',
		'teacher/test/integration/pages/TeacherObjectPage'
    ],
    function(JourneyRunner, opaJourney, TeacherList, TeacherObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('teacher') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTeacherList: TeacherList,
					onTheTeacherObjectPage: TeacherObjectPage
                }
            },
            opaJourney.run
        );
    }
);