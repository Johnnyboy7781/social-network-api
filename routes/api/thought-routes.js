const router = require('express').Router();
const {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought } = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getThoughts)
    .post(createThought);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought);

router
    .route('/:id/:userId')
    .delete(deleteThought);

module.exports = router;