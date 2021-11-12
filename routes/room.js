const express = require('express'); 
const router = express.Router();
const passport = require('passport');


const roomController = require('../controllers/room_controller');

router.get('/', roomController.room);
router.get('/:room', roomController.roomid);

module.exports = router;

