var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {

  res.redirect("/catalog"); // Esto se debe de poner en comillas dobles, porque de lo contrario, por algún motivo habrá errores
  
});

module.exports = router;
