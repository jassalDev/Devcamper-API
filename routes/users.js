const express = require('express');

const { getUser, getUsers, createUser, updateUser, deleteUser } =  require('../controller/users')

const router = express.Router({mergeParams: true});

const Users = require('../models/Users')

const advancedResults = require('../middleware/advanceResult')
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
        .get(advancedResults(Users), getUsers)
        .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);
     
module.exports = router;