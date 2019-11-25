/*TODO reservation fixes for in the past/not reservable yet*/
let allAccounts = [];
let currentAccount = {id: 0, name: ""};
let allClasses = [];
let currentClasses = [];
let allInstructors = [];
let instructorFilter = '';
let allLocations = [];
let locationFilter = 0;
let date = new moment();
let baseUrl = getBaseUrl();
let memberLogin = false;
let memberID = '';
let selectedClass = undefined;

function onReservationClick(e){
    e.preventDefault();
    selectedClass = this;
    $('#cancelSubmit')[0].addEventListener('click', cancelModals);
    if(!memberLogin) {
        $('#login-modal').modal('show');
        $('#loginSubmit')[0].addEventListener('click', HandleReservationClick);
    }
    else{
        ShowReservationModal();
    }
}

function cancelModals(){
    $('.modal').modal('hide');
}

/**
 * API FUNCTIONS
 */
/**
 * Gets the list of accounts to show in the drop-down.
 *
 * @constructor
 */
function GetAccountList(){
    $.post(baseUrl + "/mobile/api/getAccountList.php", function (data) {
        allAccounts = JSON.parse(data);
        loadSelectData(allAccounts, 'account', 'Select an Account', changeAccountFilter, currentAccount.id);
        alert('Please select an account to see listing of classes.');
    });
}

/**
 * Gets all of the schedule data for the current day.
 *
 * @constructor
 */
function GetDataForAccount(){
    if(currentAccount.id !== 0) {
        $.post(baseUrl + "/mobile/api/getAllClasses.php?account_id="+currentAccount.id+'&date='+date.format("MM/DD/YYYY"), function (data) {
            data = JSON.parse(data);
            allClasses = data.classes;
            allInstructors = data.instructors;
            allLocations = data.locations;
            loadSelectData(allLocations, 'location', 'Select a location', changeLocationFilter, locationFilter);
            loadSelectData(allInstructors, 'instructor', 'Select an instructor', changeInstructorFilter, instructorFilter);
            FilterData();
        });
    }
}

/**
 * ONCHANGE FUNCTIONS
 */
/**
 * Changes the date to be the previous day
 */
function prevDate(e){
    date.subtract(1, 'days');
    GetDataForAccount();
}

/**
 * Changes the date to be the next day.
 */
function nextDate(e){
    date.add(1, 'days');
    GetDataForAccount();
}

/**
 * OnChange event handler for the instructor filter, updates instructor fitler variable
 *
 * @param e
 */
function changeInstructorFilter(e){
    instructorFilter = parseInt(e.target.value);
    FilterData();
}

/**
 * OnChange event handler for the location filter, updates location filter variable.
 *
 * @param e
 */
function changeLocationFilter(e){
    locationFilter = parseInt(e.target.value);
    FilterData();
}

/**
 * Changes the account filter.
 *
 * @param e
 */
function changeAccountFilter(e){
    currentAccount = parseInt(e.target.value);
    instructorFilter = 0;
    locationFilter = 0;
    for(var i=0; i<allAccounts.length; i++){
        if(allAccounts[i].id == currentAccount){
            currentAccount = allAccounts[i];
            i = allAccounts.length;
        }
    }
    GetDataForAccount();
}

/**
 * FILTER FUNCTIONS
 */
/**
 * Filters the data by options set by user.
 *
 * @constructor
 */
function FilterData(){
    currentClasses = FilterByLocation(allClasses);
    currentClasses = FilterByInstructor(currentClasses);
    DisplayData();
}

/**
 * Filters given array to only include classes that have the selected location.
 *
 * @param existingClasses
 * @returns {[]|*}
 * @constructor
 */
function FilterByLocation(existingClasses){
    if(locationFilter !== "" && locationFilter !== 0){
        let classes = [];
        for(var i = 0; i<existingClasses.length; i++){
            if(parseInt(existingClasses[i].location.id) === parseInt(locationFilter)){
                classes.push(existingClasses[i]);
            }
        }
        return classes;
    }
    return existingClasses;
}

/**
 * Filters given array to only include classes that have the selected instructor.
 *
 * @param existingClasses
 * @returns {[]|*}
 * @constructor
 */
function FilterByInstructor(existingClasses){
    if(instructorFilter !== "" && instructorFilter !== 0){
        let classes = [];
        for(var i = 0; i<existingClasses.length; i++){
            if(parseInt(existingClasses[i].instructor.id) === parseInt(instructorFilter)){
                classes.push(existingClasses[i]);
            }
        }
        return classes;
    }
    return existingClasses;
}

