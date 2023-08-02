const express = require('express');
const Package = require('../models/packageModel');
const router = express.Router();


router.get('/packages', async (req,res)=>{

    try {
        const packages = await Package.find({});
        if(packages.length == 0){
            return res.status(404).json({message:'No packages found', success:'false'});
        }
        res.status(200).json({success:true, data:packages});

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching packages', success: false });
    }
})

module.exports = router;