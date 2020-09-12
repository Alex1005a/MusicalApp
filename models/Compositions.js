const mongoose = require('mongoose');

const { Schema } = mongoose;

const CompositionSchema = new Schema({
    url: String,
    userId: String,
    compositionName: String,
});

CompositionSchema.methods.setUserId = function(id) {
    this.userId = id;
};
CompositionSchema.methods.setCompositionName = function(name) {
    this.compositionName = name;
};
CompositionSchema.methods.setUrl = function(url) {
    this.url = url;
};

mongoose.model('Compositions', CompositionSchema);