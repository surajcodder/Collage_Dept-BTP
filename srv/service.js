const { Console } = require("console");
const axios = require('axios');
const cds = require('@sap/cds');
// const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Department, Teacher, Sequence, Student, TeacherDetails, UserLogs, Roll, ApprovedTeacher, items, Files } = this.entities;

  // Utility function to normalize names by removing spaces
  function normalizeName(name) {
    return name.replace(/\s+/g, '');
  }


  async function generateToken() {
    const tokenUrl = 'https://f5b5e17atrial.authentication.us10.hana.ondemand.com/oauth/token';
    const clientId = 'sb-309c57b0-3e10-4f04-8649-7e3dbcbe8b62!b308792|xsuaa!b49390';
    const clientSecret = '721cd97a-0ab0-47fb-9769-a552ccf0226f$yDG1X01EU052tQAoeBoCds66d0IloSRgdpHpTADn0_o=';

    try {
      const response = await axios.post(tokenUrl, null, {
        params: {
          grant_type: 'client_credentials'
        },
        auth: {
          username: clientId,
          password: clientSecret
        }
      });

      const token = response.data.access_token;
      console.log('Generated Token:', token);
      return token;
    } catch (error) {
      console.error('Error generating token:', error.response ? error.response.data : error.message);
    }
  }
  function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
  
    return age;
  }




  // Handle CREATE operation for Department
  this.before('CREATE', 'Department', async (req) => {
    const newDeptName = normalizeName(req.data.DepartmentName);

    // Check if the department name already exists
    const existingDepartments = await SELECT.from(Department);
    for (const department of existingDepartments) {
      if (normalizeName(department.DepartmentName) === newDeptName) {
        req.error(400, `The department name '${req.data.DepartmentName.trim()}' already exists as  '${userInfo}' '${department.DepartmentName}'.`);
        return;
      }
    }

    // Get the current sequence value for DepartmentID
    let departmentSequence = await SELECT.one.from(Sequence).where({ Name: 'DepartmentID' });

    // If no sequence exists, initialize it
    if (!departmentSequence) {
      departmentSequence = { Name: 'DepartmentID', Value: 0 };
      await INSERT.into(Sequence).entries(departmentSequence);
    }

    // Generate new DepartmentID
    const newId = departmentSequence.Value + 1;
    req.data.DepartmentID = `D${newId}`;

    // Update the sequence value
    await UPDATE(Sequence).set({ Value: newId }).where({ Name: 'DepartmentID' });

    const tx = cds.transaction(req);

    // Handle StudentID generation if there are students in deptToStudent
    if (req.data.deptToStudent && Array.isArray(req.data.deptToStudent) && req.data.deptToStudent.length > 0) {
      // Get the current sequence value for StudentID
      let studentSequence = await SELECT.one.from(Sequence).where({ Name: 'StudentID' });

      // If no sequence exists, initialize it
      if (!studentSequence) {
        studentSequence = { Name: 'StudentID', Value: 0 };
        await INSERT.into(Sequence).entries(studentSequence);
      }

      // Process each student
      for (const student of req.data.deptToStudent) {
        // Check if StudentID already exists in Student table
        if (student.StudentID) {
          const existingStudent = await tx.read(Student).where({ StudentID: student.StudentID });
          if (existingStudent.length > 0) {
            // StudentID exists in Student table, do not generate new ID
            continue;
          }
        }

        // Check if StudentID already exists in draft table
        if (student.StudentID) {
          const existingDraft = await tx.read('MYSERVICE_STUDENT_DRAFTS').where({ StudentID: student.StudentID });
          if (existingDraft.length > 0) {
            // StudentID exists in draft table, do not generate new ID
            continue;
          }
        }

        // Validate PhoneNumber within the same department
        if (student.PhoneNumber) {
          const existingPhoneSameDept = await tx.read(Student)
            .where({ PhoneNumber: student.PhoneNumber, DepartmentID: req.data.DepartmentID });
          if (existingPhoneSameDept.length > 0) {
            req.error(409, `Phone number ${student.PhoneNumber} already exists in the same department.`);
            return;
          }

          // Validate PhoneNumber across all departments
          const existingPhone = await tx.read(Student)
            .where({ PhoneNumber: student.PhoneNumber });
          if (existingPhone.length > 0) {
            req.error(409, `Phone number ${student.PhoneNumber} already exists.`);
            return;
          }

          // Check in the draft table as well
          const existingPhoneInDrafts = await tx.read('MYSERVICE_STUDENT_DRAFTS')
            .where({ PhoneNumber: student.PhoneNumber });
          if (existingPhoneInDrafts.length > 1) {
            req.error(409, `Phone number ${student.PhoneNumber} already exists in draft records.`);
            return;
          }
        }

        // Validate Email within the same department
        if (student.Email) {
          const existingEmailSameDept = await tx.read(Student)
            .where({ Email: student.Email, DepartmentID: req.data.DepartmentID });
          if (existingEmailSameDept.length > 0) {
            req.error(409, `Email ${student.Email} already exists in the same department.`);
            return;
          }

          // Validate Email across all departments
          const existingEmail = await tx.read(Student)
            .where({ Email: student.Email });
          if (existingEmail.length > 0) {
            req.error(409, `Email ${student.Email} already exists.`);
            return;
          }

          // Check in the draft table as well
          const existingEmailInDrafts = await tx.read('MYSERVICE_STUDENT_DRAFTS')
            .where({ Email: student.Email });
          if (existingEmailInDrafts.length > 1) {
            req.error(409, `Email ${student.Email} already exists in draft records.`);
            return;
          }
        }

        // Generate new StudentID
        const newId = studentSequence.Value + 1;
        student.StudentID = `S${newId}`;

        // Update the sequence value
        await UPDATE(Sequence).set({ Value: newId }).where({ Name: 'StudentID' });

        // Increment sequence for the next student
        studentSequence.Value = newId;
      }
    } else {
      console.error('deptToStudent is not in the expected format in req.data');
    }
  });

  // Handle UPDATE operation for Department
  this.before('UPDATE', 'Department', async (req) => {
    const tx = cds.transaction(req);

    // Handle StudentID generation if there are students in deptToStudent
    if (req.data.deptToStudent && Array.isArray(req.data.deptToStudent) && req.data.deptToStudent.length > 0) {
      // Get the current sequence value for StudentID
      let studentSequence = await SELECT.one.from(Sequence).where({ Name: 'StudentID' });

      // If no sequence exists, initialize it
      if (!studentSequence) {
        studentSequence = { Name: 'StudentID', Value: 0 };
        await INSERT.into(Sequence).entries(studentSequence);
      }

      // Process each student
      for (const student of req.data.deptToStudent) {
        // Check if StudentID already exists in Student table
        if (student.StudentID) {
          const existingStudent = await tx.read(Student).where({ StudentID: student.StudentID });
          if (existingStudent.length > 0) {
            // StudentID exists in Student table, do not generate new ID
            continue;
          }
        }

        // Check if StudentID already exists in draft table
        if (student.StudentID) {
          const existingDraft = await tx.read('MYSERVICE_STUDENT_DRAFTS').where({ StudentID: student.StudentID });
          if (existingDraft.length > 0) {
            // StudentID exists in draft table, do not generate new ID
            continue;
          }
        }

        if (student.PhoneNumber) {
          const existingPhone = await tx.read(Student).where({ PhoneNumber: student.PhoneNumber });
          if (existingPhone.length > 0) {
            req.error(409, `Phone number ${student.PhoneNumber} already exists.`);
            return;
          }
        }

        // Validate Email
        if (student.Email) {
          const existingEmail = await tx.read(Student).where({ Email: student.Email });
          if (existingEmail.length > 0) {
            req.error(409, `Email ${student.Email} already exists.`);
            return;
          }
        }

        // Generate new StudentID
        const newId = studentSequence.Value + 1;
        student.StudentID = `S${newId}`;

        // Update the sequence value
        await UPDATE(Sequence).set({ Value: newId }).where({ Name: 'StudentID' });

        // Increment sequence for the next student
        studentSequence.Value = newId;
      }
    } else {
      console.error('deptToStudent is not in the expected format in req.data');
    }
  });

  // Handle CREATE operation for Teacher
  this.before('CREATE', 'Teacher', async (req) => {
    debugger
    if(req.data.techToFile){
              for (const stud of req.data.techToFile) { 
                      stud.url = `/Files(ID=${stud.ID},IsActiveEntity=true)/content`
              }
          } 
    // console.log(JSON.stringify(req.data))

    // req.data.url = `/odata/v4/my/Files(${req.data.ID})/content`
    // req.data.url = `/odata/v4/my/Files(ID=${req.data.ID},IsActiveEntity=false)/content`
    // Check if the phone number already exists
    if (req.data.PhoneNumber) {
      const existingPhone = await SELECT.one.from(Teacher).where({ PhoneNumber: req.data.PhoneNumber });
      if (existingPhone) {
        req.error(409, `Phone number ${req.data.PhoneNumber} already exists.`);
      }
    }

    // Validate Email
    if (req.data.Email) {
      const existingEmail = await SELECT.one.from(Teacher).where({ Email: req.data.Email });
      if (existingEmail) {
        req.error(409, `Email ${req.data.Email} already exists.`);
      }
    }

    // Start a transaction
    // const tx = cds.transaction(req);

    // Read the draft record from the MYSERVICE_TEACHER_DRAFTS table
    // const draftRecord = await tx.read('MYSERVICE_TEACHER_DRAFTS').where({ TeacherID: req.data.TeacherID });
    // const draftRecord = await SELECT.one.from('MYSERVICE_TEACHER_DRAFTS').where({ TeacherID: req.data.TeacherID });


    // console.log(`Age: ${age}`);


    req.data.TeacherID = '';
    req.data.Status = "In Process";
    // // Get the current sequence value for TeacherID
    // let teacherSequence = await SELECT.one.from(Sequence).where({ Name: 'TeacherID' });

    // // If no sequence exists, initialize it
    // if (!teacherSequence) {
    //   teacherSequence = { Name: 'TeacherID', Value: 0 };
    //   await INSERT.into(Sequence).entries(teacherSequence);
    // }

    // // // Generate new TeacherID
    // const newId = teacherSequence.Value + 1;
    // const StoreId = `T${newId}`;


    // Update the sequence value
    // await UPDATE(Sequence).set({ Value: newId }).where({ Name: 'TeacherID' });
    debugger
    // const RollData = await SELECT.one.from(Roll).where({ roll: req.data.roll });
    let emailForRejected = '';
    const inputdepartmentname = req.data.Dep;
    let userData = await SELECT.one.from(Roll).where({ roll: inputdepartmentname });
    console.log(userData);
    if (userData) {
      emailForRejected = userData.email;
    }
    else {
      const Thirdparty = await SELECT.one.from(Roll).where({ roll: 'OTHERS' });
      console.log(Thirdparty);
      if (Thirdparty) {
        emailForRejected = Thirdparty.email;
      }
    }

    debugger
    const workflowContent = JSON.stringify({
      "definitionId": "us10.f5b5e17atrial.teacherapproval1.myprocess1",
      "context": {
        "teacherName": req.data.Name,
        "phoneNo": req.data.PhoneNumber,
        "email": req.data.Email,
        "address": req.data.Address,
        "teacherid": req.data.TeacherID,
        "tuuid": req.data.ttuuid,
        "rejectedby": emailForRejected,
        "age": req.data.Age,
        "gender": req.data.Gender,
        "dob": req.data.DOB,
        "hodemail": emailForRejected
      }
    });

    const token = await generateToken();
    const authHeader = `Bearer ${token}`;
    const cds = require('@sap/cds');
    const destination = await cds.connect.to('spa_api');
    const result = await axios.post('https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances', workflowContent, {
      headers: {
        "Accept-Language": "en",
        "DataServiceVersion": "2.0",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": authHeader
      }
    });
    debugger;
    return result;
    // debugger

    // const result = await destination.post('/workflow/rest/v1/workflow-instances', workflowContent,
    //   {
    //     "Content-Type": "application/json"
    //   });
    // debugger
    // return result;

  });


  this.after('UPDATE', 'Teacher', async (req) => {
    debugger
    // teacherKaUUID = req.data.ttuuid;
    //   // const tx = cds.transaction(req);
    if (req.Status === 'Approved' && !req.TeacherID) {
      let teacherSequence = await SELECT.one.from(Sequence).where({ Name: 'TeacherID' });
      if (!teacherSequence) {
        teacherSequence = { Name: 'TeacherID', Value: 0 };
        await INSERT.into(Sequence).entries(teacherSequence);
      }
      const newId = teacherSequence.Value + 1;
      const newTID = `T${newId}`;
      var idha = req.ttuuid;
      await cds.update(Teacher).set({ TeacherID: newTID }).where({ ttuuid: idha });
      await cds.update(Sequence).set({ Value: newId }).where({ Name: 'TeacherID' });
      const teacher = await SELECT.one.from(Teacher).where({ ttuuid: idha });
      await INSERT.into(ApprovedTeacher).entries({
        TeacherID: newTID,
        Name: teacher.Name,
        Gender: teacher.Gender,
        PhoneNumber: teacher.PhoneNumber,
        Email: teacher.Email,
        Address: teacher.Address,
        Dep: teacher.Dep,
        Age: teacher.Age,
        DOB: teacher.DOB,
        AdditionalSkills: teacher.AdditionalSkills,
        Status: req.Status,  // Set the status to 'Approved'
        RejectedBy: teacher.RejectedBy // Include this field, though it might not be relevant for approved teachers
    });
    }
    // var tid = 'T99';

  });


  // Handle UPDATE operation for Teacher
  this.before('UPDATE', 'Teacher', async (req) => {

    if(req.data.techToFile){
      for (const stud of req.data.techToFile) { 
            stud.url = `/Files(ID=${stud.ID},IsActiveEntity=true)/content`
      }
  } 

    // // Check if the phone number already exists
    // if (req.data.PhoneNumber) {
    //   const existingPhone = await SELECT.one.from(Teacher).where({ PhoneNumber: req.data.PhoneNumber });
    //   if (existingPhone) {
    //     req.error(409, `Phone number ${req.data.PhoneNumber} already exists.`);
    //   }
    //   const existingPhone1 = await SELECT.one.from(Teacher).where({ PhoneNumber: req.data.PhoneNumber });
    //   if (existingPhone1) {
    //     req.error(409, `Phone number ${req.data.PhoneNumber} already exists.`);

    //   }
    // }

    // // Validate Email
    // if (req.data.Email) {
    //   const existingEmail = await SELECT.one.from(Teacher).where({ Email: req.data.Email });
    //   if (existingEmail) {
    //     req.error(409, `Email ${req.data.Email} already exists.`);
    //   }
    //   const existingEmailStud = await SELECT.one.from(Student).where({ Email: req.data.Email });
    //   if (existingEmailStud) {
    //     req.error(409, `Email ${req.data.Email} already exists.`);
    //   }
    // }

  });

  // // Handle CREATE operation for TeacherDetails
  // this.before('CREATE', 'TeacherDetails', async (req) => {
  //   // Get the current sequence value for TeacherID
  //   let teacherSequence = await SELECT.one.from(Sequence).where({ Name: 'TeacherID' });

  //   // If no sequence exists, initialize it
  //   if (!teacherSequence) {
  //     teacherSequence = { Name: 'TeacherID', Value: 0 };
  //     await INSERT.into(Sequence).entries(teacherSequence);
  //   }

  //   // Generate new TeacherID
  //   const newId = teacherSequence.Value + 1;
  //   req.data.TeacherID = `T${newId}`;

  //   // Update the sequence value
  //   await UPDATE(Sequence).set({ Value: newId }).where({ Name: 'TeacherID' });

  //   // Assign the Tuuid value to the TeacherDetails record
  //   req.data.Tuuid = cds.utils.uuid();

    this.before('CREATE', 'Files', req => {
      debugger
      console.log('Create called')
      console.log(JSON.stringify(req.data))
      req.data.url = `/Files(ID=${req.data.ID},IsActiveEntity=true)/content`

  })

  this.before(['CREATE','UPDATE'], Files.drafts, req => {
    console.log('Create Update Draft called')
    console.log(JSON.stringify(req.data))
    req.data.url = `/Files(ID=${req.data.ID},IsActiveEntity=true)/content`
});



// Example usage:
 // Format: YYYY-MM-DD

this.on('READ', Teacher.drafts, async (req, next) => { 
  debugger  
  if(req.data.DOB){
    var age = calculateAge(req.data.DOB);
    await cds.update(Teacher.drafts).set({ Age: age }).where({ ttuuid: req.data.ttuuid});
  }
return next();
});
this.on('postattach', async (req) => {
  debugger
  console.log("functionImport triggered", req.data);
  return "success";
});


//   this.before('UPDATE', CollTeacher, req => {
//     debugger
//     if(req.data.teachToFile){
//         for (const stud of req.data.teachToFile) { 
//             if(!stud.url) {
//                 stud.url = `/odata/v4/my/Files(ID=${stud.ID},IsActiveEntity=true)/content`
//             }
//         }
//     }    
//  })

});

