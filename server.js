const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'linuxsql',
        database: 'employeetracker_db'
    },
    console.log('Connected to employeetracker_db database.com')
);

const viewTables = () => {
    const tableList = [{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update an Employee Role'],
        name: 'option'
    }]
    inquirer
        .prompt(tableList)
        .then((data) => optionPicker(data))
        .then(() => viewTables());
};

function optionPicker(data) {
    if (data.option === 'View All Departments') {
        db.query(`SELECT * FROM departments`, function (err, results) {
            err ? console.log(err) : console.table(results);
        })
    } else if (data.option === 'View All Roles') {
        db.query(`SELECT * FROM roles`, function (err, results) {
            err ? console.log(err) : console.table(results);
        })
    } else if (data.option === 'View All Employees') {
        db.query(`SELECT * FROM employees`, function (err, results) {
            err ? console.log(err) : console.table(results);
        })
    } else if (data.option === 'Add A Department') {
        db.query(`INSERT INTO department (id,name) VALUES (${name})`, function (err, results) {
            err ? console.log(err) : console.table(results);
        })
    } else if (data.option === 'Add A Role') {
        return console.log('adding a role');
    } else if (data.option === 'Add An Employee') {
        return console.log('adding an employee');
    } else if (data.option === 'Update an Employee Role') {
        return console.log('updating an employee');
    } else {
        return console.log('not valid option')
    }
    return;
}

const askQuestions = () => inquirer.prompt

viewTables();