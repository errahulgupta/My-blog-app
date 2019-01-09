var express = require("express"),
methodoverride = require("method-override"),
expresssanitizer = require("express-sanitizer"),
bodyparser = require("body-parser"),
mongoose = require("mongoose"),
app = express();

//app config
mongoose.connect('mongodb://errahul93:pasta123@ds253324.mlab.com:53324/blograhul', { useNewUrlParser: true }); 
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type:Date , default :Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//RESTful routes
app.get("/",function(req,res){
   res.redirect("/blogs"); 
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error");
        }else{
            res.render("index",{blogs:blogs}); 
        }
    });
   
});

//new route
app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});

//create route
app.post("/blogs",function(req,res){
   //create blog
   Blog.create(req.body.blog,function(err,newblog){
       if(err){
            console.log("Error");
        }else{
            res.redirect("/blogs"); 
        }
   });
});

//show route
app.get("/blogs/:id",function(req, res) {
   Blog.findById(req.params.id,function(err,foundblog){
       if(err){
            console.log("Error");
        }else{
            res.render("show",{blog:foundblog}) 
        }
   }) ;
});

//edit route
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog){
       if(err){
            console.log("Error");
        }else{
            res.render("edit",{blog:foundblog}) 
        }
   }) ;
});

//update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
        if(err){
            console.log("Error");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
            console.log("Error");
        }else{
            res.redirect("/blogs");
        }
   });
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The blogapp server has started"); 
});