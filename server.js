// requiring all packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
// setting login for mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'linuxsql',
        database: 'employeetracker_db'
    },
    console.log('Connected to employeetracker_db database.com')
);
// asks initial questions
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

function optionPicker(data) {
    // based on which option is picked, run one of these
    const optionPicked = data.option;
    switch (optionPicked) {
        case 'View All Departments':
            // show all departments
            db.query(`SELECT * FROM departments`, function (err, results) {
                if (err) {
                    console.log(err)
                } else {
                    console.table("\n", results);
                    viewTables();
                }
            });
            break;
        // show all roles joined with departments
        case 'View All Roles':
            db.query(`SELECT roles.id,roles.title,departments.name AS department,roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`, function (err, results) {
                if (err) {
                    console.log(err)
                } else {
                    console.table("\n", results);
                    viewTables();
                }
            });
            break;
        // show all employees, joined with roles and departments
        case 'View All Employees':
            db.query("SELECT e.id,e.first_name,e.last_name,title,departments.name AS department,salary,CONCAT(m.first_name,' ',m.last_name) AS manager FROM employees e JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id", function (err, results) {
                if (err) {
                    console.log(err)
                } else {
                    console.table("\n", results);
                    viewTables();
                }
            });
            break;
        case 'Add A Department':
            // go to this function if adding or updating
            askQuestions('department');
            break;
        case 'Add A Role':
            askQuestions('role');
            break;
        case 'Add An Employee':
            askQuestions('employee');
            break;
        case 'Update an Employee Role':
            askQuestions('update');
            break;
    }
}

const askQuestions = (questionType) => {
    // based on the last functions choices, run one of these
    if (questionType === 'department') {
        // list of questions
        const departmentQs = [{
            type: 'input',
            message: 'What is the department name?',
            name: 'department'
        }]
        inquirer
            .prompt(departmentQs)
            .then((data) => insertTable(data, 'departments'))

    } else if (questionType === 'role') {
        // get department names to show in question list
        db.query(`SELECT name FROM departments`, function (err, results) {
            if (err) {
                console.log(err)
            } else {
                const departmentList = results.map(function (obj) { return obj.name; });
                const roleQs = [{
                    type: 'input',
                    message: 'What is the role name?',
                    name: 'role'
                },
                {
                    type: 'input',
                    message: 'What is the salary?',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'What is the department?',
                    choices: departmentList,
                    name: 'department'
                }]
                inquirer
                    .prompt(roleQs)
                    .then((data) => insertTable(data, 'roles'))
            }
        });
    } else if (questionType === 'employee') {
        // TODO get managers to show up here too
        // get role names to show in question list
        db.query(`SELECT title FROM roles`, function (err, results) {
            if (err) {
                console.log(err)
            } else {
                const roleList = results.map(function (obj) { return obj.title; });
                // get manager names to show in question list
                db.query(`SELECT first_name,last_name FROM employees WHERE manager_id IS NULL`, function (err, results) {
                    if (err) {
                        console.log(err)
                    } else {
                        const managerList = results.map(function (obj) { return obj.first_name + " " + obj.last_name; });
                        const employeeQs = [{
                            type: 'input',
                            message: 'What is the employee\'s first name?',
                            name: 'firstName'
                        },
                        {
                            type: 'input',
                            message: 'What is the employee\'s last name?',
                            name: 'lastName'
                        },
                        {
                            type: 'list',
                            message: 'What is the employee\'s role?',
                            choices: roleList,
                            name: 'role'
                        },
                        {
                            type: 'list',
                            message: 'Who is the employee\'s manager?',
                            choices: managerList,
                            name: 'manager'
                        }]
                        inquirer
                            .prompt(employeeQs)
                            .then((data) => insertTable(data, 'employees'))
                    }
                })
            }
        });
    } else if (questionType === 'update') {
        // get employee names
        db.query(`SELECT first_name,last_name FROM employees`, function (err, results) {
            if (err) {
                console.log(err)
            } else {
                const employeeList = results.map(function (obj) { return obj.first_name + " " + obj.last_name; });
                // get role names
                db.query(`SELECT title FROM roles`, function (err, results) {
                    if (err) {
                        console.log(err)
                    } else {
                        const roleList = results.map(function (obj) { return obj.title });
                        // ask questions with info from table as options
                        const updateQs = [{
                            type: 'list',
                            message: 'Which employee\'s role do you want to update?',
                            choices: employeeList,
                            name: 'employee'
                        },
                        {
                            type: 'list',
                            message: 'Which role do you want to assign the select employee?',
                            choices: roleList,
                            name: 'role'
                        }]
                        // run next inquirer
                        inquirer
                            .prompt(updateQs)
                            .then((data) => insertTable(data, 'update'))
                    }
                })
            }
        });
    }
}

function insertTable(data, table) {
    // based on last choices, insert into table
    // TODO: turn these into switch cases
    if (table === 'departments') {
        // add chosen info into table
        db.query(`INSERT INTO departments (name) VALUES (?)`, [data.department], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.table(`Added ${data.department} to the database.`);
                // go back to initial questions
                viewTables();
            }
        });
    } else if (table === 'roles') {
        // get ids
        db.query('SELECT id FROM departments WHERE name = ?', [data.department], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                const departmentId = results[0].id;
                db.query(`INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)`, [data.role, data.salary, departmentId], function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.table(`Added ${data.role} to the database.`);
                        viewTables();
                    }
                });
            }
        })

    } else if (table === 'employees') {
        db.query('SELECT id FROM roles WHERE title = ?', [data.role], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                const roleId = results[0].id;
                managerFirst = data.manager.split(" ")[0];
                managerLast = data.manager.split(" ")[1];
                db.query('SELECT id FROM employees WHERE first_name = ? AND last_name = ?', [managerFirst, managerLast], function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        const managerId = results[0].id;
                        db.query('INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [data.firstName, data.lastName, roleId, managerId], function (err, results) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.table(`Added ${data.firstName} ${data.lastName} to the database.`);
                                viewTables();
                            }
                        })
                    }
                })
            }
        })

    } else if (table === 'update') {
        db.query('SELECT id FROM roles WHERE title = ?', [data.role], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                const roleId = results[0].id;
                updateFirst = data.employee.split(" ")[0];
                updateLast = data.employee.split(" ")[1];
                db.query('SELECT first_name,last_name FROM employees WHERE first_name = ? AND last_name = ?', [updateFirst, updateLast], function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        const managerId = results[0].id;
                        // update employee information where info matches
                        db.query('UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?', [roleId, updateFirst, updateLast], function (err, results) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.table(`Changed ${updateFirst} ${updateLast} role to ${data.role} in the database.`);
                                viewTables();
                            }
                        })
                    }
                })
            }
        })
    }
}

viewTables();