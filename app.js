// =======================
// LOGIN
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
      alert("Logged in!");
      window.location.href = "admin.html";
    })
    .catch(err => alert(err.message));
}


// =======================
// LOGOUT
// =======================
function logout() {
  auth.signOut().then(() => {
    alert("Logged out");
    window.location.href = "index.html";
  });
}


// =======================
// CREATE POST
// =======================
function createPost() {
  const content = document.getElementById("postContent")?.value;

  if (!content) {
    alert("Post content cannot be empty");
    return;
  }

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

  if (!text || !link) {
    alert("Fill in both fields");
    return;
  }

  db.collection("sidebarButtons").add({
    text,
    link
  });
}


// =======================
// TOGGLE SIDEBAR
// =======================
function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("collapsed");
  document.getElementById("main")?.classList.toggle("collapsed");
}


// =======================
// PAGE LOAD LISTENERS
// =======================
document.addEventListener("DOMContentLoaded", function () {

  console.log("Page loaded");

  // =======================
  // MAIN PAGE POSTS
  // =======================
  if (document.getElementById("posts")) {
    db.collection("posts")
      .orderBy("created", "desc")
      .onSnapshot(snapshot => {
        const postsDiv = document.getElementById("posts");
        postsDiv.innerHTML = "";

        snapshot.forEach(doc => {
          const post = doc.data();
          postsDiv.innerHTML += `
            <div class="post">${post.content}</div>
          `;
        });
      });
  }


  // =======================
  // MAIN PAGE SIDEBAR
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


  // =======================
  // ADMIN PANEL
  // =======================
  if (document.getElementById("adminPosts")) {

    auth.onAuthStateChanged(user => {

      if (!user) {
        window.location.href = "index.html";
        return;
      }

      console.log("Logged in as:", user.uid);

      // LOAD POSTS
      db.collection("posts")
        .orderBy("created", "desc")
        .onSnapshot(snapshot => {

          const container = document.getElementById("adminPosts");
          container.innerHTML = "";

          snapshot.forEach(doc => {
            const post = doc.data();

            container.innerHTML += `
              <div class="post">
                ${post.content}
                <br><br>
                <button onclick="deletePost('${doc.id}')">Delete</button>
              </div>
            `;
          });

        });

      // LOAD SIDEBAR BUTTONS
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

    });

  }

});


// =======================
// DELETE FUNCTIONS
// =======================
function deletePost(id) {
  if (!confirm("Delete this post?")) return;

  db.collection("posts").doc(id).delete()
    .then(() => alert("Post deleted"))
    .catch(error => alert("Delete failed: " + error.message));
}

function deleteButton(id) {
  if (!confirm("Delete this button?")) return;

  db.collection("sidebarButtons").doc(id).delete()
    .then(() => alert("Button deleted"))
    .catch(error => alert("Delete failed: " + error.message));
}
