let bookmarks = [];
let adding = false;
let editing = null;
let filter = 1;
let error = null;

function findById(id){
  let foundBookmark = this.bookmarks.find(bookmark => bookmark.id === id);
  return foundBookmark;
}

function addBookmark(newBookmark){
  newBookmark.expanded = false;
  this.bookmarks.push(newBookmark);
}


function editBookmark(id, data){
  let foundBookmark = this.findById(id);
  let parsed = JSON.parse(data);
  Object.assign(foundBookmark, parsed);
}

function deleteBookmark(id){
  let foundBookmark = this.findById(id);
  this.bookmarks.splice(this.bookmarks.indexOf(foundBookmark), 1);
}

export default {
  bookmarks,
  adding,
  editing,
  filter,
  error,
  findById,
  addBookmark,
  editBookmark,
  deleteBookmark
};