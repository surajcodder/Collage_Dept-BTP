namespace db;

entity Department {
    key uuid           : UUID;
    key DepartmentID   : String default '' @readonly;
        DepartmentName : String            @mandatory;
        deptToStudent  : Composition of many Student
                             on deptToStudent.studToDepartment = $self;
        deptToTeacher  : Composition of many TeacherDetails
                             on deptToTeacher.teachToDept = $self;
}

entity Student {
    key suuid            : UUID;
    key StudentID        : String default '' @readonly;
        DepartmentID     : String;
        Name             : String            @mandatory;
        PhoneNumber      : String            @mandatory;
        Email            : String            @mandatory;
        Address          : String;
        studToDepartment : Association to one Department
                               on studToDepartment.DepartmentID = DepartmentID;
}

entity Teacher {
    key ttuuid           : UUID;
        TeacherID        : String;
        Name             : String  @mandatory;
        Gender           : String  @mandatory  @title: 'Gender';
        PhoneNumber      : String  @mandatory;
        Email            : String  @mandatory;
        Address          : String  @mandatory;
        Dep              : String  @mandatory  @title: 'Department';
        Age              : Int16   @mandatory;
        DOB              : Date    @mandatory;
        AdditionalSkills : String  @mandatory;
        Status           : String default 'In Process';
        RejectedBy       : String;
        techToFile       : Composition of many Files
                               on techToFile.fileToTech = $self;

}

entity TeacherDetails {
    key TeacherID    : String;
        DepartmentID : String default '' @readonly;
        Name         : String            @mandatory;
        PhoneNumber  : String            @mandatory;
        Email        : String            @mandatory;
        Address      : String            @mandatory;
        Status       : String default 'Approved';
        teachToDept  : Association to many Department
                           on teachToDept.DepartmentID = DepartmentID;
}


entity Sequence {
    key Name  : String;
        Value : Integer;
}

entity Roll {
    key roll  : String;
    key email : String;
}

entity UserLogs {
    ID         : UUID;
    timestamp  : Timestamp;
    userEmail  : String;
    operation  : String;
    entityName : String;
}

entity gender {
    key ID     : String;
        gender : String;

}

entity ApprovedTeacher {
    key TeacherID        : String;
        Name             : String;
        Gender           : String;
        PhoneNumber      : String;
        Email            : String;
        Address          : String;
        Dep              : String;
        Age              : Int16;
        DOB              : Date;
        AdditionalSkills : String;
        Status           : String;
        RejectedBy       : String;
}

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Files : cuid, managed {
    @Core.MediaType  : mediaType
    content    : LargeBinary;

    @Core.IsMediaType: true
    mediaType  : String;
    fileName   : String;
    size       : Integer;
    url        : String;
    ttuuid     : String;
    fileToTech : Association to one Teacher
                     on fileToTech.ttuuid = ttuuid;
}


// entity Files: cuid, managed{
//     @Core.MediaType: mediaType
//     content: LargeBinary;
//     @Core.IsMediaType: true
//     mediaType: String;
//     fileName: String;
//     size: Integer;
//     url: String;
// }
