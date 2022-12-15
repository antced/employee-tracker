USE employeetracker_db;

INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title,salary,department_id)
VALUES ("Salesperson",55000,1),
       ("Software Engineer",85000,2),
       ("Accountant",65000,3),
       ("Lawyer",100000,4);

       
INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Mr.", "Manager",2,NULL),
       ("Amira", "Afzal",1,1),
       ("Christoper", "Lee",2,1),
       ("Kim","Tim",3,1);
       