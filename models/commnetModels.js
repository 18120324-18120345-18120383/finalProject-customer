const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const commnetShema = new Schema({
  productID: String,
  date: String,
  avatar: String,
  avatarType: String,
  name: String,
  content: String,
  rating: [Boolean]
})

commnetShema.plugin(mongoosePaginate);
const Comment = mongoose.model('comments', commnetShema);

module.exports.addCommnet = async(data, user) => {
  let name = data.name;
  const content = data.content;
  const rating = data.rating;
  const productID = data.productID;
  let avatar = null;
  let avatarType = null;
  let dateObj = new Date();
  let myDate = (dateObj.getDate()) + "/" + (dateObj.getMonth() + 1) + "/" + (dateObj.getUTCFullYear());
  if (user) {
    avatar = user.avatar;
    avatarType = user.avatarType
    name = user.username;
  }
  const comment = new Comment();
  comment.productID = productID;
  comment.content = content;
  comment.avatar = avatar;
  comment.avatarType = avatarType;
  comment.date = myDate;
  let rate = []
  for(let i = 0; i < 5; i++) {
    if(i < rating) {
      rate.push(true);
    }
    else {
      rate.push(false);
    }
  }
  comment.rating = rate;
  comment.name = name;
  await comment.save();
  return comment;
}

module.exports.listComment = async(productID, pageNumber, itemPerPage) => {
  const filter = {productID: productID};
  let comments = await Comment.paginate(filter, {
    page: pageNumber,
    limit: itemPerPage
  });
  if (comments) {
    return comments;
  }
  return false;
}