/* global $ */

// ===============================================================
// imports
import api from './api.js';
import store from './store.js';


// ===============================================================
// general purpose functions
function init(){
  handleAddBookmarkClick();
  handleFilterChange();
  handleBookmarkClick();
  handleBookmarkDeleteClick();
  handleBookmarkSubmit();
  handleCancelAddClick();
  handleDismissErrorClick();
  
  // get items and render
  api.getItems()
    .then(bookmarks => {
      bookmarks.forEach(bookmark => store.addBookmark(bookmark));
      render();
    })
    .catch(error => {
      store.error = error;
      render();
    });

}

function serializeJson(form){
  let rawData = new FormData(form);
  let parsed = {};
  rawData.forEach((val, name) => parsed[name] = val);
  return JSON.stringify(parsed);
}


// ===============================================================
// event listener functions
function handleAddBookmarkClick(){
  $('main').on('click', '#addBookmark', function(){
    store.adding = true;
    render();

    // focus on first input
    $('main').find('#title').focus();
  });
}

function handleFilterChange(){
  $('main').on('change', '#filter', function(e){
    let filterValue = $(e.currentTarget).val();
    store.filter = parseInt(filterValue);
    render();
  });
}

function handleBookmarkClick(){
  $('main').on('click', '.bookmark-heading', function(e){
    e.preventDefault();
    let id = $(e.currentTarget).closest('.bookmark').data('id');
    let bookmark = store.findById(id);
    bookmark.expanded = !bookmark.expanded;
    render();
  });
}

function handleBookmarkDeleteClick(){
  $('main').on('click', '.bookmark-content .delete', function(e){
    e.preventDefault();
    let id = $(e.currentTarget).closest('.bookmark').data('id');
    api.deleteItem(id)
      .then(() => {
        store.deleteBookmark(id);
        render();
      })
      .catch(error => {
        store.error = error;
        render();
      });
  });
}

function handleBookmarkSubmit(){
  $('main').on('submit', '#addForm', function(e){
    e.preventDefault();

    let form = $('main').find('#addForm')[0];
    let data = serializeJson(form);
    
    api.addItem(data)
      .then(data => {
        store.addBookmark(data);
        store.adding = false;
        render();
      })
      .catch(error => {
        store.error = error;
        render();
      });
  });
}

function handleCancelAddClick(){
  $('main').on('click', '#cancelAdd', function(e){
    e.preventDefault();
    store.adding = false;
    render();
  });
}

function handleDismissErrorClick(){
  $('main').on('click', '#closeError', function(e){
    e.preventDefault();
    store.error = null;
    render();
  });
}


// ===============================================================
// render funtion
function render(){
  let html = '';
  html += generateGreetingHTML();
  html += generateAddButtonHTML();
  html += generateBookmarksHTML(store.bookmarks, store.filter);
  html += generateAddBookmarkFormHTML();
  $('main').html(html);
}


// ===============================================================
// template generation functions
function generateGreetingHTML(){
  let greeting = 'Hello There';
  let hour = new Date().getHours();
  
  if (hour < 12) {
    greeting = 'Good Morning';
  } else if (hour < 17) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return `
  <section id="greeting">
    <h1>${greeting}!</h1>
    <p>It's a great time to surf the web.</p>
  </section>
  `;
}

function generateAddButtonHTML(){
  return `
  <section class="card card-flex">
    <article class="content">
      <h2>Found a cool link?</h2>
      <p>Let me remember that.</p>
    </article>
    <button id="addBookmark" class="btn-alt">Add bookmark</button>
  </section>
  `;
}

function generateErrorHTML(){
  return `
  <div class="error">
    <h3>Oops! Something went wrong.</h3>
    <p><strong>${store.error.code ? store.error.code + ' - ' : ''}</strong> ${store.error.message}</p>
    <a href="#" id="closeError">dismiss</a>
  </div>
  `;
}

