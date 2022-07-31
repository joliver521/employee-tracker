-- filling the name column in the departments table
INSERT INTO departments (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

-- filling the job_title, salary, and dept_id columns in the roles table
INSERT INTO roles (job_title, salary, dept_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 160000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

-- filling the first_name, last_name, role_id, and manager_id columns in the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Jason", "Oliver", 1, NULL),
("Justin", "Blackburn", 2, 1),
("Jami", "Rogers", 3, NULL),
("Tucker", "Rainey", 4, 3),
("Chloe", "Grace", 5, NULL),
("Ellie", "Hope", 6, 5),
("Autumn", "Leigh", 7, NULL),
("Charlie", "Carlson", 8, 7);