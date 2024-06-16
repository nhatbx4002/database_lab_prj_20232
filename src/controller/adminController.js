const pool = require('../config/database');
const session = require('express-session');
const express = require('express');
require('dotenv').config
const { getNumberBooks, getNumberUsers, getNumberBooks_Borrowed, getNumberProcess, listUsers, ViewUserInfo, GetListBookProcessing, GetListBookReturned, GetListBookBorrowed, GetAllBook, ViewInfoBook, GetAllCategory, convertEmptyToNullInObject, getTopBorrower, getTopBook } = require('../service/pageadmin.js')
const moment = require('moment');

async function adminHomepage(req, res) {
    try {
        const user = req.session.username;
        const numberBooks = await getNumberBooks();
        const numberUsers = await getNumberUsers();
        const numberBooks_Borrowed = await getNumberBooks_Borrowed();
        const numberProcess = await getNumberProcess();
        const topBorrower = await getTopBorrower();
        const topBook = await getTopBook();
        res.render('admin/admin_home_page', {
            numberBooks: numberBooks.rows[0].count,
            numberUsers: numberUsers.rows[0].count,
            numberBooks_Borrowed: numberBooks_Borrowed.rows[0].count,
            numberProcess: numberProcess.rows[0].count,
            topBorrower: topBorrower,
            topBook: topBook,
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
            user: user,
            moment: moment
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
            console.log()
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user, moment: moment });
        } else if (action === 'Borrow') {
            const result = await GetListBookBorrowed();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user, moment: moment });
        } else {
            const result = await GetListBookReturned();
            res.render('admin/ListBorrowAdmin', { listBook: result, action: action, user: user, moment: moment });
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
async function GetInfoBook(req, res) {
    try {
        const Id = req.params.Id
        const BookInfo = await ViewInfoBook(Id);
        const category = await GetAllCategory();
        // console.log(category)
        res.render('admin/ViewInfoBook', { bookinfo: BookInfo.rows[0], category: category });
    } catch (error) {
        console.error('Loi xay ra khi lay sach :', error)
        res.status(500).send('Co loi xay ra');
    }
}
async function UpdateBookInfo(req, res) {
    try {
        const { bookid, name, author, category, publisher, total, current } = convertEmptyToNullInObject(req.body);
        const query = `
           UPDATE book 
           SET name = $2 , 
               author = $3 , 
               category = $4, 
               publisher = $5, 
               total = $6 , 
               current = $7
            WHERE id = $1 
        `;
        const result = await pool.query(query, [bookid, name, author, category, publisher, total, current]);
        res.redirect(`/webtruyen/AdminViewBook/${bookid}`);
    } catch (error) {
        console.error('Error occurred while updating book info:', error);
        res.status(500).send('An error occurred');
    }
}
async function GetCreateBook(req, res) {
    try {
        const category = await GetAllCategory();
        res.render('admin/create_book', { category: category })
    } catch ({ error }) {
        console.error('Error occurred while updating book info:', error);
        res.status(500).send('An error occurred');
    }
}
async function CreateBook(req, res) {
    try {
        const { bookid, name, author, category, publisher, total, current } = convertEmptyToNullInObject(req.body);
        // res.send(convertEmptyToNullInObject(req.body));
        const query = 'Select insert_book ($1,$2,$3,$4,$5,$6,$7)';
        const result = await pool.query(query, [bookid, name, author, category, publisher, total, current]);
        res.redirect('/webtruyen/CreateBook');
    } catch (error) {
        console.error('Error occurred while insert book:', error);
        res.status(500).send('An error occurred');
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
    GetBook,
    GetInfoBook,
    UpdateBookInfo,
    GetCreateBook,
    CreateBook
}