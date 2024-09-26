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
  
    if (age < 18 || age > 70) {
        return { error: "Please enter a valid date of birth that results in an age between 18 and 70 years." };
    }
  
    return { age };
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

    var str1 = 'Teacher(ttuuid=';
    var str2 =  req.data.ttuuid;
    var str3 = ',IsActiveEntity=true)/techToFile';
    var linkurl = str1 + str2 + str3;

    debugger
    const workflowContent = JSON.stringify({
      "definitionId": "us10.f5b5e17atrial.teacherapproval1.myprocess1",
      "context": {
          "teacherName": req.data.Name,
          "phoneNo": req.data.PhoneNumber,
          "email": req.data.Email,
          "address": req.data.Address,
          "tuuid": req.data.ttuuid,
          "rejectedby": emailForRejected,
          "age": req.data.Age,
          "gender": req.data.Gender,
          "dob": req.data.DOB,
          "hodemail": emailForRejected,
          "additionalSkills": req.data.AdditionalSkills,
          "dept": req.data.Dep,
          "teacherid": req.data.TeacherID,
           "url": linkurl
      }
  }
    );

    const token = await generateToken();
    console.log(token);
    const authHeader = `Bearer ${token}`;
    const cds = require('@sap/cds');
    const destination = await cds.connect.to('spa_api');
    try {
      const result = await axios.post('https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances', workflowContent, {
        headers: {
          "Accept-Language": "en",
          "DataServiceVersion": "2.0",
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": authHeader
        }
      });
      return result;
    } catch (error) {
      console.error('Error response:', error.response.data);  // Log the error response
      throw error;
    }
    
    debugger;
    return result;
    debugger

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
    }
    // var tid = 'T99';

  });


  // Handle UPDATE operation for Teacher
  this.before('UPDATE', 'Teacher', async (req) => {
    const token = await generateToken();

    if(req.data.techToFile){
      for (const stud of req.data.techToFile) { 
            stud.url = `/Files(ID=${stud.ID},IsActiveEntity=true)/content`
      }
  } 

     // Check if the phone number already exists with a different ID
     if (req.data.PhoneNumber) {
      // if (!validatePhoneNumber(req.data.PhoneNumber)) {
      //     req.error(400, 'Phone number must be exactly 10 digits');
      //     return;
      // }
      const existingPhone = await SELECT.one.from(Teacher)
          .where({ PhoneNumber: req.data.PhoneNumber, TeacherID: { '!=': req.data.TeacherID } });
      const existingPhone1 = await SELECT.one.from(Student)
          .where({ PhoneNumber: req.data.PhoneNumber }) //, TeacherID: { '!=': req.data.TeacherID } });
      if (existingPhone || existingPhone1) {
          req.error(409, `Phone number ${req.data.PhoneNumber} already exists.`);
      }
  }

  // Validate Email
  if (req.data.Email) {
      // if (!validateEmail(req.data.Email)) {
      //     req.error(400, 'Email is not in a valid format.');
      //     return;
      // }
      const existingEmail = await SELECT.one.from(Teacher)
          .where({ Email: req.data.Email, TeacherID: { '!=': req.data.TeacherID } });
      const existingEmail1 = await SELECT.one.from(Student)
          .where({ Email: req.data.Email })  //, TeacherID: { '!=': req.data.TeacherID } });
      if (existingEmail || existingEmail1) {
          req.error(409, `Email ${req.data.Email} already exists with ID '${existingEmail.TeacherID}'.`);
      }
    }

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
 const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10}$/;  // Regular expression to match exactly 10 digits
  return phoneRegex.test(phoneNumber);
};

const validateEmail = (email)=> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regular expression to match valid email addresses
  return emailRegex.test(email)
;
}


this.on('READ', Teacher.drafts, async (req, next) => {  
  if(req.data.DOB){
    var age = calculateAge(req.data.DOB);
    if (age.error) {
      // Return an error response if the age is invalid
      return req.reject(400, age.error);
  }
    await cds.update(Teacher.drafts).set({ Age: age.age }).where({ ttuuid: req.data.ttuuid});
  }

  if (req.data.PhoneNumber && !validatePhoneNumber(req.data.PhoneNumber)) {
    req.error(400, 'Phone number must be exactly 10 digits');
    return;
}

if ( req.data.Email && !validateEmail(req.data.Email)) {
    req.error(400, 'Email is not in a valid format.');
    return;
}
return next();
});
this.on('postattach', async (req) => {
  debugger
  console.log("functionImport triggered", req.data);
  return "success";
});


// this.on('READ', Teacher.drafts, async (req, next) => {
//   if (req.data.DOB) {
//       const ageResult = calculateAge(req.data.DOB);

//       if (ageResult.error) {
//           // Return an error response if the age is invalid
//           return req.reject(400, ageResult.error);
//       }

//       // Update the Age if valid
//       await cds.update(Teacher.drafts).set({ Age: ageResult.age }).where({ ttuuid: req.data.ttuuid });
//   }

//   return next();
// });





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

// this.before('READ', Files, async (req) => { 
//   debugger
//   console.log(req.data.url)
//   if(!req.headers.x-forwarded-path.includes('odata/v4/my/')){
//     req.data.url = 'https://f5b5e17atrial-dev15-department-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my'+req.data.url;
//   }
//   console.log(req.data.url);
//   // inputString.includes('odata/v4/my/');
//   console.log(req.headers);
  
// console.log("dddddddddddddddd2")
//  });

});

