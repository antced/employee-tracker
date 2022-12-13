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
};

const askQuestions = (questionType) => {
    const departmentQs = [{
        type: 'input',
        message: 'What is the department name?',
        name: 'department'
    }]

    const roleQs = [{
        type: 'input',
        message: 'What is the role name?',
        name: 'name'
    },
    {
        type: 'input',
        message: 'What is the salary?',
        name: 'salary'
    },
    {
        type: 'input',
        message: 'What is the role name?',
        name: 'salary'
    }]

    const employeeQs = [{
        type: 'input',
        message: 'What is the department name?',
        name: 'department'
    }]

    const updateQs = [{
        type: 'input',
        message: 'What is the department name?',
        name: 'department'
    }]

    if (questionType === 'departments') {
        inquirer
        .prompt(departmentQs)
        .then((data) => insertTable(data))
    } else if (questionType === 'roles') {
        inquirer
        .prompt(roleQs)
        .then((data) => insertTable(data))
    } else if (questionType === 'employees') {
        inquirer
        .prompt(employeeQs)
        .then((data) => insertTable(data))
    } else if (questionType === 'update') {
        inquirer
        .prompt(updateQs)
        .then((data) => updateTable(data))
    }
}

function insertTable(table,values) {
    db.query(`INSERT INTO ${table} (id,name) VALUES (${values})`, function (err, results) {
        err ? console.log(err) : console.table(results);
    })
}

function optionPicker(data) {
    if (data.option === 'View All Departments') {
        db.query(`SELECT * FROM departments`, function (err, results) {
            err ? console.log(err) : console.table(results);
        });
        setTimeout(() => {
            continueToNext();
        }, 1);
    } else if (data.option === 'View All Roles') {
        db.query(`SELECT * FROM roles`, function (err, results) {
            err ? console.log(err) : console.table(results);
        });
        setTimeout(() => {
            continueToNext();
        }, 1);
    } else if (data.option === 'View All Employees') {
        db.query(`SELECT * FROM employees`, function (err, results) {
            err ? console.log(err) : console.table(results);
        });
        setTimeout(() => {
            continueToNext();
        }, 1);
    } else if (data.option === 'Add A Department') {
        setTimeout(() => {
            askQuestions('department');
        }, 1);
    } else if (data.option === 'Add A Role') {
        setTimeout(() => {
            askQuestions('department');
        }, 1);
    } else if (data.option === 'Add An Employee') {
        setTimeout(() => {
            askQuestions('department');
        }, 1);
    } else if (data.option === 'Update an Employee Role') {
        setTimeout(() => {
            askQuestions('department');
        }, 1);
    } else {
        setTimeout(() => {
            askQuestions('department');
        }, 1);
    }
}

const continueToNext = () =>
    inquirer
        .prompt([
            {
                name: "continue",
                type: "confirm",
                message: "Want to do anything else?",
            },
        ])
        .then((answer) => {
            if (answer.continue) return viewTables();
        });

viewTables();