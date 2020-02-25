const BASE_URL = 'https://thinkful-list-api.herokuapp.com/malcolmkiano/bookmarks';


function doFetch(...params){
  let error;
  return fetch(...params)
    .then(res => {
      if (!res.ok) error.code = res.status;
      if (!res.headers.get('content-type').includes('json')) {
        error.message = res.statusText;
        return Promise.reject(error);
      }

      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
      }

      return data;
    });
}

function getItems(){
  return doFetch(BASE_URL);
}

function addItem(newItem){
  return doFetch(BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: newItem
  });
}

function deleteItem(id){
  return doFetch(BASE_URL + '/' + id, {
    method: 'DELETE'
  });
}

export default {
  getItems,
  addItem,
  deleteItem
};