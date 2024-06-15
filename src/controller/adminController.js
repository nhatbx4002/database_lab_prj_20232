const pool = require('../config/database');
const session = require('express-session');
const express = require('express');
require('dotenv').config
const { getNumberBooks, getNumberUsers, getNumberBooks_Borrowed, getNumberProcess, listUsers, ViewUserInfo, GetListBookProcessing, GetListBookReturned, GetListBookBorrowed } = require('../service/pageadmin.js')
const moment = require('moment');

async function adminHomepage(req, res) {
    try {
        const numberBooks = await getNumberBooks();
        const numberUsers = await getNumberUsers();
        const numberBooks_Borrowed = await getNumberBooks_Borrowed();
        const numberProcess = await getNumberProcess();


        res.render('admin/admin_home_page', {
            numberBooks: numberBooks.rows[0].count,
            numberUsers: numberUsers.rows[0].count,
            numberBooks_Borrowed: numberBooks_Borrowed.rows[0].count,
            numberProcess: numberProcess.rows[0].count,

        });
    } catch (error) {
        console.error('Lỗi khi lấy số lượng sách:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
async function adminViewUser(req, res) {
    try {
        const userList = await listUsers();
        res.render('admin/ListUser', {
            userList: userList,
        }); // Truyền dữ liệu vào view
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).send('Có lỗi xảy ra');
    }
}
async function adminViewUserInfo(req, res) {
    try {
        const username = req.params.username;
        const userinfo = await ViewUserInfo(username);
        res.render('admin/ViewUser', {
            userinfo: userinfo.rows[0]
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
        const action = req.params.action;
        // console.log(action);
        if (action === 'Processing') {
            const result = await GetListBookProcessing();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action });
        } else if (action === 'Borrow') {
            const result = await GetListBookBorrowed();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action });
        } else {
            const result = await GetListBookReturned();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action });
        }
    } catch (error) {
        console.error('Loi xay ra khi lay danh sach  :', error)
        res.status(500).send('Co loi xay ra');
    }
}
module.exports = {
    adminHomepage,
    adminViewUser,
    adminViewUserInfo,
    adminDeleteUSer,
    getBookBorrow
}