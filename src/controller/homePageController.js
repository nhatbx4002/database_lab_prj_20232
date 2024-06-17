const pool = require('../config/database');
const session = require('express-session');
require('dotenv').config();
//Function to show all books
async function ShowAllBooks(req, res) {
    try {
        const result = await pool.query('SELECT * FROM book');
        res.render('user/homepage_users', { book: result });
    } catch (error) {
        console.error('Error fetching all books:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function insertBooksBorrower(req, res) {
    const { bookId } = req.body;
    const username = req.session.username;
    if (!username) {
        return res.status(400).json({ error: 'Missing bookId or username' });
    }

    try {

        const status = 'Processing';

        const query = `
            INSERT INTO borrower (username, book_id, status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [username, bookId, status];
        const result = await pool.query(query, values);
        res.redirect('/webtruyen/ListProcessingUser');
    } catch (error) {
        console.error('Error inserting into borrower table:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function showBorrowedBooks(req, res) {
    try {
        const user = req.session.username;
        const query = `
          SELECT borrower.book_id, book.name, borrower.status
          FROM borrower
          JOIN book ON borrower.book_id = book.id
          WHERE borrower.status = 'Processing' AND borrower.username = $1
      `;
        const result = await pool.query(query, [user]);
        res.render('user/ListProcessingUser', { borrowedBooks: result });
    } catch (error) {
        console.error('Error fetching borrowed books:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function ListBorrow(req, res) {
    try {
        const user = req.session.username;
        const query = `
            SELECT borrower.book_id, book.name, borrower.form, borrower.to_date
            FROM borrower
            JOIN book ON borrower.book_id = book.id
            WHERE borrower.username = $1 AND borrower.status = 'Borrowed';
    `
        const result = await pool.query(query, [user]);
        res.render('user/ListBorrowUser', { borrowedBooks: result });
    } catch (error) {
        console.error('Error fetching borrowed books:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function ListBookReturn(req, res) {
    try {
        const user = req.session.username;
        const query = `
            SELECT borrower.book_id, book.name, borrower.form, borrower.to_date
            FROM borrower
            JOIN book ON borrower.book_id = book.id
            WHERE borrower.status = 'Returned' AND borrower.username = $1
        `;
        const result = await pool.query(query, [user]);
        console.log(result);
        res.render('user/ListReturnUser', { ListBookReturn: result });
    } catch (error) {
        console.error('Error fetching returned books:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    ShowAllBooks,
    insertBooksBorrower,
    showBorrowedBooks,
    ListBorrow,
    ListBookReturn
}