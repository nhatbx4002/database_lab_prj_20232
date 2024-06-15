const pool = require('../config/database');
const session = require('express-session');
const express = require('express');
require('dotenv').config
const { getNumberBooks, getNumberUsers, getNumberBooks_Borrowed, getNumberProcess, listUsers, ViewUserInfo, GetListBookProcessing, GetListBookReturned, GetListBookBorrowed, GetAllBook } = require('../service/pageadmin.js')
const moment = require('moment');

async function adminHomepage(req, res) {
    try {
        const user = req.session.username;
        const numberBooks = await getNumberBooks();
        const numberUsers = await getNumberUsers();
        const numberBooks_Borrowed = await getNumberBooks_Borrowed();
        const numberProcess = await getNumberProcess();


        res.render('admin/admin_home_page', {
            numberBooks: numberBooks.rows[0].count,
            numberUsers: numberUsers.rows[0].count,
            numberBooks_Borrowed: numberBooks_Borrowed.rows[0].count,
            numberProcess: numberProcess.rows[0].count,
            user: user

        });
    } catch (error) {
        console.error('Lỗi khi lấy số lượng sách:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
async function adminViewUser(req, res) {
    try {
        const user = req.session.username;
        const userList = await listUsers();
        res.render('admin/ListUser', {
            userList: userList,
            user: user
        }); // Truyền dữ liệu vào view
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
async function adminViewUserInfo(req, res) {
    try {
        const user = req.session.username;
        const username = req.params.username;
        const userinfo = await ViewUserInfo(username);
        res.render('admin/ViewUser', {
            userinfo: userinfo.rows[0],
            user: user
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}

async function adminDeleteUSer(req, res) {
    try {
        const username = req.body.delusername;
        const query = 'DELETE FROM users WHERE username = $1'
        const result = await pool.query(query, [username]);
        res.redirect('/webtruyen/ListUser');
    } catch (error) {
        console.error('Loi xay ra khi xoa nguoi dung :', error)
        res.status(500).send('Co loi xay ra');
    }
}

async function getBookBorrow(req, res) {
    try {
        const user = req.session.username;
        const action = req.params.action;
        // console.log(action);
        if (action === 'Processing') {
            const result = await GetListBookProcessing();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user });
        } else if (action === 'Borrow') {
            const result = await GetListBookBorrowed();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user });
        } else {
            const result = await GetListBookReturned();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user });
        }
    } catch (error) {
        console.error('Loi xay ra khi lay danh sach  :', error)
        res.status(500).send('Co loi xay ra');
    }
}
async function ConfirmBorrowed(req, res) {
    try {
        const idBorrow = req.body.Id;
        const query = ' UPDATE borrower SET status = $1 WHERE id = $2';
        const result = await pool.query(query, ['Borrowed', idBorrow]);
        res.redirect('/webtruyen/ListBorrowAdmin/Processing');
    } catch (error) {
        console.error('Loi xay ra khi xac nhan :', error)
        res.status(500).send('Co loi xay ra');
    }
}
async function ConfirmReturned(req, res) {
    try {
        const idBorrow = req.body.Id;
        const query = ' UPDATE borrower SET status = $1 WHERE id = $2';
        const result = await pool.query(query, ['Returned', idBorrow]);
        res.redirect('/webtruyen/ListBorrowAdmin/Borrow');
    } catch (error) {
        console.error('Loi xay ra khi xac nhan :', error)
        res.status(500).send('Co loi xay ra');
    }
}
async function GetBook(req, res) {
    try {
        const ListBook = await GetAllBook();
        res.render('admin/listbook', {
            book: ListBook
        });
    } catch (error) {
        console.error('Loi xay ra khi lay sach :', error)
        res.status(500).send('Co loi xay ra');
    }
}
module.exports = {
    adminHomepage,
    adminViewUser,
    adminViewUserInfo,
    adminDeleteUSer,
    getBookBorrow,
    ConfirmBorrowed,
    ConfirmReturned,
    GetBook
}