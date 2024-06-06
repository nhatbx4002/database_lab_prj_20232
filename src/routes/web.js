const express = require('express');
const { getHomepage } = require('../controller/homeControler.js');
const router = express.Router();
const usersController = require('../controller/usersController.js');
router.get('/trang-chu', getHomepage);

router.get('/dang-ky', (req, res) => {
    res.render('signup.ejs');
})
router.get('/dang-nhap', (req, res) => {
    res.render('login.ejs')
})
router.get('/quen-mat-khau', (req, res) => {
    res.render('resetpassword')
})
router.post('/create-users', usersController.create_users);
router.post('/dang-nhap', usersController.login);
router.post('/reset-pwd', usersController.reset);
router.get('/gettoken', usersController.getUserInfo)
router.get('/homepage', (req, res) => {
    res.render('homepage');
})
router.get('/admin', (req, res) => {
    res.render('admin/admin_home_page')
})
router.get('/searchBookUser', (req, res) => {
    res.render('user/SearchBookUser')
})
router.get('/view-feedback', (req, res) => {
    res.render('admin/ViewFeedBack')
})
router.get('/view-user', (req, res) => {
    res.render('user/ViewUser')
})
router.get('/list-return-user', (req, res) => {
    res.render('user/ListReturnUser')
})
router.get('/list-user', (req, res) => {
    res.render('admin/ListUser')
})
router.get('/list-borrow-user', (req, res) => {
    res.render('user/ListBorrowUser')
})
router.get('/list-processing-user', (req, res) => {
    res.render('user/ListProcessingUser')
})
router.get('/list-borrow-admin', (req, res) => {
    res.render('admin/ListBorrowedUser')
})
router.get('/list-processing-admin', (req, res) => {
    res.render('admin/ListProcessingAdmin')
})

router.get('/user', (req, res) => {
    res.render('user/homepage_users')
})
router.get('/feedback', (req, res) => {
    res.render('user/feedback');
})
router.get('/listbook', (req, res) => {
    res.render('admin/listbook');
})
module.exports = router;