-- Sample data used in every SQL note and in interview-questions.md
-- Standard SQL (tested on SQLite; it should also run unchanged on MySQL and PostgreSQL).
-- Run it once, then follow along.

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    id   INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
    id         INT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    dept_id    INT,
    salary     INT,
    manager_id INT,
    hire_date  DATE,
    FOREIGN KEY (dept_id)    REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE customers (
    id   INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50)
);

CREATE TABLE orders (
    id          INT PRIMARY KEY,
    customer_id INT,
    amount      INT,
    order_date  DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO departments (id, name) VALUES
    (1, 'Engineering'),
    (2, 'Sales'),
    (3, 'HR'),
    (4, 'Marketing');

INSERT INTO employees (id, name, dept_id, salary, manager_id, hire_date) VALUES
    (1,  'Asha',   1,    90000,  NULL, '2019-01-15'),
    (2,  'Ravi',   1,    75000,  1,    '2020-03-10'),
    (3,  'Meena',  1,    75000,  1,    '2020-07-01'),
    (4,  'Karan',  2,    60000,  1,    '2021-02-20'),
    (5,  'Sara',   2,    65000,  4,    '2021-06-15'),
    (6,  'Vikram', 2,    50000,  4,    '2022-01-10'),
    (7,  'Neha',   3,    55000,  1,    '2020-11-05'),
    (8,  'Omar',   1,    120000, 1,    '2018-05-30'),
    (9,  'Pooja',  NULL, 40000,  7,    '2023-04-01'),
    (10, 'Dev',    1,    70000,  2,    '2022-09-12');

INSERT INTO customers (id, name, city) VALUES
    (1, 'Anil',   'Delhi'),
    (2, 'Bina',   'Mumbai'),
    (3, 'Chirag', 'Delhi'),
    (4, 'Divya',  'Pune');

INSERT INTO orders (id, customer_id, amount, order_date) VALUES
    (101, 1, 500, '2024-01-05'),
    (102, 1, 300, '2024-01-20'),
    (103, 2, 700, '2024-02-02'),
    (104, 3, 200, '2024-02-14'),
    (105, 1, 450, '2024-03-01'),
    (106, 2, 150, '2024-03-09');
