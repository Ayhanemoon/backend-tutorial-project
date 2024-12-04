const router = require('express').Router();
const {getSetting, updateSetting} = require('../controllers/settingController');

//todo -> validation
router.get('/', getSetting);

router.put('/', updateSetting);
