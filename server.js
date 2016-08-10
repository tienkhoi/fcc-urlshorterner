var mongoose = require('mongoose');
var express = require('express');
var app = express();
var url = "mongodb://localhost:27017/mongodb";
var port = process.env.PORT || 8080;

mongoose.connect(url);


var urlSchema = mongoose.Schema({
    _id: Number,
    original_url: String,
    short_url: String
})
var URL = mongoose.model('URL', urlSchema);



app.get("/new/:url*", function(req, res) {

    inputUrl = (req.url.slice(5))

    if (validURL(inputUrl)) {
        var urlObj = saveNewUrl(inputUrl,req, res);
        // return urlObj;
    }
    else {
        res.json({
            error: "Url is not valid"
        })

    }

})

app.get("/:id",function(req,res){
    urlId = req.params.id
    
    URL.findOne({_id:urlId},function(err,urlObj){
        
         if (err){
             return res.json({
                error: "Url is not available"
             })
         }
        
        res.redirect(urlObj.original_url)
    })
})


function validURL(str) {
    var pattern = new RegExp('(http|https)(:){1}(\/\/){1}(\w*|\d*[\.?])+', 'ig'); // fragment locator
    return pattern.test(str);
}

function saveNewUrl(url,req, res) {
    
    var id = generateId();
    
    var newUrl  = new URL({original_url:url, short_url:"https://"+req.headers.host+"/"+id, _id:id});

    //Save and Return
    newUrl.save(function(err,newUrl){
        if (err) throw err;
        res.json(newUrl)
    })
   
}


function generateId(callback) {
   return parseInt(Math.random() * 1000000);
};


app.listen(port)