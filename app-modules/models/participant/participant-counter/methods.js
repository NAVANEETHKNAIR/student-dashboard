module.exports = schema => {

  schema.statics.increaseAndGetCounter = function(courseId) {
    return this.findByIdAndUpdate(courseId, { $inc: { value: 1 } }, { upsert: true, new: true })
      .then(doc => doc.value);
  }

}
