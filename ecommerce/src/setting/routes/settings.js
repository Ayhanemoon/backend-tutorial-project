const router = require('express').Router();
const {getSetting, updateSetting} = require('../controllers/settingController');

// Get current invoice settings
router.get('/', getSetting);

// Update invoice settings
router.put('/', updateSetting);
