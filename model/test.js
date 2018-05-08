
var userschema = new Schemaa({
    username:String,
    password:String,
    full_name:String
});

var users = mongoose.model("user",userschema);
var dileep = new users({
    username:'Dileep57',
    password:"meena",
    full_name:"Dileep meena"
});

dileep.save(function (err) {
    console.log("DONE");
})