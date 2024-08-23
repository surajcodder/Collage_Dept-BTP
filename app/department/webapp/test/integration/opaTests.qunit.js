sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'department/test/integration/FirstJourney',
		'department/test/integration/pages/DepartmentList',
		'department/test/integration/pages/DepartmentObjectPage',
		'department/test/integration/pages/StudentObjectPage'
    ],
    function(JourneyRunner, opaJourney, DepartmentList, DepartmentObjectPage, StudentObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('department') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDepartmentList: DepartmentList,
					onTheDepartmentObjectPage: DepartmentObjectPage,
					onTheStudentObjectPage: StudentObjectPage
                }
            },
            opaJourney.run
        );
    }
);