/**
 * UI FUNCTIONS
 */
/**
 * Creates select element for the given parameters with the current option selected.
 *
 * @param dataArray
 * @param elementName
 * @param defaultOption
 * @param onChangeFunction
 * @param currentValue
 */
function loadSelectData(dataArray, elementName, defaultOption, onChangeFunction, currentValue="0"){
    let selectElement = document.createElement("select");
    selectElement.onchange = function(e){onChangeFunction(e)};
    selectElement.id = elementName;
    let initialOption = document.createElement("option");
    initialOption.value = "0";
    initialOption.append(defaultOption);
    initialOption.disabled = (elementName === "account");
    selectElement.append(initialOption);
    if(dataArray.length !== 0){
        for(let i = 0; i<dataArray.length; i++){
            let option = document.createElement("option");
            option.value = dataArray[i].id;
            option.append(dataArray[i].name);
            selectElement.append(option);
        }
    }
    selectElement.value = currentValue;
    document.getElementById(elementName).replaceWith(selectElement);
}

/**
 * Displays all of the filtered data for the schedule tab of mobile app.
 *
 * @constructor
 */
function DisplayData(){
    document.getElementById("currentDate").innerHTML = date.format("MMMM Do, YYYY");
    let parentElement = document.getElementById("ajaxLoader");
    parentElement.innerHTML = "";
    let newLine = document.createElement("br");
    let table = document.createElement("table");
    table.className = "ClassTable";
    for(var i = 0; i<currentClasses.length; i++){
        table.append(GetScheduleRow(currentClasses[i], newLine));
    }
    parentElement.append(table);
}

/**
 * Gets a single row, for a single class to display.
 *
 * @param currentClass
 * @param newLine
 * @returns {HTMLTableRowElement}
 * @constructor
 */
function GetScheduleRow(currentClass, newLine){
    let newClass = document.createElement("tr");
    newClass.className = "ClassRow table table-striped table-bordered";
    newClass = getClassDetails(newClass, currentClass);
    newClass = getReservationIcon(newClass, currentClass);
    return newClass;
}

/**
 * Gets all of the class details
 *
 * @param newClass
 * @param currentClass
 * @returns {*}
 */
function getClassDetails(newClass, currentClass){
    let tableElement = document.createElement("td");
    tableElement = getDate(tableElement, currentClass);
    tableElement = GetAccountInfo(tableElement);
    tableElement = GetClassName(tableElement, currentClass);
    tableElement = GetInstructorName(tableElement, currentClass);
    tableElement = GetTimeRange(tableElement, currentClass);
    tableElement = GetLocation(tableElement, currentClass);
    newClass.append(tableElement);
    return newClass;
}

/**
 * Gets the reservation icon for display.
 *
 * @param newClass
 * @param currentClass
 * @returns {*}
 */
//todo add onclick event for this.
function getReservationIcon(newClass, currentClass){
    let tableElement = document.createElement("td");
    tableElement.className = " reservationIcon ";
    if(currentClass.canReserve){
        let aElement = document.createElement('a');
        aElement.setAttribute('data-name', currentClass.name);
        aElement.setAttribute('data-time', currentClass.startTime+' - '+currentClass.endTime);
        //todo format the 1 below
        aElement.setAttribute('data-display-date', currentClass.date+' '+currentClass.startTime);
        aElement.setAttribute('data-account-id', currentAccount.id);
        aElement.setAttribute('data-can-reserve', currentClass.canReserve);
        aElement.setAttribute('data-can-waitlist', currentClass.canAddToWaitlist);
        aElement.setAttribute('data-unique-id', currentClass.id);
        aElement.setAttribute("href", baseUrl + "/gxp/api/daxko/classes/");
        aElement.addEventListener('click', onReservationClick);
        //aElement.onclick(onReservationClick());
        let iElement = document.createElement('i');
        iElement.className = "glyphicon glyphicon-plus";
        aElement.append(iElement);
        tableElement.append(aElement);
    }
    newClass.append(tableElement);
    return newClass;
}

/**
 * Gets the date element to display for a class.
 *
 * @param tableElement
 * @returns {*}
 */
function getDate(tableElement, currentClass){
    let classP = document.createElement("b");
    classP.append(currentClass.date);
    tableElement.append(classP);
    return tableElement;
}

/**
 * Gets the name of account (i.e. GXP Health Clubs) that the schedule is for.
 *
 * @param tableElement
 * @returns {*}
 * @constructor
 */
