using MyService as service from '../../srv/service';
annotate service.Teacher with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Teacher ID',
                Value : TeacherID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : Name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Phone Number',
                Value : PhoneNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : Email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Address',
                Value : Address,
            },
            {
                $Type : 'UI.DataField',
                Value : Gender,
            },
            {
                $Type : 'UI.DataField',
                Value : DOB,
                Label : 'DOB',
            },
            {
                $Type : 'UI.DataField',
                Value : Dep,
            },
            {
                $Type : 'UI.DataField',
                Value : Age,
                Label : 'Age',
            },
            {
                $Type : 'UI.DataField',
                Value : AdditionalSkills,
                Label : 'AdditionalSkills',
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Teacher ID',
            Value : TeacherID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : Name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Phone Number',
            Value : PhoneNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : Email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Address',
            Value : Address,
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : Status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Approved',
                        },
                    ],
                },
            ],
        },
        Text : 'Approved',
    },
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : Name,
            Label : 'Name',
        },
        {
            $Type : 'UI.DataField',
            Value : Email,
            Label : 'Email',
        },
        {
            $Type : 'UI.DataField',
            Value : Gender,
        },
        {
            $Type : 'UI.DataField',
            Value : PhoneNumber,
            Label : 'PhoneNumber',
        },
        {
            $Type : 'UI.DataField',
            Value : RejectedBy,
            Label : 'RejectedBy',
        },
        {
            $Type : 'UI.DataField',
            Value : Status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : Status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Rejected',
                        },
                    ],
                },
            ],
        },
        Text : 'Rejected',
    },
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : Name,
            Label : 'Name',
        },
        {
            $Type : 'UI.DataField',
            Value : Email,
            Label : 'Email',
        },
        {
            $Type : 'UI.DataField',
            Value : Gender,
        },
        {
            $Type : 'UI.DataField',
            Value : PhoneNumber,
            Label : 'PhoneNumber',
        },
        {
            $Type : 'UI.DataField',
            Value : RejectedBy,
            Label : 'RejectedBy',
        },
        {
            $Type : 'UI.DataField',
            Value : Status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : Status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'In Process',
                        },
                    ],
                },
            ],
        },
        Text : 'In Process',
    },
);

annotate service.Teacher with @(
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : 'Welcome',
        },
        TypeName : '',
        TypeNamePlural : '',
    }
);
annotate service.Teacher with {
    TeacherID @(
        Common.FieldControl : #ReadOnly,
        )
};

annotate service.Teacher with {
    Dep @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Department',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Dep,
                    ValueListProperty : 'DepartmentName',
                },
            ],
            Label : 'Department',
        },
        Common.ValueListWithFixedValues : false
)};

annotate service.Teacher with {
    Gender @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Gender',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Gender,
                    ValueListProperty : 'gender',
                },
            ],
            Label : 'Gender',
        },
        Common.ValueListWithFixedValues : true
)};

annotate service.Teacher with {
    Name @Common.FieldControl : #Mandatory
};

annotate service.Teacher with {
    PhoneNumber @Common.FieldControl : #Mandatory
};

annotate service.Teacher with {
    Email @Common.FieldControl : #Mandatory
};

