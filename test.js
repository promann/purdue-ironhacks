const Mongoose = require("mongoose");
Mongoose.Promise = Promise;
Mongoose.connect("mongodb://localhost/test", (err, db) => {

    console.log(err);
    // => undefined
    //    (success)

    // Create the model
    const t = Mongoose.model("t", {
        s: "string"
    });

    // Do something pre save
    t.schema.post('save', function(next) {
        // This is not triggered
        console.log(">>>>>>>>>>>>>");
        console.log(this);
        //next();
    });

    // Insert a new object
    new t({ s: "foo" }).save((err, data) => {
        console.log(err, data);
    });
});
