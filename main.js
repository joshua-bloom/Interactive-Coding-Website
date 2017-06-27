/***************************************
READ TEXT FILE FROM GITHUB REPO - student database
***************************************/
var TEXT_FILE_URL = "https://raw.githubusercontent.com/jmb2407/MSTU5003-Interactive-Project/master/studentDatabase.txt";

var retrievedDatabaseString = "";

$(document).ready(function() {
    $.get(TEXT_FILE_URL, function(data) {
        var retrievedDatabaseString = data;
        // var retrievedDatabaseObject = $(data);     if you wanted to select an HTML page instead
        console.log(retrievedDatabaseString);
        var arrayOfLines = retrievedDatabaseString.split("\n");     // split string by line
        console.log(arrayOfLines);
        document.getElementById("classResults").innerText = retrievedDatabaseString;
    });
});


/***************************************
Support Resources Navbar - popover()
***************************************/

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    ({
        html: true,
        placement: "top",
        trigger: "hover", 
        viewport: ".container"
    });
});

/***************************************
Student Data - Arrays and Objects
***************************************/

var student = {
    name: "",
    email: "",
    date: "",
    acceptTerms: false,
    submitted: false,
    completion: "0%",
    userScore: 0,
    possibleScore: 0
};

// each answer is an object with three properties (question, answer, hint)
// each student object is assigned the "responses" property which is given the value of an empty array
// as students answer questions, objects are created and pushed to the array (updating student.responses after each question)
// then add each student object to the whole class array (global variable, updated when students hit "submit" button) 

/*****************************************************
Test Problems Data - array storing 'question' objects

- each problem is saved as an object with 5 properties (question number, question text, answer, hint, and (eventually) user's answer)
- each student object is assigned the "answerUser" property which is given the value of an empty array
- as students answer questions, objects are created and pushed to the array (updating student.answerUser after each question)
*****************************************************/

var problems = [                                        // initialize array
    {                                                   // store question number, text, answer, hint, and (eventually) user's answer
        number: "1",
        question: "Change the OL tags to UL tags in the HTML code. What happens when you do that?", 
        answerKey: ["Option 0", "The numbered list will become a bulletted, ordered list."],
        hint: false,
        answerUser: []
    },
    {
        number: "2",
        question: "Make a new list of the top 3 things cats love and copy-paste your html code here.", 
        answerKey: ["Option 0", "Use an ordered list for the TOP 3 THINGS cats love."],
        hint: false,
        answerUser: []
    }, 
    {
        number: "3",
        question: "Delete the closing H3 tag in the 'intro' section. What happens when you do that?<br>Select the answer that most accurately describes the change in output.", 
        answerKey: ["Option 1", "The text in the 'intro' section changes from normal to bold font."],
        hint: false,
        answerUser: []
    },
    {
        number: "4",
        question: "Change the value of the text-decoration attribute for the h4, h5, and h6 elements from underline to none. What happens when you do that? Select best answer from the dropdown menu.", 
        answerKey: ["Option 4", "Both the 'Grumpy Cat' text and the 'Nyan Cat' text are no longer underlined."],
        hint: false,
        answerUser: []
    },
    {
        number: "5",
        question: "Add another CSS styling rule to the h1, h2, h3, h4, h5, and h6 elements. Right below font-weight: bold; you should type font-style: oblique; What happens when you add this styling rule? Select all that apply by holding down the command/option key.", 
        answerKey: [["Option 2", "The 'Top 3 things cats hate' list becomes italicized."], ["Option 3", "The section titles, 'Introduction to Cats' and 'Cats Opinions' become italicized."]],
        hint: false,
        answerUser: []
    }, 
    {
        number: "6",
        question: "How would you change the color of the title, Meow meow meow meow? Copy-paste your CSS code here.", 
        answerKey: ["Option 0", "#title { color: blue;}"], 
        hint: false,
        answerUser: []
    }
];

function changeAnswerToString(arrayAnswer) {
    var stringAnswer = "";
    if (typeof(arrayAnswer[0]) === "string" && arrayAnswer.length === 2) {         // instances where answerUser = [string, string] (problems 1-4 and 6)
        if (arrayAnswer[0] === "Option 0") {
            stringAnswer += arrayAnswer[1];
        }                                                                          
        else {
            stringAnswer += arrayAnswer[0] + ": " + arrayAnswer[1];
        }
    }
    else {                                     // instances where answerUser = [ [string, string] , [string, string] ] (problem 5)
        for (choice of arrayAnswer) {
            stringAnswer += choice[0] + ": " + choice[1] + "  ";
        }
    }
    return stringAnswer;
}

