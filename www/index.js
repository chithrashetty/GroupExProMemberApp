let allClasses = [];
let currentClasses = [];
let allInstructors = [];
let instructorFilter = '';
let allLocations = [];
let locationFilter = 0;
let date = new moment();
//todo don't let this be hardcoded - start with nothing
let currentAccount = {id: 27, name: "GXP Health Clubs"};
let baseUrl = getBaseUrl();

/**
 * Gets all of the schedule data for the current day.
 *
 * @constructor
 */
//todo keep selected instructor/location when date changes
function GetDataForAccount(){
    if(currentAccount.id !== 0) {
        $.post(baseUrl + "/mobile/api/getAllClasses.php", function (data) {
            data = JSON.parse(data);
            allClasses = data.classes;
            allInstructors = data.instructors;
            allLocations = data.locations;
            loadSelectData(allLocations, 'location', 'Select a location');
            loadSelectData(allInstructors, 'instructor', 'Select an instructor');
            FilterData();
        });
    }
}

function loadSelectData(dataArray, elementName, defaultOption){
    let selectElement = document.createElement("select");
    let initialOption = document.createElement("option");
    initialOption.value = "0";
    initialOption.append(defaultOption);
    selectElement.append(initialOption);
    if(dataArray.length !== 0){
       for(let i = 0; i<dataArray.length; i++){
           let option = document.createElement("option");
           option.value = dataArray[i].id;
           option.append(dataArray[i].name);
           selectElement.append(option);
       }
    }
    document.getElementById(elementName).replaceWith(selectElement);
}

function loadLocations(){
    if(allLocations.length !== 0){
        $('#location').innerHTML = "";
    }
}

function loadInstructors(){

}

/**
 * Changes the date to be the previous day
 */
//todo implement
function prevDate(){
    //todo go to previous date
    GetDataForAccount();
}

/**
 * Changes the date to be the next day.
 */
//todo implement
function nextDate(){
    //todo go to next Date
    GetDataForAccount();
}

//todo implement
function changeAccount(){

}

/**
 * OnChange event handler for the instructor filter, updates instructor fitler variable
 *
 * @param e
 */
//todo implement
function changeInstructorFilter(e){
    //todo change the filter
    FilterData();
}

/**
 * OnChange event handler for the location filter, updates location filter variable.
 *
 * @param e
 */
//todo implement
function changeLocationFilter(e){
    //todo change the loation
    FilterData();
}

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
            if(parseInt(instructorFilter[i].location.id) === parseInt(locationFilter)){
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
            if(parseInt(instructorFilter[i].instructor.id) === parseInt(instructorFilter)){
                classes.push(existingClasses[i]);
            }
        }
        return classes;
    }
    return existingClasses;
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
    tableElement = GetSubInformation(tableElement, currentClass);
    tableElement = GetTimeRange(tableElement, currentClass);
    tableElement = GetLocation(tableElement, currentClass);
    newClass.append(tableElement);
    return newClass;
}

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
//todo finish this
function GetInstructorName(tableElement, currentClass){
    let instructorP = document.createElement("p");
    //todo italicize this
    instructorP.append(currentClass.instructor.name+" is teaching this class");
    tableElement.append(instructorP);
    return tableElement;
}

/**
 * Gets the element to display for the sub information for the class.
 *
 * @param tableElement
 * @param currentClass
 * @returns {*}
 * @constructor
 */
//todo finish - need to make this match how it currently displays
function GetSubInformation(tableElement, currentClass){
    if(currentClass.hasSub) {
        let instructorP = document.createElement("p");
        instructorP.append("Subed by: " + currentClass.subInstructor.name);
        tableElement.append(instructorP);
    }
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
    // Declare all variables
    var tabcontent;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
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
        console.log("getBaseUrl | Could not find a value for the key 'env'");
        return String.empty;
    }

    // Parse JSON and get baseUrl according to environment name
    request.open('GET', './config/config.json', false);
    request.send(null);
    let json = JSON.parse(request.responseText);
    if (json === undefined || json === null) {
        console.log("getBaseUrl | Could not import config.json file");
        return String.empty;
    }

    // Get the URL based on the provided 'env' key
    let url = String();
    try {
        url = json[env]["baseUrl"];
    }
    catch (err) {
        console.log("Could not get baseUrl for provided key: " + env);
        console.log(err);
        return String.empty;
    }

    if (url === undefined || url === null) {
        console.log("An error occurred while trying to get the BaseUrl. No url found matching the provided key: " + env);
        return String.empty;
    }

    console.log("Environment BaseUrl: " + url);
    return url;
}

