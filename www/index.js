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
        let iElement = document.createElement('i');
        iElement.className = "glyphicon glyphicon-plus";
        tableElement.append(iElement);
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
