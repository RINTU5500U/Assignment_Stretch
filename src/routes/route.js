const express = require("express")
const router = express.Router()

const {createStudent, login, updateUser, deleteUser, fetchUser, fetchUserByFilter} = require('../controllers/studentController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/createStudent', createStudent)
router.post('/login', login)
router.get('/fetchUser', fetchUser)
router.get('/fetchUserByFilter', fetchUserByFilter)
router.put('/updateUser/:userId', authentication, authorization, updateUser)
router.delete('/deleteUser/:userId', authentication, authorization, deleteUser)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router