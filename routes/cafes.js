const express = require('express');
const router = express.Router();
const { validateCafe, ensureLogin, ensureAuthor } = require('../middleware');
const cafes = require('../controllers/cafes');

const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage}); // specifying multer to store in cloudinary


// BASE URL = /CAFES

router.route('/')
    .get(cafes.index)
    .post(ensureLogin, upload.array('image'), validateCafe, cafes.new);


router.get('/new', ensureLogin, cafes.newForm);

router.get('/s', cafes.search);

router.route('/:id')
    .get(cafes.details)
    .patch(ensureLogin, ensureAuthor, upload.array('image'), validateCafe, cafes.edit)
    .delete(ensureLogin, ensureAuthor, cafes.delete);

router.get('/:id/edit', ensureLogin, ensureAuthor, cafes.editForm);



module.exports = router;