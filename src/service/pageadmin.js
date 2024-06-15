const pool = require('../config/database');
const express = require('express');
const moment = require('moment');

const getNumberBooks = async () => {
    let result = await pool.query('SELECT COUNT (id) FROM book ');
    return result;
}
const getNumberUsers = async () => {
    let result = await pool.query('SELECT COUNT (username) FROM users');
    return result;
}
const getNumberBooks_Borrowed = async () => {
    const query = 'SELECT COUNT(book_id) FROM borrower WHERE status = $1'
    const result = await pool.query(query, ["Borrowed"]);
    return result;
}
const getNumberProcess = async () => {
    const query = 'SELECT COUNT(book_id) FROM borrower WHERE status = $1'
    const result = await pool.query(query, ["Processing"]);
    return result;
}

const listUsers = async () => {
    const query = 'SELECT * FROM users WHERE role = $1 ';
    const result = await pool.query(query, ["0"]);
    return result;
}

const ViewUserInfo = async (username) => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1'
        const result = await pool.query(query, [username]);
        return result;

    } catch (error) {
        console.error('Lỗi khi xem thông tin người dùng:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
const GetListBookProcessing = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.form, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1'
        const result = await pool.query(query, ['Processing']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}

const GetListBookBorrowed = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.form, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1'
        const result = await pool.query(query, ['Borrowed']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}

const GetListBookReturned = async () => {
    try {
        const query = 'select bo.id , bo.username, bo.form, bo.to_date, bo.status , b.name FROM borrower bo LEFT JOIN book b ON bo.book_id = b.id WHERE status = $1'
        const result = await pool.query(query, ['Returned']);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
const GetAllBook = async () => {
    try {
        const query = ' SELECT * FROM book ';
        let result = await pool.query(query);
        return result;
    } catch (error) {
        console.error('Loi khi truy xuat sach : ', error);
        res.status(500).send('Co loi xay ra');
    }
}
module.exports = {
    getNumberBooks,
    getNumberUsers,
    getNumberBooks_Borrowed,
    getNumberProcess,
    listUsers,
    ViewUserInfo,
    GetListBookProcessing,
    GetListBookReturned,
    GetListBookBorrowed,
    GetAllBook

}