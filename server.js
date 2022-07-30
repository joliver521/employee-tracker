// importing mysql, inquirer, console.table, and dotenv
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

require('dotenv').config();

// connecting to the database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(err => {
    if (err) throw err;

    // creating the intro page for the console
    console.log('***********************************');
    console.log('*                                 *');
    console.log('*        EMPLOYEE MANAGER         *');
    console.log('*                                 *');
    console.log('***********************************');
    promptUser();
});

// prompt for user to select from a list of options for the database
function promptUser() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit',
            ],
        })
        .then(answer => {
            // switch statement to run functions based on what option the user selected
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quitApp();
                    break;
                default:
                    break;
            }
        });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table('All Employees', res);
        promptUser();
    });
}

function addEmployee() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: "What is the new employee's first name?",
                    validate: Input => {
                        if (Input) {
                            return true;
                        } else {
                            console.log(
                                'Please enter a first name for your employee'
                            );
                            return false;
                        }
                    },
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "What is the new employee's last name?",
                    validate: Input => {
                        if (Input) {
                            return true;
                        } else {
                            console.log(
                                'Please enter a last name for your employee'
                            );
                            return false;
                        }
                    },
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: "What is the employee's manager's ID?",
                    validate: Input => {
                        if (Input) {
                            return true;
                        } else {
                            console.log(
                                'Please enter a manager id for your employee'
                            );
                            return false;
                        }
                    },
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: function () {
                        var rolesArr = [];
                        for (let i = 0; i < res.length; i++) {
                            rolesArr.push(res[i].job_title);
                        }
                        return rolesArr;
                    },
                    message: "What is the new employee's role?",
                },
            ])
            .then(answer => {
                let role_id;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].title == answer.role) {
                        role_id = res[j].id;
                    }
                }
                connection.query(
                    'INSERT INTO employees SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        promptUser();
                    }
                );
            });
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employees', (err, data) => {
        if (err) throw err;

        var employees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + ' ' + last_name,
            value: id,
        }));
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: "Which employee's info would you like to update?",
                    choices: employees,
                },
            ])
            .then(answer => {
                var employee = answer.name;
                var params = [];
                params.push(employee);

                connection.query('SELECT * FROM roles', (err, data) => {
                    if (err) throw err;

                    var roles = data.map(({ id, job_title }) => ({
                        name: job_title,
                        value: id,
                    }));

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message:
                                    "What will the employee's new role be?",
                                choices: roles,
                            },
                        ])
                        .then(answer => {
                            var role = answer.role;
                            params.push(role);

                            var employee = params[0];
                            params[0] = role;
                            params[1] = employee;

                            connection.query(
                                'UPDATE employees SET role_id = ? WHERE id = ?',
                                params,
                                err => {
                                    if (err) throw err;
                                    promptUser();
                                }
                            );
                        });
                });
            });
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table('All Roles', res);
        promptUser();
    });
}

function addRole() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'new_role',
                    type: 'input',
                    message: 'What role would you like to add?',
                    validate: Input => {
                        if (Input) {
                            return true;
                        } else {
                            console.log('Please enter a new role title');
                            return false;
                        }
                    },
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?',
                    validate: Input => {
                        if (Input) {
                            return true;
                        } else {
                            console.log(
                                'Please enter a salary for the new role'
                            );
                            return false;
                        }
                    },
                },
                {
                    name: 'department',
                    type: 'list',
                    choices: function () {
                        var deptArr = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArr.push(res[i].name);
                        }
                        return deptArr;
                    },
                },
            ])
            .then(answer => {
                let dept_id;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name == answer.department) {
                        dept_id = res[j].id;
                    }
                }
                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        job_title: answer.new_role,
                        salary: answer.salary,
                        dept_id: dept_id,
                    },
                    function (err, res) {
                        if (err) throw err;
                        promptUser();
                    }
                );
            });
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table('All Departments', res);
        promptUser();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message:
                    "What is the name of the new department you're adding?",
                validate: Input => {
                    if (Input) {
                        return true;
                    } else {
                        console.log(
                            'Please enter a name for the new department'
                        );
                        return false;
                    }
                },
            },
        ])
        .then(answer => {
            connection.query('INSERT INTO departments SET ?', {
                name: answer.newDepartment,
            });
            connection.query('SELECT * FROM departments', (err, res) => {
                if (err) throw err;
                // console.table(res);
                promptUser();
            });
        });
}

function quitApp() {
    connection.end();
}