function GetAccountInfo(tableElement){
    let classP = document.createElement("h4");
    let bold = document.createElement("b");
    bold.append(currentAccount.name);
    classP.append(bold);
    tableElement.append(classP);
    return tableElement;
}

/**
 * Gets the name of the class.
 *
 * @param tableElement
 * @param currentClass
 * @returns {*}
 * @constructor
 */
function GetClassName(tableElement, currentClass){
    let classP = document.createElement("h4");
    let bold = document.createElement("b");
    bold.append(currentClass.name);
    classP.append(bold);
    tableElement.append(classP);
    return tableElement;
}

/**
 * Gets the name of the instructor teaching the class.
 *
 * @param tableElement
 * @param currentClass
 * @returns {*}
 * @constructor
 */
function GetInstructorName(tableElement, currentClass){
    let instructorP = document.createElement("p");
    var instructorName = currentClass.instructor.name;
    var extraInstructorText = '';
    if(currentClass.hasSub){
        extraInstructorText = ' for '+instructorName;
        instructorName = currentClass.subInstructor.name;
    }
    instructorP.append(instructorName+" is teaching this class"+extraInstructorText);
    instructorP.fontStyle = 'italic';
    tableElement.append(instructorP);
    return tableElement;
}

/**
 * Gets the element time range for the class.
 *
 * @param tableElement
 * @param currentClass
 * @returns {*}
 * @constructor
 */
function GetTimeRange(tableElement, currentClass){
    let instructorP = document.createElement("p");
    instructorP.append(currentClass.startTime+" - "+currentClass.endTime);
    tableElement.append(instructorP);

    return tableElement;
}

/**
 * Gets the element to display the location of the class
 *
 * @param tableElement
 * @param currentClass
 * @returns {*}
 * @constructor
 */
function GetLocation(tableElement, currentClass){
    let instructorP = document.createElement("p");
    instructorP.append("Location: "+currentClass.location.name);
    tableElement.append(instructorP);
    return tableElement;
}

/**
 * OTHER FUNCTIONS
 */
/**
 * Hides reservation tab, and shows schedule tab
 */
function goToSchedule(){
    disableTabs();
    document.getElementById('schedule').style.display = "block";

}

/**
 * Hides schedule tab and shows reservation tab
 */
function goToReservations(){
    disableTabs();
    document.getElementById('reservations').style.display = "block";
}

/**
 * Hides content for all tabs
 */
function disableTabs(){
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
}

/* Gets the BaseUrl according to values in 'env.json' and 'config.json'.
 * The 'env.json' file is used for Cordova to write the desired environment name.
 * Users may also manually edit the 'env.json' file for local testing.
 * The 'config.json' file stores the base url's for all environments, and the
 * selection is chosen according to the value found in 'env.json'.
 */
function getBaseUrl() {
    let request = new XMLHttpRequest();
    // Parse JSON and get environment name from 'env.json' file
    // Note - 'env.json' file is auto-generated by Cordova build process
    request.open('GET', './config/env.json', false);
    request.send(null);
    let env = JSON.parse(request.responseText)["env"];
    if (env === undefined || env === null) {
        return String.empty;
    }
    // Parse JSON and get baseUrl according to environment name
    request.open('GET', './config/config.json', false);
    request.send(null);
    let json = JSON.parse(request.responseText);
    if (json === undefined || json === null) {
        return String.empty;
    }

    // Get the URL based on the provided 'env' key
    let url = String();
    try {
        url = json[env]["baseUrl"];
    } catch (err) {
        return String.empty;
    }

    if (url === undefined || url === null) {
        return String.empty;
    }
    return url;
}

function getClientSecret() {
    let request = new XMLHttpRequest();
    // Parse JSON and get environment name from 'env.json' file
    // Note - 'env.json' file is auto-generated by Cordova build process
    request.open('GET', './config/clientSecret.json', false);
    request.send(null);

    let json = JSON.parse(request.responseText);
    if (json === undefined || json === null) {
        return String.empty;
    }

    // Get the URL based on the provided 'env' key
    let url = String();
    try {
        url = json["secret"];
    } catch (err) {
        return String.empty;
    }

    if (url === undefined || url === null) {
        return String.empty;
    }
    return url;
}

