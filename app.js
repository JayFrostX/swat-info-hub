// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logged in!");
    })
    .catch(err => alert(err.message));
}

// REAL TIME POSTS
if (document.getElementById("posts")) {
  db.collection("posts").orderBy("created", "desc")
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

// CREATE POST
function createPost() {
  const content = document.getElementById("postContent").value;
  db.collection("posts").add({
    content,
    created: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// SIDEBAR REALTIME
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

function addButton() {
  const text = document.getElementById("buttonText").value;
  const link = document.getElementById("buttonLink").value;

  db.collection("sidebarButtons").add({
    text,
    link
  });
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
  document.getElementById("main").classList.toggle("collapsed");
}

function logout() {
  auth.signOut().then(() => {
    alert("Logged out");
    window.location.href = "index.html";
  });
}

// DELETE POST
function deletePost(id) {

  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  db.collection("posts").doc(id).delete()
    .then(() => {
      console.log("Post deleted");
    })
    .catch(error => {
      alert("Error deleting post: " + error.message);
    });

}
