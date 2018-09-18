const API_KEY = "81745fd0-b77e-11e8-a4d1-69890776a30b";

document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
});

function showGalleries(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    location.hash = "";
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})" id="gallery_id">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjectsTable(id) {
  url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}`;
  getObjects(url);
  document.querySelector("#all-objects").style.display = "Block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object").style.display = "none";
  location.hash = id;
}


function getObjects(url){
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(object => {
      if (object.primaryimageurl == null){
        image = "No image"
      }else{
        image = `<img src=${object.primaryimageurl}?height=150&width=150>`
      }
      people_arr = " ";
      object.people.forEach(person_info => {
        people_arr += person_info.name + " ";
      })

      document.querySelector("#objects").innerHTML += `
        <br>
        <li>
          <ul>
          <li> <a href="#${object.title}" onclick="showObjectsInfo(${object.id})"> id="title"
          <b>Title:</b> ${object.title}</a></li>
          <li><b>Page url:</b> ${object.url} </li> 
          <li><b>People:</b> ${people_arr}</li> 
          <li><b>Image:</b> ${image}</li>
        </li><br>
        </ul>
        `;
      })
      if (data.info.next) {
        getObjects(data.info.next);
      }
    })
  }

function showObjectsInfo(id){
  url = `https://api.harvardartmuseums.org/object/${id}?apikey=${API_KEY}`;
  getObjectInfo(url)
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object").style.display = "Block";
  location.hash = id
}

function getObjectInfo(url){
  fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.primaryimageurl == null){
      image = "No image"
    }else{
      image = `<img src=${data.primaryimageurl}?height=150&width=150>`
    }
    document.querySelector("#object").innerHTML += `
    <br>
        <li>
          <ul>
          <li><b>Title:</b> ${data.title}</a></li>
          <li><b>Description url:</b> ${data.description} </li> 
          <li><b>Provenance:</b> ${data.provenance}</li> 
          <li><b>Accession Year:</b> ${data.accessionyear}</li>
          <li><b>Image:</b> ${image}</li>
        </li><br>
        `;
      })
      
}

function goBack(){
  window.history.back();
  location.reload();
}

function hashChanged(){
  
}
