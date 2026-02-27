// =======================
// ADMIN LOGIN
// =======================
function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch(err => alert(err.message));
}


// =======================
// LOGOUT (ADMIN)
// =======================
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}


// =======================
// CREATE POST
// =======================
function createPost() {
  const content = document.getElementById("postContent")?.value;
  if (!content) return alert("Post content cannot be empty");

  db.collection("posts").add({
    content,
    created: firebase.firestore.FieldValue.serverTimestamp()
  });
}


// =======================
// ADD SIDEBAR BUTTON
// =======================
function addButton() {
  const text = document.getElementById("buttonText")?.value;
  const link = document.getElementById("buttonLink")?.value;
  if (!text || !link) return alert("Fill in both fields");

  db.collection("sidebarButtons").add({ text, link });
}


// =======================
// DELETE FUNCTIONS
// =======================
function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  db.collection("posts").doc(id).delete();
}

function deleteButton(id) {
  if (!confirm("Delete this button?")) return;
  db.collection("sidebarButtons").doc(id).delete();
}


// =======================
// COMMUNITY LOGIN SYSTEM
// =======================
function openLoginModal() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

function communityLogin() {
  const email = document.getElementById("communityEmail").value;
  const password = document.getElementById("communityPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {

      if (!userCredential.user.emailVerified) {
        alert("Verify your email first.");
        auth.signOut();
        return;
      }

      closeLoginModal();
    })
    .catch(error => alert(error.message));
}

function communityRegister() {
  const email = document.getElementById("communityEmail").value;
  const password = document.getElementById("communityPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      userCredential.user.sendEmailVerification()
        .then(() => {
          alert("Verification email sent. Check inbox.");
          auth.signOut();
        });
    })
    .catch(error => alert(error.message));
}

function communityLogout() {
  auth.signOut();
}


// =======================
// PAGE LOAD
// =======================
document.addEventListener("DOMContentLoaded", function () {

  console.log("Page loaded");

  // =======================
  // GLOBAL AUTH LISTENER
  // =======================
  auth.onAuthStateChanged(user => {

    const isAdminPage = document.getElementById("adminPosts");
    const loginBtn = document.getElementById("communityLoginBtn");
    const profileBox = document.getElementById("userProfile");

    // =======================
    // ADMIN PAGE PROTECTION
    // =======================
    if (isAdminPage) {
      if (!user) {
        window.location.href = "index.html";
        return;
      }

      loadAdminData();
    }

    // =======================
    // COMMUNITY PROFILE UI
    // =======================
    if (loginBtn) {
      if (user && user.emailVerified) {
        loginBtn.style.display = "none";
        profileBox.style.display = "block";
        document.getElementById("userEmail").innerText = user.email;
      } else {
        loginBtn.style.display = "block";
        profileBox.style.display = "none";
      }
    }

  });


  // =======================
  // LOAD MAIN PAGE POSTS
  // =======================
  if (document.getElementById("posts")) {
    db.collection("posts")
      .orderBy("created", "desc")
      .onSnapshot(snapshot => {

        const postsDiv = document.getElementById("posts");
        postsDiv.innerHTML = "";

        snapshot.forEach(doc => {
          postsDiv.innerHTML += `
            <div class="post">${doc.data().content}</div>
          `;
        });
      });
  }


  // =======================
  // LOAD SIDEBAR
  // =======================
  if (document.getElementById("sidebar")) {
    db.collection("sidebarButtons")
      .onSnapshot(snapshot => {

        const sidebar = document.getElementById("sidebar");
        sidebar.innerHTML = "<button onclick='toggleSidebar()'>☰</button>";

        snapshot.forEach(doc => {
          const btn = doc.data();
          sidebar.innerHTML += `
            <button onclick="location.href='${btn.link}'">
              ${btn.text}
            </button>
          `;
        });
      });
  }

});


// =======================
// LOAD ADMIN DATA
// =======================
function loadAdminData() {

  db.collection("posts")
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {

      const container = document.getElementById("adminPosts");
      container.innerHTML = "";

      snapshot.forEach(doc => {
        container.innerHTML += `
          <div class="post">
            ${doc.data().content}
            <br><br>
            <button onclick="deletePost('${doc.id}')">Delete</button>
          </div>
        `;
      });
    });

  db.collection("sidebarButtons")
    .onSnapshot(snapshot => {

      const container = document.getElementById("adminButtons");
      container.innerHTML = "";

      snapshot.forEach(doc => {
        const btn = doc.data();
        container.innerHTML += `
          <div class="post">
            ${btn.text} → ${btn.link}
            <br><br>
            <button onclick="deleteButton('${doc.id}')">Delete</button>
          </div>
        `;
      });
    });
}
