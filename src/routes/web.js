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

module.exports = router;