function generateBookmarksHTML(){
  let content = generateBookmarksContentHTML();
  let filterControl = '';
  if (store.bookmarks.length > 0){
    filterControl = `
    <select name="filter" id="filter">
      <option ${store.filter === 1 ? 'selected' : ''} value="1">ALL</option>
      <option ${store.filter === 2 ? 'selected' : ''} value="2">2+ stars</option>
      <option ${store.filter === 3 ? 'selected' : ''} value="3">3+ stars</option>
      <option ${store.filter === 4 ? 'selected' : ''} value="4">4+ stars</option>
      <option ${store.filter === 5 ? 'selected' : ''} value="5">5 stars</option>
    </select>
    `;
  }

  return `
  <section class="card">
    <header>
      <h2>Bookmarks</h2>
      ${filterControl}
    </header>

    ${store.error !== null ? generateErrorHTML() : ''}

    ${content}
  </section>
  `;
}

function generateBookmarksContentHTML(){
  let html = '';
  let bookmarks = store.bookmarks.filter(bookmark => bookmark.rating >= store.filter);

  if (bookmarks.length === 0) {
    // print empty state
    html = `
    <article class="content content-empty">
      <img src="img/bookmarks-empty.svg" alt="Girl holding a book">
      <p>Nothing to see here... yet!</p>
    </article>
    `;

  } else {
    // generate each element
    bookmarks.forEach(bookmark => {

      // skip if under rating
      if (bookmark.rating < store.filter) return false;

      let starContent = '';
      for (let i = 1; i <= 5; i++){
        starContent += `
        <i class="star ${i <= bookmark.rating ? 'star-filled' : ''}"></i>
        `;
      }

      let innerContent = '';
      if (bookmark.expanded === true){
        innerContent = `
        <div class="bookmark-content">
          <p>
            ${bookmark.desc}
          </p>
          <a href="${bookmark.url}" target="_blank">Visit website</a>
          <a href="#" class="delete">Delete bookmark</a>
        </div>
        `;
      }

      html += `
      <div data-id="${bookmark.id}" class="bookmark ${bookmark.expanded === true ? 'expanded' : ''}">
        <a href="#" class="bookmark-heading">
          <h2 title="${bookmark.expanded === true ? 'Click to collapse' : 'Click to expand'}">${bookmark.title}</h2>
          <div class="rating">
            <em>${bookmark.rating} star${bookmark.rating !== 1 ? 's' : ''}</em>
            ${starContent}
          </div>
        </a>
        ${innerContent}
      </div>
      `;
    });
  }
  return html;
}

function generateAddBookmarkFormHTML(){
  let html = '';

  if (store.adding === true){
    html = `
    <section class="overlay">
      <article class="content">
        <form id="addForm" class="card">
          <header>
            <h2>Add A Bookmark</h2>
          </header>

          ${store.error !== null ? generateErrorHTML() : ''}

          <div class="group">
            <label for="title">Website Title:</label>
            <input required type="text" id="title" name="title" autocomplete="off" placeholder="The Greatest Website Ever">
          </div>
          <div class="group">
            <label for="url">Website URL:</label>
            <input required type="url" id="url" name="url" autocomplete="off" placeholder="https://omg.thegreatestwebsiteever.com">
          </div>
          <div class="group">
            <label for="desc">Website Description:</label>
            <textarea required id="desc" name="desc" rows="3" maxlength="140" placeholder="Lots and lots of text describing the website that we all know nobody will read but is important to have."></textarea>
          </div>
          <div class="group">
            <label for="rating">Rating:</label>
            <div class="star-rating">
              <input id="star5" type="radio" name="rating" value="5">
              <label for="star5" class="star"><span>5 stars</span></label>
              <input id="star4" type="radio" name="rating" value="4">
              <label for="star4" class="star"><span>4 stars</span></label>
              <input id="star3" type="radio" name="rating" value="3">
              <label for="star3" class="star"><span>3 stars</span></label>
              <input id="star2" type="radio" name="rating" value="2">
              <label for="star2" class="star"><span>2 stars</span></label>
              <input id="star1" checked type="radio" name="rating" value="1">
              <label for="star1" class="star"><span>1 star</span></label>
            </div>  
          </div>
          <div class="group group-centered">
            <button>Add bookmark</button>
            <button id="cancelAdd" class="btn-alt">Cancel</button>  
          </div>
        </form>
      </article>
    </section>
    `;
  }

  return html;
}


// ===============================================================
// DOM ready hook
$(init);
