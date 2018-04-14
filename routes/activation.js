const router = require('express').Router();

router.get('/:token', (req, res) => {
    res.send('ok')
})

module.exports = router;