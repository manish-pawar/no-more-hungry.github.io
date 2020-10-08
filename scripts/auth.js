let user1 = "";

auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.data().type_user == "donar") {
          db.collection("Donations")
            .where("userid", "==", user.uid)

            .onSnapshot((snapshot) => {
              seeDonations(snapshot.docs);
              checkLogin(user);
            });
        } else {
          if (doc.data().type_user == "NGO") {
            db.collection("Donations")
              .where("city", "==", doc.data().org_city)
              .where("state", "==", doc.data().org_state)
              .onSnapshot((snapshot) => {
                giveDonations(snapshot.docs);
                checkLogin(user);
              });
          } else {
            giveDonations([]);
          }
        }
      });
    user1 = user;
  } else {
    seeDonations([]);
    checkLogin();
  }
});

const donateForm = document.querySelector("#donate-form");
donateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = "";
  let state = "";
  let name = "";
  let dngoid = "";
  let dstatus = "pending";
  db.collection("users")
    .doc(user1.uid)
    .get()
    .then((doc) => {
      city = doc.data().org_city;
      state = doc.data().org_state;
      name = doc.data().org_name;

      db.collection("Donations")
        .add({
          userid: user1.uid,
          food: donateForm.qun.value,
          desc: donateForm.desc.value,
          from: name,
          city: city,
          state: state,
          ngoid: dngoid,
          status: dstatus,
          timeofdonation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          const modal = document.querySelector("#modal-create");
          M.Modal.getInstance(modal).close();
          donateForm.reset();
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
});
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const org_type = document.getElementById("typeo").checked;
  if (org_type) {
    type_of_user = "NGO";
  } else {
    type_of_user = "donar";
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        org_name: signupForm["org_name"].value,
        org_city: signupForm["org_city"].value,
        org_state: signupForm["org_state"].value,
        org_add: signupForm["org_add"].value,
        type_user: type_of_user,
      });
    })
    .then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    // console.log("user signed out");
  });
});

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);

    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
