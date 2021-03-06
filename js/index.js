var boards;

let rating = {};
const ignore_fields = ['name', 'image_url'];
const options_names = {
    analog_input: 'Analog Input',
    board: 'Board Features',
    clock_speed: 'Clock Speed',
    connector: 'Connector',
    dac: 'DAC',
    flash_memory: 'Flash Memory',
    form_factor: 'Form Factor',
    gpio: 'GPIO',
    i2c: 'I²C',
    processor: 'Processor',
    pwm: 'PWM',
    ram: 'RAM',
    special_features: 'Special Features',
    spi: 'SPI',
    uart: 'UART',
    usb: 'USB',
    usb_to_serial: 'USB To Serial',
    voltage: 'Voltage',
    wireless: 'Wireless',
}
const filter_order = [
    'processor', 
    'connector', 
    'wireless', 
    'clock_speed', 
    'analog_input', 
    'voltage', 
    'flash_memory', 
    'ram', 
    'form_factor', 
    'usb', 
    'usb_to_serial', 
    'board',
    'special_features',
    'dac', 
    'gpio', 
    'i2c', 
    'pwm', 
    'spi', 
    'uart', 
];
const filter_helper = {
    dac: '<strong>Digital to analog converter.</strong><br> A DAC is a circuit that allows you to translate numeric values into analog signals, so you can have output voltages variable from 0 to 5V by setting only a variable.',
    gpio: '<strong>General-Purpose Input Output.</strong><br> GPIO is a digital pin of an IC (Integrated Circuit). It can be used as input or output for interfacing devices.',
    i2c: '<strong>Inter-Integrated Circuit.</strong><br> I2C is a protocol that allows using two lines to send and receive data: a serial clock pin (SCL) that the Arduino Controller board pulses at a regular interval, and a serial data pin (SDA) over which data is sent between the two devices.',
    pwm: '<strong>Pulse Width Modulation.</strong><br> PWM is a technique for getting analog results with digital means. Digital control is used to create a square wave, a signal switched between on and off.',
    spi: '<strong>Serial Peripheral Interface.</strong><br> SPI is a synchronous serial data protocol used by microcontrollers for communicating with one or more peripheral devices quickly over short distances.',
    uart: '<strong>Universal Asynchronous Reception and Transmission.</strong><br> UART is a simple serial communication protocol that allows the host (Arduino) to communicate with serial devices. UART supports bidirectional, asynchronous and serial data transmission.',
}
let options = {};

const filter_empty = {
    analog_input: [],
    board: [],
    clock_speed: [],
    connector: [],
    dac: [],
    flash_memory: [],
    form_factor: [],
    gpio: [],
    i2c: [],
    processor: [],
    pwm: [],
    ram: [],
    special_features: [],
    spi: [],
    uart: [],
    usb: [],
    usb_to_serial: [],
    voltage: [],
    wireless: [],
}

let filter_add = {};
let filter_remove = {};

$(function() {
    // document ready
    clearFilter();
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
            let vals = board[key].split(/ ?, ?/gm);
            for (let v in vals) {
                let val = vals[v];
                if (val.replaceAll(' ') == '') continue;
                if (!options[key].includes(val)) {
                    options[key].push(val);
                }
            }
            options[key].sort(function(a, b) {
                let ia, ib;
                if (isNaN(ia = parseInt(a)) || isNaN(ib = parseInt(b))) {
                    return a.localeCompare(b);
                }
                return ia - ib;
              });
        }
    }
    // console.log(options);

    $f.children().remove();

    for (let i = 0; i < filter_order.length; i ++) {
        let filterId = filter_order[i];
        let filterName = options_names[filterId];
        let $e = $(`<div class="filter-item"></div>`);
        let $b = $(`<button class="collapsable" onclick="collapse('fl${filterId}')">${filterName}</button>`).on('click', function() {$(this).toggleClass('active')});
        if (filterId in filter_helper) {
            $b.append(`
            <div class="dropdown">
            <button class="dropbtn filter-help"><c class="hover-help"></c></button>
            <div class="dropdown-content filter-help-text"><p>${filter_helper[filterId]}</p></div>
            </div>`);
        }
        let $d = $(`<div id="fl${filterId}" class="col-content"></div>`);
        $f.append($e);
        $e.append($b, $d);
        //
        for (let type in options[filterId]) {
            let t = options[filterId][type];
            $d.append(`<div class="check-item">
                       <button class="checkbox" id="fir-${filterId}-${type}" onclick="toggleCheckbox('fir-${filterId}-${type}'); checkLive();">
                       <div class="check-graph unset"></div>
                       <div>${t}</div>
                       </button>
                       </div>
                       `);
        }
    }
    // <input type="radio">
}

