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

export default {
  bookmarks,
  adding,
  filter,
  error,
  addBookmark,
  findById
};