let allClasses = [];
let currentClasses = [];
let instructorFilter = '';
let locationFilter = 0;
let date = new moment();
//todo don't let this be hardcoded
let account = "GXP Health Clubs";

//todo remove once api call is setup to run in GetData() function
let dummyData = [
    {
        id: 1,
        name: 'Spin Class',
        instructor: {id: 24, name: 'David Barnes'},
        startTime: '03:00 pm',
        endTime: '04:00 pm',
        hasSub: false,
        subInstructor: [],
        canReserve: true,
        ReservationOpenWindow: 4,
        reservationList: [{id: 41, email: 'Chithra Shetty'}],
        location: "GXP Test Location"
    },
    {
        id: 2,
        name: 'Spin Class',
        instructor: {id: 24, name: 'David Barnes'},
        startTime: '03:00 pm',
        endTime: '04:00 pm',
        hasSub: true,
        subInstructor: {id: 45, name: 'Nate Barber'},
        canReserve: true,
        ReservationOpenWindow: 6,
        reservationList: [{id: 41, email: 'Chithra Shetty'}],
        location: "GXP Test Location"
    },
    {
        id: 3,
        name: 'Spin Class',
        instructor: {id: 24, name: 'Jeff Keen'},
        startTime: '03:00 pm',
        endTime: '04:00 pm',
        hasSub: false,
        subInstructor: [],
        canReserve: true,
        ReservationOpenWindow: 8,
        reservationList: [{id: 41, email: 'Chithra Shetty'}],
        location: "GXP Test Location"
    },
    {
        id: 1,
        name: 'Spin Class',
        instructor: {id: 24, name: 'Chithra Shetty'},
        startTime: '01:00 pm',
        endTime: '03:00 pm',
        hasSub: false,
        subInstructor: [],
        canReserve: true,
        ReservationOpenWindow: 12,
        reservationList: [{id: 41, email: 'Chithra Shetty'}],
        location: "GXP Test Location"
    },
];

/**
 * Gets all of the schedule data for the current day.
 *
 * @constructor
 */
//todo finish
function GetData(){
    //todo grab the data from api (dont use dummy data)
    allClasses = dummyData;
    FilterData();
}

/**
 * Changes the date to be the previous day
 */
//todo implement
function prevDate(){
    //todo go to previous date
    GetData();
}

/**
 * Changes the date to be the next day.
 */
//todo implement
function nextDate(){
    //todo go to next Date
    GetData();
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
//todo implement
function FilterData(){
    currentClasses = allClasses;
    //todo filter by instructor
    //todo filter by location
    DisplayData();
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
//todo finish - needs reservation plus icon
function GetScheduleRow(currentClass, newLine){
    let newClass = document.createElement("tr");
    newClass.className = "ClassRow table table-striped table-bordered";
    //class="table table-striped table-bordered"
    let tableElement = document.createElement("td");
    tableElement = getDate(tableElement);
    tableElement = GetAccountInfo(tableElement);
    tableElement = GetClassName(tableElement, currentClass);
    tableElement = GetInstructorName(tableElement, currentClass);
    tableElement = GetSubInformation(tableElement, currentClass);
    tableElement = GetTimeRange(tableElement, currentClass);
    tableElement = GetLocation(tableElement, currentClass);
    //todo add checks for reservation/reservation element
    newClass.append(tableElement);
    return newClass;
}

/**
 * Gets the date element to display for a class.
 *
 * @param tableElement
 * @returns {*}
 */
//todo finish this - update to be the date attached to class
function getDate(tableElement){
    let classP = document.createElement("b");
    classP.append(date.format("MMMM Do, YYYY"));
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
    bold.append(account);
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
    instructorP.append("Location: "+currentClass.location);
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
