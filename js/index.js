var boards;

let rating = {};
const ignore_fields = ['name', 'special_features', 'image_url'];
const options_names = {
    analog_input: 'Analog Input',
    bluetooth: 'Bluetooth',
    clock_speed: 'Clock Speed',
    connector: 'Connector',
    dac: 'DAC',
    flash_memory: 'Flash Memory',
    form_factor: 'Form Factor',
    gpio: 'GPIO',
    i2c: 'I²C',
    lipo_charger: 'LiPo Charger',
    processor: 'Processor',
    pwm: 'PWM',
    ram: 'RAM',
    retired: 'Is Retired',
    shield_compatable: 'Sheild Compatable',
    soldered_headers: 'Soldered Headers',
    spi: 'SPI',
    textile: 'Is Textile',
    uart: 'UART',
    usb_client: 'USB Client',
    usb_host: 'USB Host',
    usb_to_serial: 'USB To Serial',
    voltage: 'Voltage',
    wifi: 'WiFi',
}
const filter_order = [
    'processor', 
    'connector', 
    'bluetooth', 
    'wifi', 
    'clock_speed', 
    'analog_input', 
    'voltage', 
    'flash_memory', 
    'form_factor', 
    'shield_compatable', 
    'soldered_headers', 
    'dac', 
    'gpio', 
    'i2c', 
    'lipo_charger', 
    'pwm', 
    'ram', 
    'spi', 
    'textile', 
    'uart', 
    'usb_client', 
    'usb_host', 
    'usb_to_serial', 
    'retired', 
];
let options = {};

$(function() {
    // document ready
});

function getBoardOptions() {
    const $f = $('#filter');

    for (let bd in boards) {
        let board = boards[bd];
        for (let key in board) {
            if (ignore_fields.includes(key)) continue;
            if (!(key in options)) {
                options[key] = [];
            }
            if (!options[key].includes(board[key])) {
                options[key].push(board[key]);
            }
        }
    }
    console.log(options);

    $f.children().remove();

    for (let i = 0; i < filter_order.length; i ++) {
        let filterId = filter_order[i];
        let filterName = options_names[filterId];
        let $e = $(`<div class="filter-item"></div>`);
        let $b = $(`<button class="collapsable" onclick="collapse('fl${filterId}')">${filterName}</button>`).on('click', function() {$(this).toggleClass('active')});
        let $d = $(`<form id="fl${filterId}" class="col-content"></form>`);
        $f.append($e);
        $e.append($b, $d);
        //
        for (let type in options[filterId]) {
            let t = options[filterId][type];
            $d.append(`<input type="checkbox" id="fir${filterId}" value="${t}">
                       <label for="fir${filterId}">${t}</label><br>`);
        }
    }
    // <input type="radio">
}

function applyFilter() {

}

function collapse(c) {
    let content = $(`#${c}`);
    if (content.css('max-height') == '0px') {
        content.css('max-height', `${content[0].scrollHeight}px`);
    } else {
        content.css('max-height', '0px');
    }
}

