const donationsList = document.querySelector(".donations");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
let user2 = "";
const checkLogin = (user) => {
  if (user) {
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
    user2 = user;
  } else {
    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

const takedonation = (id) => {
  let ngo_name = "";
  db.collection("users")
    .doc(user2.uid)
    .get()
    .then((doc) => {
      ngo_name = doc.data().org_name;
      db.collection("Donations").doc(id).update({
        status: "Donated",
        ngoid: ngo_name,
      });
    });
};
const giveDonations = (data) => {
  if (data.length) {
    let html = "";
    html += `
    <div class="center-align ">
    
    
    <h3>Donations</h3>
   
    
   
   
  </div>`;

    data.forEach((doc) => {
      const don = doc.data();
      if (don.status == "pending") {
        const food = `
        <div class="col l4 s12">
        <div class="card ">
        <div class="card-content ">
        <p> ${don.food} </p>
        <p> ${don.desc} </p>
        <p>Donated by - ${don.from} </p><p>From- ${don.city} </p>
        
        <a class="waves-effect waves-light btn donbtn"  onclick='takedonation("${doc.id}")'>Take donation</a>
        </div>
       
       
      </div></div>
        `;
        html += food;
      } else {
        const food = `

        <div class="col l4 s12">
        <div class="card blue darken-1">
        <div class="card-content  white-text">
        <p>Donated</p>
        <p> ${don.food} </p>
        <p> ${don.desc} </p>
        <p>Donated by - ${don.from} </p><p>From- ${don.city} </p>
        </div>
       
       
      </div></div>
        `;
        html += food;
      }
    });

    donationsList.innerHTML = html;
  } else {
    html = `<div class="card ">
      <div class="card-content ">
      <h5 class="center-align">Sorry !! we dont have any donar in Your city</h5>
      </div>
     
     
    </div>`;
    donationsList.innerHTML = html;
  }
};

const seeDonations = (data) => {
  if (data.length) {
    let html = "";
    html += `
    <div class="center-align ">
    
    
    <a class="waves-effect waves-light btn-small center-align modal-trigger" data-target="modal-create">Have Food? click here to donate</a>
   
    
   
   
  </div>`;

    data.forEach((doc) => {
      const don = doc.data();
      if (don.status == "pending") {
        let food = `
    <div class="col l4 s12">
    <div class="card ">
    <div class="card-content ">
    <p> ${don.food} </p>
    <p> ${don.desc} </p>
    <p> Status of donation -${don.status} </p>
    </div>
   
   
  </div></div>
    `;
        html += food;
      } else {
        food = `
        
        <div class="col l4 s12">
        <div class="card blue darken-1">
        <div class="card-content  white-text">
        <h5>${don.status} </h5>
        <p> ${don.food} </p>
        <p> ${don.desc} </p>
       
        <div>Ngo name - ${don.ngoid}</div>
        </div>
       
       
      </div></div>
        `;
        html += food;
      }
    });
    donationsList.innerHTML = html;
  } else {
    html = `<div class="card ">
      <div class="card-content ">
      <h5 class="center-align">Please login  to View Dashboard</h5>
      </div>
     
     
    </div>`;
    donationsList.innerHTML = html;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
