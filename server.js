// Vulnerable Web Application - For Educational Purposes Only
// WARNING: This application contains intentional security vulnerabilities
// DO NOT deploy to production environments

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Vulnerability 1: Hardcoded credentials and API keys
const API_KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyz";
const DATABASE_PASSWORD = "admin123";
const SECRET_TOKEN = "my-super-secret-token-12345";
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables with sample data
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        email TEXT,
        credit_card TEXT
    )`);
    
    db.run(`INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin@example.com', '4532-1234-5678-9010')`);
    db.run(`INSERT INTO users VALUES (2, 'user', 'password', 'user@example.com', '4111-1111-1111-1111')`);
    db.run(`INSERT INTO users VALUES (3, 'john', 'john123', 'john@example.com', '5500-0000-0000-0004')`);
    
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT
    )`);
    
    db.run(`INSERT INTO products VALUES (1, 'Laptop', 999.99, 'High-performance laptop')`);
    db.run(`INSERT INTO products VALUES (2, 'Phone', 599.99, 'Latest smartphone')`);
    db.run(`INSERT INTO products VALUES (3, 'Tablet', 399.99, 'Portable tablet')`);
});

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Vulnerability 2: SQL Injection
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Vulnerable SQL query - directly concatenating user input
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, row) => {
        if (err) {
            res.send(`<h2>Error: ${err.message}</h2><a href="/">Back</a>`);
        } else if (row) {
            // Vulnerability 3: Sensitive data exposure
            res.send(`
                <h2>Login Successful!</h2>
                <p>Welcome, ${row.username}!</p>
                <p>Email: ${row.email}</p>
                <p>Credit Card: ${row.credit_card}</p>
                <p>Database Password: ${DATABASE_PASSWORD}</p>
                <p>API Key: ${API_KEY}</p>
                <a href="/">Back</a>
            `);
        } else {
            res.send('<h2>Login failed!</h2><a href="/">Back</a>');
        }
    });
});

// Vulnerability 4: SQL Injection in search
app.post('/search', (req, res) => {
    const { search } = req.body;
    
    // Vulnerable SQL query
    const query = `SELECT * FROM products WHERE name LIKE '%${search}%'`;
    
    db.all(query, (err, rows) => {
        if (err) {
            res.send(`<h2>Error: ${err.message}</h2><a href="/">Back</a>`);
        } else {
            let html = '<h2>Search Results:</h2><ul>';
            rows.forEach(row => {
                html += `<li>${row.name} - $${row.price}</li>`;
            });
            html += '</ul><a href="/">Back</a>';
            res.send(html);
        }
    });
});

// Vulnerability 5: Cross-Site Scripting (XSS)
app.post('/comment', (req, res) => {
    const { comment } = req.body;
    
    // No sanitization - directly rendering user input
    res.send(`
        <h2>Your comment:</h2>
        <div>${comment}</div>
        <a href="/">Back</a>
    `);
});

// Vulnerability 6: Command Injection
app.post('/ping', (req, res) => {
    const { host } = req.body;
    
    // Directly using user input in shell command
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
        res.send(`
            <h2>Ping Results:</h2>
            <pre>${stdout}</pre>
            <pre>${stderr}</pre>
            ${error ? `<p>Error: ${error.message}</p>` : ''}
            <a href="/">Back</a>
        `);
    });
});

// Vulnerability 7: Path Traversal
app.get('/file', (req, res) => {
    const { filename } = req.query;
    
    // No validation of file path
    const filePath = path.join(__dirname, 'files', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.send(`<h2>Error: ${err.message}</h2><a href="/">Back</a>`);
        } else {
            res.send(`
                <h2>File Contents:</h2>
                <pre>${data}</pre>
                <a href="/">Back</a>
            `);
        }
    });
});

// Vulnerability 8: Insecure Direct Object Reference (IDOR)
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    
    // No authorization check - anyone can access any user's data
    const query = `SELECT * FROM users WHERE id = ${id}`;
    
    db.get(query, (err, row) => {
        if (err) {
            res.send(`<h2>Error: ${err.message}</h2><a href="/">Back</a>`);
        } else if (row) {
            res.json({
                username: row.username,
                password: row.password,
                email: row.email,
                credit_card: row.credit_card
            });
        } else {
            res.send('<h2>User not found</h2><a href="/">Back</a>');
        }
    });
});

// Vulnerability 9: Missing Authentication
app.get('/admin', (req, res) => {
    // No authentication required!
    res.send(`
        <h2>Admin Panel</h2>
        <p>API Key: ${API_KEY}</p>
        <p>Secret Token: ${SECRET_TOKEN}</p>
        <p>AWS Access Key: ${AWS_ACCESS_KEY}</p>
        <p>AWS Secret Key: ${AWS_SECRET_KEY}</p>
        <p>Database Password: ${DATABASE_PASSWORD}</p>
        <a href="/">Back</a>
    `);
});

// Vulnerability 10: Insecure Deserialization / eval usage
app.post('/calculate', (req, res) => {
    const { expression } = req.body;
    
    try {
        // Using eval with user input - extremely dangerous!
        const result = eval(expression);
        res.send(`
            <h2>Result: ${result}</h2>
            <a href="/">Back</a>
        `);
    } catch (error) {
        res.send(`
            <h2>Error: ${error.message}</h2>
            <a href="/">Back</a>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Vulnerable web application running on http://localhost:${PORT}`);
    console.log('WARNING: This application contains intentional security vulnerabilities!');
    console.log('For educational purposes only - DO NOT deploy to production!');
});
