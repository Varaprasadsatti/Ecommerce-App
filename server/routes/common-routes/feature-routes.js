const express = require("express")

const {addFeatureImage,getFeatureImages,deleteFeatureImage} = require("../../controllers/common-controllers/feature-controller")

const router = express.Router();

router.post("/add",addFeatureImage);
router.get("/get",getFeatureImages);
router.delete("/delete/:id",deleteFeatureImage);

module.exports = router;