const router = require('express').Router();
const Coffer = require('./sampleData.models');

router.get('/', (req, res) => {
    Coffer.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
});


module.exports = router;