$(function () {
    $.getJSON("json/arduino_table.json", function (json) {
        boards = json;
        console.log(json);
        getBoardOptions();
    }).fail(function() {
        alert('Cannot read arduino arduino specs, please reload the page');
    });
});