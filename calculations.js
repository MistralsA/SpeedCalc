/**
 * DOM hookups
 */
function hookUp() {
    this._unit = [
        {
            name: document.getElementById('u1-name'),
            speed: document.getElementById('u1-speed'),
            cr: document.getElementById('u1-cr'),
        },
        {
            name: document.getElementById('u2-name'),
            speed: document.getElementById('u2-speed'),
            cr: document.getElementById('u2-cr'),
        },
        {
            name: document.getElementById('u3-name'),
            speed: document.getElementById('u3-speed'),
            cr: document.getElementById('u3-cr'),
        },
        {
            name: document.getElementById('u4-name'),
            speed: document.getElementById('u4-speed'),
            cr: document.getElementById('u4-cr'),
        },
    ];
    this._targets = [
        {
            speed: document.getElementById('t1-speed'),
            cr: document.getElementById('t1-cr'),
        },
        {
            speed: document.getElementById('t2-speed'),
            cr: document.getElementById('t2-cr'),
        },
        {
            speed: document.getElementById('t3-speed'),
            cr: document.getElementById('t3-cr'),
        },
        {
            name: document.getElementById('t4-name'),
            speed: document.getElementById('t4-speed'),
            cr: document.getElementById('t4-cr'),
        },
    ]
}

/**
 * UI stuff
 */
function showHideChecks() {
    for (let i = 0; i < this._unit.length; i++) {
        const unitSet = this._unit[i];
        if (i >= this._checkUnits) { // Hide these
            unitSet.name.setAttribute('type', 'hidden');
            unitSet.speed.setAttribute('type', 'hidden');
            unitSet.cr.setAttribute('type', 'hidden');
        } else { // Show these
            unitSet.name.setAttribute('type', 'text');
            unitSet.speed.setAttribute('type', 'number');
            unitSet.cr.setAttribute('type', 'number');
        }
    }
    for (let i = 0; i < this._targets.length; i++) {
        const targetSet = this._targets[i];
        if (i >= this._checkTargets) { // Hide these
            if (targetSet.name) { targetSet.name.setAttribute('type', 'hidden'); }
            targetSet.speed.setAttribute('type', 'hidden');
            targetSet.cr.setAttribute('type', 'hidden');
        } else { // Show these
            if (targetSet.name) { targetSet.name.setAttribute('type', 'text'); }
            targetSet.speed.setAttribute('type', 'text');
            targetSet.cr.setAttribute('type', 'number');
        }
    }
}

/**
 * ERR
 */
function doError() {
    for (let i = 0; i < this._targets.length; i++) {
        this._targets[i].speed.value = "ERR";
    }
}

/**
 * Checks if each number is a number
 * @param {Array<Number>} arr
 * @returns 
 */
function fullCheck(arr) {
    let okToGo = true;
    arr.forEach(val => {
        okToGo = okToGo && Number.isFinite(val);
    });
    return okToGo;
}

/**
 * Does an upper and lower bound calculation with given data
 * @param {Array<Number} unit [speed, cr]
 * @param {Array<Number>} target [cr]
 * @returns 
 */
function singleCalculation(unit, target) {
    //target Speed = unit Speed * target CR / unit CR
    const lowerLimit = (target[0] - 5) / unit[1];
    const upperLimit = target[0] / (unit[1] - 5)
    return {
        upper: unit[0] * upperLimit,
        lower: unit[0] * lowerLimit,
    };
}

/**
 * Finds the average
 * @param {number} arr
 * @param {string} dir
 * @returns 
 */
function average(arr, dir) {
    const sum = arr.reduce((prev, cur) => prev + cur[dir], 0);
    return Math.round(sum / arr.length).toString();
}

/**
 * Big calculation and sets the values in the box.
 * @returns {null}
 */
function calculate() {
    const scrubbedUnit = []; // Arr for holding Unit values, as numbers
    for (let i = 0; i < this._unit.length; i++) {
        if (i < this._checkUnits) {
            scrubbedUnit.push([Number.parseInt(this._unit[i].speed.value), Number.parseInt(this._unit[i].cr.value)]);
        }
    }
    const scrubbedTargets = []; // Arr for holding Target values, as numbers
    const endResult = []; // Arr for holding end results
    for (let i = 0; i < this._targets.length; i++) {
        if (i < this._checkTargets) {
            scrubbedTargets.push([Number.parseInt(this._targets[i].cr.value)]);
            endResult.push([]);
        }
    }
    // Check if everything is a number
    let okToGo = true;
    for (let unit of scrubbedUnit.concat(scrubbedTargets)) {
        okToGo = okToGo && fullCheck(unit);
        if (!okToGo) { doError(); return; }
    }

    for (const unit of scrubbedUnit) {
        for (let i = 0; i < scrubbedTargets.length; i++) {
            endResult[i].push(singleCalculation(unit, scrubbedTargets[i])); // Push upper/lower bound calculations into endResults, index is per target
        }
    }

    for (let i = 0; i < endResult.length; i++) { // Put out end values
        this._targets[i].speed.value = average(endResult[i], 'lower') + ' ~ ' + average(endResult[i], 'upper');
    }
}

/**
 * Increments number of units to check. Capped at _maxUnits
 */
function addUnit() {
    const oldVal = this._checkUnits;
    this._checkUnits = Math.min(this._checkUnits + 1, this._maxUnits);
    if (oldVal !== this._checkUnits) {
        showHideChecks();
    }
}

/**
 * Decrements number of units to check. Capped at 1
 */
function removeUnit() {
    const oldVal = this._checkUnits;
    this._checkUnits = Math.max(this._checkUnits - 1, 1);
    if (oldVal !== this._checkUnits) {
        showHideChecks();
    }
}

/**
 * Increments number of targets to check. Capped at maxTargets
 */
function addTarget() {
    const oldVal = this._checkTargets;
    this._checkTargets = Math.min(this._checkTargets + 1, this._maxTargets);
    if (oldVal !== this._checkTargets) {
        showHideChecks();
    }
}

/**
 * Decrements number of targets to check. Capped at minTargets
 */
function removeTarget() {
    const oldVal = this._checkTargets;
    this._checkTargets = Math.max(this._checkTargets - 1, this._minTargets);
    if (oldVal !== this._checkTargets) {
        showHideChecks();
    }
}

/**
 * Main
 */
function main() {
    // Hook up stuff
    hookUp();
    this._maxUnits = 4;
    this._checkUnits = 1;
    this._maxTargets = 4;
    this._minTargets = 3;
    this._checkTargets = this._minTargets;
    showHideChecks();
}

window.main = main;
window.calculate = calculate;
window.addUnit = addUnit;
window.removeUnit = removeUnit;
window.addTarget = addTarget;
window.removeTarget = removeTarget;