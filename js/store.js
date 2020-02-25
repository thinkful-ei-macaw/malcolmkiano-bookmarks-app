let bookmarks = [];
let adding = false;
let filter = 1;
let error = null;

function addBookmark(newBookmark){
  newBookmark.expanded = false;
  this.bookmarks.push(newBookmark);
}

function findById(id){
  let foundBookmark = this.bookmarks.find(bookmark => bookmark.id === id);
  return foundBookmark;
}

function deleteBookmark(id){
  let foundBookmark = this.findById(id);
  this.bookmarks.splice(this.bookmarks.indexOf(foundBookmark), 1);
}

export default {
  bookmarks,
  adding,
  filter,
  error,
  addBookmark,
  findById,
  deleteBookmark
};