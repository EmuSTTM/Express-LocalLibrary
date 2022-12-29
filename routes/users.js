var express = require('express');
var router = express.Router();

/* GET users listing. */
/* Esta ruta llama a un MiddleWare en vez de un callback, porque si en algun
    momento queremos extender el código, y queremos que varios archivos esten
    en esta misma ruta y con el verbo get. Este podrá pasar al siguiente verbo
    una vez termina de procesarse. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Esta parte es del "Challenge yourself" de la primera parte
router.get('/cool', function(req,res){
  res.send("you're so cool");
})

module.exports = router;
