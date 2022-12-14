USE employeetracker_db;

INSERT INTO departments (name)
VALUES ("Software Engineer"),
       ("Web Dev"),
       ("Javascripter");

INSERT INTO roles (title,salary,department_id)
VALUES ("Senior Dev",55000,4),
       ("Intern Dev",55000,2),
       ("Junior Dev",55000,3),
       ("Manager",100000,1);
       
INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Amira", "Afzal",2,2),
       ("Christoper", "Lee",3,1),
       ("Software", "Manager",1,NULL);