function formatRadioButtonVal(optionOld) {
    var newOption = "";
    var counter = 0;
    for (char of optionOld) {
        if (counter < 1) {
            newOption += char.toUpperCase();                                        // change first letter lowercase "o" to capital "O"
        }
        else if (counter === (optionOld.length - 1)) {                              // add blank space between "option" and number at end of string
            newOption += " " + char;
        }
        else {                                                                      // otherwise use whatever character was there before
            newOption += char;
        }
        counter += 1
    }
    return newOption;
}

function compareTwoArrays(array1, array2) {
    if (array1 === array2) {                        // quick preliminary check
        return true;
    }    
    if (array1 == null || array2 == null) {         // quick preliminary check
        return false;
    }
    if (array1.length !== array2.length) {          // quick preliminary check
        return false;
    }
    
    for (var i = 0; i < array1.length; ++i) {       // now search array item by item
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;                                    // return TRUE if could not find any differences
}

function evaluateUserAnswer(problem) {
    var scoreString = "";
    var countCorrect = 0;
    var identicalArrays = false;
    var userAnswer = problem.answerUser;
    var correctAnswer = problem.answerKey;
    
    if (correctAnswer[0] === "Option 0") {          // written responses will be reviewed/scored separately
        return "Mr. Bloom will grade written responses separately.";
    }
    
    if (typeof(userAnswer[0]) === 'object') {      // must be a select-multiple question
        for (var i = 0; i < userAnswer.length; i++) {
            for (var j = 0; j < correctAnswer.length; j++) {
                identicalArrays = compareTwoArrays(correctAnswer[j], userAnswer[i]);
                if (identicalArrays === true) {
                    countCorrect += 1;
                }
            }
        }
    }
    else {
        identicalArrays = compareTwoArrays(correctAnswer, userAnswer);
        if (identicalArrays === true) {
            countCorrect = 1;
        }
    }
    
    student.userScore += countCorrect;
    
    if (countCorrect === correctAnswer.length) {
        scoreString += "correct " + String(countCorrect) + "/" + String(correctAnswer.length) + " points";
        student.possibleScore += correctAnswer.length;
    }
    else if (typeof(correctAnswer[0]) !== 'object') {
        if (countCorrect === 1 && correctAnswer.length === 2) {
            scoreString += "correct " + String(countCorrect) + "/1 points";
        }
        else {
            scoreString += "incorrect 0/1 points";
        }
        student.possibleScore += 1;
    }
    else {
        scoreString += "incorrect " + String(countCorrect) + "/" + String(correctAnswer.length) + " points";
        student.possibleScore += correctAnswer.length;
    }
    return scoreString;
}


function saveText() {                                       // source: https://gist.github.com/liabru/11263260
    var text = document.querySelector('#print').innerHTML;
    var blob = new Blob([text], { type: 'text/plain' });
    var anchor = document.createElement('a');
    anchor.download = "studentDatabase.html";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
}

/******************************************************
Display User Submission - create new window + HTML tags 
******************************************************/
function displayAnswers() {
    var DispWin = window.open('','NewWin', 'toolbar=no, status=no, width=1050, height=880');
    var message = "";
    
    // HTML HEADER
    message += "<head><title>Mr. Bloom's Computer Science Class</title>";
    message += "<link type='text/css' rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>";
    message += "<link type='text/css' rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>";
    message += "<link type='text/css' rel='stylesheet' href='styles/studentStyle.css'/>";
    message += "<script language='JavaScript' type='text/javascript' src='//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'>";
    message += "</script><script language='JavaScript' type='text/javascript' src='https://code.jquery.com/jquery-3.2.1.js'></script>";
    message += "<script language='JavaScript' type='text/javascript' src='main.js'></script>";
    message += "</head>";

    // HTML BODY
    message += "<body id='results'>" + "<div class='container-fluid'>" + "<div class='container-top'>" + "<div class='page-header'>";  // TOP CONTAINER
    message += "<h1 id='title'>Introduction to HTML and CSS</h1><h3 id='subtitle'>Web-Development, Fall 2017</h3></div>" + "</div>";
    message += "<div class='container-main'>" + "<section id='results-window'>" + "<div class='row'>" + "<div class='col-xs-12'>";
    message += "<h3>Thank you for completing this assignment. Please " + "<input type=button name=print value='save' onClick='saveText()'>";
    message += " this receipt for your records.</h3></div></div>";
    message += "<section id='print'><hr><div class='row'>" + "<div class='col-xs-12'>" + "<h2>Student Info</h2></div></div>"; 
    message += "<div class='row'>" + "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Name:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.name + "</h3></div></div></div>";
    message += "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Email:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.email + "</h3></div></div></div>";
    message += "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Date:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.date + "</h3></div></div></div></div>";
    message += "<hr><div class='row'>" + "<div class='col-xs-12'><h2>" + document.querySelector("#lesson-title").innerText +"</h2></div></div><br>";
    
    var answerUserString = "INCOMPLETE";
    var answerKeyString = "INCOMPLETE";
    
    for (problem of problems) {
        if (typeof(problem.answerUser) !== "string") {
            answerUserString = changeAnswerToString(problem.answerUser);
        }
        if (typeof(problem.answerKey) !== "string") {
            answerKeyString = changeAnswerToString(problem.answerKey);
        }
        
        var problemScoreString = evaluateUserAnswer(problem);
        
        message += "<br>";      // add spacing between problems
        message += "<div class='row'>" + "<div class='col-xs-2'>" + "<b>Question " + problem.number + "</b></div>";
        message += "<div class='col-xs-1'>" + "<i class='fa fa-lg fa-question-circle pull-right' aria-hidden='true'></i></div>";
        message += "<div class='col-xs-9'>" + problem.question + "</div></div><hr>";
        message += "<div class='row'>" + "<div class='col-xs-2'>" + "<b>Your Answer</b></div>";
        
        // IF user is neither correct or incorrect bec/ it's a Written Response problem, italicize unscored field
        if (problemScoreString.includes("incorrect") === false && problemScoreString.includes("correct") === false) {
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-pencil-square pull-right' aria-hidden='true'></i></div>";
            message += "<div class='col-xs-9'>" + answerUserString + "</div></div><hr>";
            message += "<div class='row'><div class='col-xs-2'>" + "<b>Correct Answer</b></div>";
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-info-circle pull-right' aria-hidden='true'></i></div>";
            message += "<div class='col-xs-9'>" + answerKeyString + "</div></div><hr>";
        }
        else {
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-list-ul pull-right' aria-hidden='true'></i></div>";
            var locateSplit = answerUserString.indexOf(".  Option");
            if (locateSplit !== -1) {
                var string1 = answerUserString.slice(0, locateSplit+1);
                var string2 = answerUserString.slice(locateSplit+2, answerUserString.length - 1);
                message += "<div class='col-xs-8'>" + string1 + "<br>" + string2 + "</div><div class='col-xs-1'>";
            }
            else {
                message += "<div class='col-xs-8'>" + answerUserString + "</div><div class='col-xs-1'>";   
            }
            
            var locatePoints = problemScoreString.indexOf("/");
            var numRight = problemScoreString[locatePoints - 1];
            var numTotal = problemScoreString[locatePoints + 1];
            var numWrong = (numTotal - numRight);
            
            for (i = 0; i < numRight; i++) {
                message += "<i class='fa fa-lg fa-check-square-o pull-right' aria-hidden='true'></i><br>";
            }
            for (i = 0; i < numWrong; i++) {
                message += "<i class='fa fa-lg fa-square-o pull-right' aria-hidden='true'></i><br>";
            }
            message += "</div></div><hr>";
            
            if (problemScoreString.includes("incorrect") === true) {          // IF user is incorrect, display "Correct Answer" field so they can see what they did wrong
                message += "<div class='row'><div class='col-xs-2'>" + "<b>Correct Answer</b></div>";
                message += "<div class='col-xs-1'><i class='fa fa-lg fa-info-circle pull-right' aria-hidden='true'></i></div>";
                
                var locateSplitKey = answerKeyString.indexOf(".  Option");
                if (locateSplitKey !== -1) {
                    var string3 = answerKeyString.slice(0, locateSplitKey+1);
                    var string4 = answerKeyString.slice(locateSplitKey+2, answerKeyString.length - 1);
                    message += "<div class='col-xs-9'>" + string3 + "<br>" + string4 + "</div>";
                }
                else {
                    message += "<div class='col-xs-9'>" + answerKeyString + "</div>";
                }
                message += "</div><hr>";
            }
        }
    }
    
    // Display student's total score on multiple-choice problems
    message += "<br><div class='row'><div class='col-xs-2'>" + "<b>Total Score</b></div>";
    message += "<div class='col-xs-1'><b class='pull-right'>" + student.userScore + " / " + student.possibleScore + "</b></div>";
    message += "<div class='col-xs-9'>on multiple-choice problems</div></div>";
    message += "<br><div class='row'><div class='col-xs-2'>" + "<b>Comments</b></div>";
    message += "<div class='col-xs-1'><i class='fa fa-lg fa-comments pull-right' aria-hidden='true'></i></div></div>";
    message += "<hr><br></section>";
    
    message += "</section>" + "</div>" + "</div>" + "</body>";
    
    DispWin.document.write(message);

}

/***************************************************
Update Database - save user answer
***************************************************/
function updateData(response) {
    var allAnswers = [];
    if ( typeof(response[0]) === 'object' ) {                               // must be a select-multiple question
        for (question of problems) {                                        // search database for matching question number
            if (question.number === response[0][0]) {
                for (selected of response) {                                // loop over all selected responses
                    var userChoice = selected[1];
                    var choiceText = selected[2];
                    var tmpAnswer = [userChoice, choiceText];   
                    allAnswers.push(tmpAnswer);                              // add each answer to an array
                    console.dir(allAnswers)
                }
                question.answerUser = allAnswers;                            // after all answers added to array, update database
                return true;                                                 // return "true" bec/ update was successfull
            }
        }
        return false;                                                        // return false bec/ update was unsuccessfull
    }
    else {
        var questionNum = response[0];
        var userChoice = response[1];
        var choiceText = response[2];
        for (question of problems) {
            if (question.number === response[0]) {
                question.answerUser = [userChoice, choiceText];
                return true;
            }
        }
        return false;
    }
}

/*****************************
Retrieve Answer from Webpage
*****************************/
function getAnswer(event) {                        
    var inputType = event.target.type;                                  // need to know type of input (text, multiple-choice)...
    var question, option, value;                                        // ...so can format user response accordingly
    var userAnswer = [];
                                                                        // get user answer from Event properties...
    if (inputType === "text" || inputType === "textarea") {             // ...and format their response for database entry
        question = event.target.id;
        question = question.slice(-1);                                  
        option = "Option 0";                                             // no options because not a multiple-choice problem
        value = event.target.value;
        userAnswer = [question, option, value];                         
    }
    else if (inputType === "radio") {                                   // multiple choice
        question = event.target.id;
        question = question.slice(-1);                                  // question number
        option = formatRadioButtonVal(event.target.value);              // get user selection = "option3" or "option1" right now, but needs a space + a capital
        value = event.target.parentElement.innerText;                   // get text associated with selection
        userAnswer = [question, option, value];                         // format user answer
    }
    else if (inputType === "select-one") {                              // get and format response for drop-down menu choice
        question = event.target.id;
        question = question.slice(-1);                                  
        option = "Option " + (event.target.selectedIndex + 1);
        value = event.target.value;
        userAnswer = [question, option, value];
    }
    else if (inputType === "select-multiple") {                         // get and format response for multiple selected response 
        var answers = [];
        for (i = 0; i < event.target.length; i++) {
            if (event.target.children[i].selected === true) {
                question = event.target.id;
                question = question.slice(-1);                         
                option = "Option " + (i+1);
                value = event.target.children[i].value;
                var tmpAnswer = [question, option, value];             
                answers.push(tmpAnswer);
            }
        }
        userAnswer = answers;
    }
    else {
        console.log("input type is not recognized");
    }
    
    return userAnswer;
}
        
 function numAnswers() {
    var numIncomplete = 0;
    var numTotal = problems.length;
     
    for (question of problems) {
        if (question.answerUser.length === 0 || question.answerUser[1] === "") {         // keep track of unanswered questions
            numIncomplete++;
        }
    }
    var completed = (numTotal - numIncomplete);
    return completed;
}

function setAnswer(event) {                                             // delegate tasks to helper functions
    var userAnswer = getAnswer(event);                                  // first, get the answer from the Event object and format it
    var updated = updateData(userAnswer);                               // then search database for corresponding question and update answerUser
    
    var numCompleted = numAnswers();
    if (numCompleted === 0) {                                           // disable reset button bec/ user hasn't completed any questions yet
        changeResetButton("disable");
    }
    else {
        changeResetButton("enable");
    }

    if (updated === true) {
        console.log("database update succeeded, user answer recorded");
    }
    else {
        console.log("user answer not recorded :/ ")
    }
    console.dir(problems);
}

function setName() {
    student.name = document.querySelector('#InputName').value;
}

function setEmail() {
    student.email = document.querySelector('#InputEmail').value;
}

function setDate() {
    student.date = document.querySelector('#InputDate').value;
}

function setTerms() {
    student.acceptTerms = document.querySelector('#InputCheckbox').checked;
}


function changeSubmitButton(status) {
    if (status === "enable") {
        document.querySelector('#submitButton').disabled = false;                   // enable submit button
        document.querySelector('#submitButton').classList.remove('btn-success');    
        document.querySelector('#submitButton').classList.add('btn-primary');       // make it green to indicate successfull submit 
    }
    else if (status === "disable") {
        document.querySelector('#submitButton').disabled = true;                    // disable submit button
        document.querySelector('#submitButton').classList.remove('btn-primary');    
        document.querySelector('#submitButton').classList.add('btn-success');       // make it green to indicate successfull submit   
    }
}

function changeResetButton(status) {
    if (status === "enable") {
        document.querySelector('#resetButton').disabled = false;                   // enable submit button
    }
    else if (status === "disable") {
        document.querySelector('#resetButton').disabled = true;                    // disable submit button
    }
}

function verifyStudentInfo() {
    if (student.name === "") {
        return alert("Whoops, looks like you forgot to enter your name!");
    }
    else if (student.email === "") {
        return alert("Whoops, looks like you forgot to enter your email address!");
    }
    else if (student.date === "") {
        return alert("Whoops, looks like you forgot to enter today's date!");
    }
    else if (student.acceptTerms === false) {
        return alert("Check the box below to certify that the above answers are your own work.");
    }
    else {
        student.submitted = true;
        return;
    }
}


function verifyStudentAnswers() {
    var noAnswer = "";
    var numComplete = 0;
    var numTotal = problems.length;
    
    for (question of problems) {
        if (question.answerUser.length === 0) {         // keep track of unanswered questions
            noAnswer += (question.number + " ");
        }
        else {                                          // count number of answered questions
            numComplete += 1;
        }
    }                                                   // calculate test completion percentage and round to 2 decimal places
    student.completion = String((numComplete / numTotal * 100).toFixed(2) + "%");   
    
    if (numComplete < numTotal) {
        return alert("You've only completed " + student.completion + " of the problems. You have not answered question(s) : " + noAnswer + ".");
    }
    return;
}


function submitResponses(event) {
    verifyStudentInfo();                                                    // check student info (name, email, date, terms) before submitting
    verifyStudentAnswers();                                                 // check student answer completion percentage before submitting
    
    if (student.submitted === false || student.completion !== "100.00%") { 
        return;                                                             // return without submitting student's responses
    }
    else {
        event.preventDefault();
        displayAnswers();
        changeSubmitButton("disable");
        // email user
    }
}


function resetDatabases() {
    student.name = "";                                                      // reset all student Object properties
    student.email = "";
    student.date = "";
    student.acceptTerms = false;
    student.submitted = false;
    student.completion = "0%";
    student.userScore = 0;
    student.possibleScore = 0;
    
    for (question of problems) {                                            // reset answerUser property in problems database
        question.answerUser = [];
    }
}

function resetHTMLInputFields() {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        console.dir(inputs[i]);
        inputs[i].value = "";                                               // clears text input fields (single line)
        if (inputs[i].type === "checkbox") {
            inputs[i].checked = false;                                      // clears the "certify answers" checkbox
        }
    }
    
    var textareas = document.getElementsByTagName('textarea');
    for (i = 0; i < textareas.length; i++) {
        textareas[i].value = "";                                            // clears textarea fields (multiple lines)
    }
    
    var multipleChoice = document.getElementsByTagName('select');
    for (i = 0; i < multipleChoice.length; i++) {
        multipleChoice[i].value = "";                                       // clears select fields (multiple choice)
    }
    
    var radios = document.getElementsByName('Question3Radios');
    for (i = 0; i < radios.length; i++) {
        radios[i].checked = false;                                          // clears radio select fields (multiple choice)
    }
}

function resetResponses(event) {
    
    resetDatabases();                                                       // student database and problems database (only answerUser prop though)
    resetHTMLInputFields();
    changeSubmitButton("enable");                                           // enable submit button, change color back to blue
    changeResetButton("disable");                                           // disable submit button now that all info has been erased
}