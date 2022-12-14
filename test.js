const inquirer = require('inquirer');

function init() {
    inquirer
    .prompt([{
        type: "input",
        message: "type here",
        name: "stuff"
    }])
    .then((response) => {
        console.log("this comes before function");
        nextFunction(response);
    });
};

function nextFunction(response) {
    console.log("this comes before the next inquirer");
    inquirer
    .prompt([{
        type: "input",
        message: "type here",
        name: "stuff"
    }])
    .then((response) => {
        console.log("this comes before function");
        nextFunction(response);
    });
}

init();