function ShowReservationModal(){
    $('#reservation-modal').modal('show');
    $('#reservation-class-name')[0].innerHTML = selectedClass.getAttribute('data-name');
    $('#reservation-class-date')[0].innerHTML = selectedClass.getAttribute('data-display-date')
    $('#reservation-class-time')[0].innerHTML = selectedClass.getAttribute('data-time');
    $('#reservation-unique-id')[0].innerHTML = selectedClass.getAttribute('data-unique-id');
    $('#reservation-account-id')[0].innerHTML = currentAccount.id;
    $('#reserveSpot')[0].addEventListener('click', reserveSpot);
    $('#addToWaitlist')[0].addEventListener('click', addToWaitlist);
    if(selectedClass.getAttribute('data-can-reserve')){
        $('#reserveSpot')[0].style.display = "flex";
        $('#addToWaitlist')[0].style.display = "none";
    }
    else if(selectedClass.getAttribute('data-can-waitlist')){
        $('#reserveSpot')[0].style.display = "none";
        $('#addToWaitlist')[0].style.display = "flex";
    }
    else{
        $('#reserveSpot')[0].style.display = "none";
        $('#addToWaitlist')[0].style.display = "none";
    }
}

/**
 * Functions from GroupExPro for handling pop-up
 */
function HandleReservationClick(e) {
    e.preventDefault();
    let daxkoAPIClientSecret = getClientSecret();
    let memberEmail = $('#email').val();
    let password = $('#password').val();
    let postData = {'memberEmail': memberEmail, 'password': password, 'X_CLIENT_ID': '36', 'X_CLIENT_SECRET': daxkoAPIClientSecret};
    $.ajax({
        type: 'POST',
        url: getBaseUrl()+'/gxp/api/daxko/memberLogin?XDEBUG_SESSION_START=PHPSTORM',
        data: postData,
        async: false,
        dataType: 'json',
        success: function(data) {
            // $('.modal').modal('hide');
            if (data.success == true) {
                memberLogin = true;
                memberID = data.attendeeId;
                $('#login-modal').modal('hide');
                ShowReservationModal();
            } else {
                $('#loginError').show();
                $('#loginError').text("Please enter valid credentials.");
                $('#login-modal').modal('show');
            }

        },
        error: function (result){
            $('#loginError').show();
            $('#loginError').text("Failed to login.");
            $('#login-modal').modal('show');
        }
    })
}

function reserveSpot() {
    myThis = $(this);
    //let uniqueID = $('#reservation-unique-id').val()
    let uniqueID = selectedClass.getAttribute('data-unique-id');
    //let accountID = $('#reservation-account-id').val();
    let accountID = currentAccount.id;
    let currentDate = selectedClass.getAttribute('data-display-date').split(' ')[0];
    let temp = currentDate.split('/');
    if(temp.length>1) {
        uniqueID = uniqueID + temp[0] + temp[1] + temp[2].substr(2);
    }
    let daxkoAPIClientSecret = getClientSecret();
    $.ajax({
        type: 'POST',
        url: getBaseUrl()+ '/gxp/api/daxko/classes/' + uniqueID + '/' + memberID + '/reserve?XDEBUG_SESSION_START=PHPSTORM',
        headers: {'X-CLIENT-ID': accountID, 'X-CLIENT-SECRET': daxkoAPIClientSecret, 'content-type': 'application/json'},
        async: false,
        success: function (data) {
            if (data.id) {
                $('.modal').modal('hide');
                alert("Spot reserved.");
            } else {
                alert("Failed to reserve a spot.");
            }

        },
        error: function (result) {
            alert("Failed to reserve a spot.");
        }
    })
}

function addToWaitlist() {
    myThis = $(this);

    let uniqueID = selectedClass.getAttribute('data-unique-id');
    //let accountID = $('#reservation-account-id').val();
    let accountID = currentAccount.id;
    let currentDate = selectedClass.getAttribute('data-display-date').split(' ')[0];
    let temp = currentDate.split('/');
    if(temp.length>1) {
        uniqueID = uniqueID + temp[0] + temp[1] + temp[2].substr(2);
    }
    let daxkoAPIClientSecret = getClientSecret();

    $.ajax({
        type: 'POST',
        url: baseUrl + '/gxp/api/daxko/classes/' + uniqueID + '/' + memberID + '/waitlist?XDEBUG_SESSION_START=PHPSTORM',
        headers: {'X-CLIENT-ID': accountID, 'X-CLIENT-SECRET': daxkoAPIClientSecret, 'content-type': 'application/json'},
        async: false,
        success: function(data) {
            if (data.id) {
                $('.modal').modal('hide');
                alert("Added to waitlist");
            } else {
                alert("Failed to add to waitlist.");
            }

        },
        error: function (result){
            alert("Failed to add to waitlist.");
        }
    })

}
