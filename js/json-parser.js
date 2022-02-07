$(function () {
    $.getJSON("json/arduino_table.json", function (json) {
        boards = json;
        setTimeout(getBoardOptions, 20);
    }).fail(function() {
        alert('Cannot read arduino arduino specs, please reload the page');
    });
});