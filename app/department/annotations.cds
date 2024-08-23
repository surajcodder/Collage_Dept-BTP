using MyService as service from '../../srv/service';
annotate service.Department with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : DepartmentID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Department Name',
                Value : DepartmentName,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Student',
            ID : 'Student',
            Target : 'deptToStudent/@UI.LineItem#Student',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Lecturer',
            ID : 'Lecturer',
            Target : 'deptToTeacher/@UI.LineItem#Lecturer',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Department ID',
            Value : DepartmentID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Department Name',
            Value : DepartmentName,
        },
    ],
);

annotate service.Student with @(
    UI.LineItem #Student : [
        {
            $Type : 'UI.DataField',
            Value : StudentID,
            Label : 'Student ID',
        },{
            $Type : 'UI.DataField',
            Value : Name,
            Label : 'Name',
        },{
            $Type : 'UI.DataField',
            Value : PhoneNumber,
            Label : 'Phone Number',
        },{
            $Type : 'UI.DataField',
            Value : Email,
            Label : 'Email',
        },{
            $Type : 'UI.DataField',
            Value : DepartmentID,
            Label : 'Department ID',
        },]
);
annotate service.TeacherDetails with @(
    UI.LineItem #Lecturer : [
        {
            $Type : 'UI.DataField',
            Value : TeacherID,
            Label : 'Lecturer ID',
        },{
            $Type : 'UI.DataField',
            Value : Name,
            Label : 'Lecturer Name',
        },]
);
annotate service.TeacherDetails with {
    TeacherID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Teacher',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : TeacherID,
                    ValueListProperty : 'TeacherID',
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'Name',
                    LocalDataProperty : Name,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'PhoneNumber',
                    LocalDataProperty : PhoneNumber,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'Email',
                    LocalDataProperty : Email,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'Address',
                    LocalDataProperty : Address,
                },
            ],
            Label : 'Lecturer ID',
        },
        Common.ValueListWithFixedValues : true
)};
annotate service.TeacherDetails with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Lecturer',
            ID : 'Lecturer',
            Target : '@UI.FieldGroup#Lecturer',
        },
    ],
    UI.FieldGroup #Lecturer : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : TeacherID,
                Label : 'TeacherID',
            },{
                $Type : 'UI.DataField',
                Value : Name,
                Label : 'Name',
            },{
                $Type : 'UI.DataField',
                Value : DepartmentID,
                Label : 'DepartmentID',
            },{
                $Type : 'UI.DataField',
                Value : Email,
                Label : 'Email',
            },{
                $Type : 'UI.DataField',
                Value : PhoneNumber,
                Label : 'PhoneNumber',
            },{
                $Type : 'UI.DataField',
                Value : Address,
                Label : 'Address',
            },],
    }
);
annotate service.TeacherDetails with {
    Name @Common.FieldControl : #ReadOnly
};
annotate service.TeacherDetails with {
    DepartmentID @Common.FieldControl : #ReadOnly
};
annotate service.TeacherDetails with {
    Email @Common.FieldControl : #ReadOnly
};
annotate service.TeacherDetails with {
    PhoneNumber @Common.FieldControl : #ReadOnly
};
annotate service.TeacherDetails with {
    Address @Common.FieldControl : #ReadOnly
};
annotate service.Student with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Student',
            ID : 'Student',
            Target : '@UI.FieldGroup#Student',
        },],
    UI.FieldGroup #St : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    }
);
annotate service.Student with @(
    UI.FieldGroup #Student : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : StudentID,
                Label : 'StudentID',
            },{
                $Type : 'UI.DataField',
                Value : Name,
                Label : 'Name',
            },{
                $Type : 'UI.DataField',
                Value : DepartmentID,
                Label : 'DepartmentID',
            },{
                $Type : 'UI.DataField',
                Value : PhoneNumber,
                Label : 'PhoneNumber',
            },{
                $Type : 'UI.DataField',
                Value : Email,
                Label : 'Email',
            },{
                $Type : 'UI.DataField',
                Value : Address,
                Label : 'Address',
            },],
    }
);
annotate service.Student with {
    DepartmentID @Common.FieldControl : #ReadOnly
};
annotate service.Department with @(
    UI.HeaderInfo : {
        TypeName : '',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : DepartmentID,
        },
    }
);
annotate service.Student with @(
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : StudentID,
        },
        TypeName : '',
        TypeNamePlural : '',
    }
);
annotate service.TeacherDetails with @(
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : TeacherID,
        },
        TypeName : '',
        TypeNamePlural : '',
    }
);