function applyFilter() {
    rating = {};
    let includeBox = $('.include').parent().toArray();
    let excludeBox = $('.exclude').parent().toArray();
    // let keys = Object.keys(regex);
    for (let box in includeBox) {
        let c = includeBox[box].id.split('-');
        // console.log(`inc: ${c[1]} - ${c[2]}`);
        let key = c[1];
        let idx = c[2];
        let val = options[key][idx];
        if (!(key in filter_add)) filter_add[key] = [];
        filter_add[key].push(val);
        // console.log(`${key}: ${options[key][idx]}`)
    }
    for (let box in excludeBox) {
        let c = excludeBox[box].id.split('-');
        let key = c[1];
        let idx = c[2];
        let val = options[key][idx];
        if (!(key in filter_remove)) filter_remove[key] = [];
        filter_remove[key].push(val);
        // console.log(`exc: ${c[1]} - ${c[2]}`);
    }
    // console.log(filter_add);
    // console.log(filter_remove);

    for (let i = 0; i < boards.length; i ++) {
        let board = boards[i];
        for (let j = 0; j < filter_order.length; j ++) {
            let comp = filter_order[j];
            if (!(i in rating)) {
                rating[i] = 0;
            }
            if (comp in filter_add) {
                for (let k = 0; k < filter_add[comp].length; k ++) {
                    if (board[comp].toLowerCase().includes(filter_add[comp][k].toLowerCase())) {
                        // rating[board.name] ++;
                        rating[i] ++;
                    }
                }
            }
            if (comp in filter_remove) {
                for (let k = 0; k < filter_remove[comp].length; k ++) {
                    if (board[comp].toLowerCase().includes(filter_remove[comp][k].toLowerCase())) {
                        // rating[board.name] --;
                        rating[i] --;
                    }
                }
            }
        }
    }

    let keysSorted = Object.keys(rating).sort(function(a,b){return rating[b]-rating[a]});
    // console.log(keysSorted);
    let $sugg = $('#boards-suggestion').children().remove();
    for (let i = 0; i < keysSorted.length; i ++) {
        let board = boards[keysSorted[i]];
        addBoard(board, rating[keysSorted[i]]);
    }

    filter_add = {};
    filter_remove = {};
    // console.log(rating);
}

let liveFilter = 1;

function toggleLiveFilter() {
    liveFilter = !liveFilter;
    $('#live-filter').toggleClass('active');
}

function checkLive() {
    if (liveFilter) applyFilter();
}

function addBoard(board, rate) {
    let $sugg = $('#boards-suggestion');
    $sugg.append(`
        <div class="board-show">
            <h4 class="rating" style="color: ${rate < 0 ? 'darkred' : rate >= 5 ? 'darkgreen' : 'black'};">Score: ${rate}</h2>
            <h3>${board.name}</h3>
            <img src="${board.image_url}"></img>
        </div>
    `);
}

function clearFilter() {
    filter_add = {};
    filter_remove = {};
    $('.exclude').removeClass('exclude').addClass('unset');
    $('.include').removeClass('include').addClass('unset');
    $('.collapsable').next().css('max-height', '0px');
    $('.collapsable').removeClass('active');
}

function toggleCheckbox(c) {
    let cbox = $(`#${c} > .check-graph`);
    if (cbox.hasClass('unset')) {
        cbox.removeClass('unset').addClass('include'); return;
    }
    if (cbox.hasClass('include')) {
        cbox.removeClass('include').addClass('exclude'); return;
    }
    if (cbox.hasClass('exclude')) {
        cbox.removeClass('exclude').addClass('unset'); return;
    }
}

function collapse(c) {
    let content = $(`#${c}`);
    if (content.css('max-height') == '0px') {
        content.css('max-height', `${content[0].scrollHeight}px`);
    } else {
        content.css('max-height', '0px');
    }
}

