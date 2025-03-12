//Parses a time string in the format "HH:MM AM/PM" and converts it to a Date object.
function parseDate(timeString) {
    // Example input: "10:30 AM", "02:45 PM"
    // Split the input string into time and modifier (AM/PM)
    let [time, modifier] = timeString.split(' ');
    // Split into hours and minutes
    let [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format
    if (modifier === 'PM' && hours !== '12') {
        // Convert PM hours to 24-hour format
        hours = parseInt(hours, 10) + 12;
    }

    if (modifier === 'AM' && hours === '12') {
        // Convert 12 AM to 00 hours in 24-hour format
        hours = '00';
    }

    // Return a new Date object for the current day, with the parsed hours and minutes
    return new Date(0, 0, 0, hours, minutes);
}

// Sorts a table of cities based on the selected column (name, time, or temperature).
function sortCities(option) {
    let table, rows, switching, i, x, y, shouldSwitch;
    // Get the table element
    table = document.getElementById("citiesTable");
    // Set the switching flag to true
    switching = true;

    // Loop until no switching is required
    while (switching) {
        switching = false;
        rows = table.rows;

        // Iterate through the rows and not the header.
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[option];
            y = rows[i + 1].getElementsByTagName("TD")[option];

            // Perform comparison based on selected column (name, time, or temperature)

            // Name (string sorting)
            if (option === 0) {
                if (x.innerHTML.toLowerCase().localeCompare(y.innerHTML.toLowerCase()) > 0) {
                    shouldSwitch = true;
                    break;
                }
            }
            // Time sorting
            else if (option === 1) {
                // Use custom parseDate function
                let timeX = parseDate(x.innerHTML);
                let timeY = parseDate(y.innerHTML);

                if (timeX > timeY) {
                    shouldSwitch = true;
                    break;
                }
            }
            // Temperature sorting
            else if (option === 2) {
                // Extract only numeric part from the temperature since it has text part as well, regex will help.
                let tempX = parseFloat(x.innerHTML.replace(/[^\d.-]/g, ''));
                let tempY = parseFloat(y.innerHTML.replace(/[^\d.-]/g, ''));

                // Check for NaN (invalid temperature format)
                if (isNaN(tempX) || isNaN(tempY)) {
                    console.error("Invalid temperature format");
                } else if (tempX > tempY) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        // If a switch is needed, move the rows
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            // Set switching to true for another pass
            switching = true;
        }
    }
}