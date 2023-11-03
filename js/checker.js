// Modal
let toggleModal = (state = 'close', message = '', title = 'Verified', icon = '') => {
    const verificationModal = document.getElementById('verificationModal');
    document.getElementById('modalMSG').innerHTML = message;
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('icon-div').innerHTML = icon;
    if(state == 'close'){
        verificationModal.classList.remove('flex');
        verificationModal.classList.add('hidden');
    }else{
        verificationModal.classList.remove('hidden');
        verificationModal.classList.add('flex');
    }
}

$('#closeModalBtn').on('click', function() {
    toggleModal();
})

// Build an array of available departments
var availableDepartments = [
    "Computer Science",
    "Computer Engineering",
    "Library Science",
];

// Build an array of available subjects
var availableSubjects = [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Accounting",
    "Government",
    "Commerce",
    "Geography",
    "Literature",
    "Civic Education",
    "Agricultural Science",
    "Computer Studies",
];

// Build an array of available grades
var availableGrades = [
    "A1",
    "B2",
    "B3",
    "C4",
    "C5",
    "C6",
    "D7",
    "E8",
    "F9",
];


let getRequiredData = async (department) => {
    let requirements;
    // Import the requirements.json file into a javascript object
    await fetch('js/requirements.json')
    .then(response => response.json())
    .then(data => {
        requirements = data[department];
    });
    return requirements;
}

// Populate deptartment dropdown
var departmentDropdown = document.getElementById("availableDepts");
let departments = `<option value="">--Select--</option>`;
availableDepartments.forEach(department => {
    departments += `<option value="${department}">${department}</option>`;
});
departmentDropdown.innerHTML = departments;



// get the subject and grade in 8 places
let container = document.getElementById('container');

for (let i = 0; i <= 8; i++) {
    let div = document.createElement('div');
    div.className = "grid grid-cols-2 gap-4";

    let select1 = document.createElement('select');
    select1.id = "availableSubjects" + i;
    select1.className = "subjectSelect bg-white w-full border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:shadow-outline";

    let select2 = document.createElement('select');
    select2.id = "availableGrades" + i;
    select2.className = "gradeSelect bg-white w-full border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:shadow-outline";

    div.appendChild(select1);
    div.appendChild(select2);

    container.appendChild(div);

    // Populate subject dropdown
    // var subjectDropdown = document.getElementById("availableSubjects");
    let subjects = `<option value="">--Select--</option>`;
    availableSubjects.forEach(subject => {
        subjects += `<option value="${subject}">${subject}</option>`;
    });
    select1.innerHTML = subjects;


    // Populate grade dropdown
    // var gradeDropdown = document.getElementById("availableGrades");
    let grades = `<option value="">--Select--</option>`;
    availableGrades.forEach(grade => {
        grades += `<option value="${grade}">${grade}</option>`;
    });
    select2.innerHTML = grades;

}

let container2 = document.getElementById('container2');
for (let i = 9; i <= 17; i++) {
    let div = document.createElement('div');
    div.className = "grid grid-cols-2 gap-4";

    let select1 = document.createElement('select');
    select1.id = "availableSubjects" + i;
    select1.className = "subjectSelect bg-white w-full border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:shadow-outline";

    let select2 = document.createElement('select');
    select2.id = "availableGrades" + i;
    select2.className = "gradeSelect bg-white w-full border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:shadow-outline";

    div.appendChild(select1);
    div.appendChild(select2);

    container2.appendChild(div);

    // Populate subject dropdown
    // var subjectDropdown = document.getElementById("availableSubjects");
    let subjects = `<option value="">--Select--</option>`;
    availableSubjects.forEach(subject => {
        subjects += `<option value="${subject}">${subject}</option>`;
    });
    select1.innerHTML = subjects;

    // Populate grade dropdown
    // var gradeDropdown = document.getElementById("availableGrades");
    let grades = `<option value="">--Select--</option>`;
    availableGrades.forEach(grade => {
        grades += `<option value="${grade}">${grade}</option>`;
    });
    select2.innerHTML = grades;
}


// Declare global variables for selected department, required subjects and grades
var selectedDepartment = '';
var requiredSubjects = [];
var requiredGrades = [];
var MinCredits = 0;
var verifyStatus = {
    reqSubject : [],
    no_credits: 0,
    hasRequiredCourses: false,
    passedAllRequired: false,
};

$('#availableDepts').on('change', async () => {
    selectedDepartment = $('#availableDepts').val();
    if (selectedDepartment != '') {
        let requirements = await getRequiredData(selectedDepartment);
        requiredSubjects = requirements.Subjects;
        requiredGrades = requirements.Grades;
        MinCredits = requirements.MinCredits;
        console.log(requiredSubjects, requiredGrades);
    }else{
        requiredSubjects = [];
        requiredGrades = [];
        MinCredits = 0
        console.log(requiredSubjects, requiredGrades);
    }
})

// Check if Subject Existing on verifiedSubjects
let checkVerifiedSubject = (subject) => {
    let status = false;
    verifyStatus.reqSubject.forEach(verified => {
        if (subject == verified.subject) {
            console.log(subject + " Already exists");
            status = true;
        }
    })
    return status;
}

// Check if all subject and grades are verified successfully
let checkVerified = (verification) => {
    let message, icon;
    if (verification.reqSubject.length >= MinCredits) {
        message = `<strong>Congratulations!</strong> You eligible for admission in the department of ${selectedDepartment}`;
        icon = `<i class="fa fa-check-circle fa-2x text-green-500"></i>`;
    }else{
        message = `<strong>Sorry!</strong> You are not eligible for admission in the department of ${selectedDepartment}`;
        icon = `<i class="fa fa-times-circle fa-2x text-red-500"></i>`;
    }
    // Open Modal
    toggleModal('open', message, icon);
}

// On click of the verify button, loop throug all subject and grade
$('#checkEligibilityButton').on('click', () => {
    let subjects = document.querySelectorAll('.subjectSelect');
    let grades = document.querySelectorAll('.gradeSelect');
    let no_credits = 0;
    if(selectedDepartment !== '' && requiredSubjects.length > 0){
        subjects.forEach((subject, index) => {
                let UserReqCourse = {
                    subject: '',
                    grade: '',
                };
                if (requiredGrades.includes(grades[index].value)) {
                    no_credits++;
                    if(requiredSubjects.includes(subject.value)){
                        UserReqCourse.subject = subject.value;
                        UserReqCourse.grade = grades[index].value;
                        if (checkVerifiedSubject(subject.value) == false) {
                            verifyStatus.reqSubject.push(UserReqCourse);
                        }
                    }
                }
        })
        verifyStatus.no_credits = no_credits;
        checkVerified(verifyStatus);
    }else{
        let icon = `<i class="fa fa-times-circle fa-2x text-red-500"></i>`;
        toggleModal('open', 'Please select a department first', icon);
    }
    
})

// reset form

document.getElementById('refresh').addEventListener('click', () => {
    document.getElementById("eligibilityForm").reset();
})

