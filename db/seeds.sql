USE employeetracker_db;

INSERT INTO departments (name)
VALUES ("Software Engineer"),
       ("Web Dev"),
       ("Javascripter");

INSERT INTO roles (title,salary,department_id)
VALUES ("Senior Dev",55000,1),
       ("Intern Dev",55000,1),
       ("Junior Dev",55000,1);
       
INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Elliot", "Smith", 1,6),
       ("Amira", "Afzal", 1,5),
       ("Christoper", "Lee", 1,4),
       ("Verónica", "Rodriguez", 1,2),
       ("Igor", "Stein", 2,3);