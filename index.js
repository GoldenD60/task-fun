// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC4lHFlIJxiYmDCIyEwS92Yu2htbHh8qHk",
  authDomain: "task-fun.firebaseapp.com",
  projectId: "task-fun",
  storageBucket: "task-fun.appspot.com",
  messagingSenderId: "190105616498",
  appId: "1:190105616498:web:522af9a79d7707d33242eb",
  measurementId: "G-XKLLZSL6FL"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
var db = firebase.firestore();

// Reference the score collection
var scoresRef = db.collection("scores");

// Add a new score document
function addScore(name, score) {
    scoresRef.add({
        name: name,
        score: score
    });
}

// Display the leaderboard
function displayLeaderboard() {
    scoresRef.orderBy("score", "desc").limit(10).onSnapshot(function(snapshot) {
        var leaderboardList = document.getElementById("leaderboardList");
        leaderboardList.innerHTML = ""; // Clear previous entries
        snapshot.forEach(function(doc) {
            var data = doc.data();
            var listItem = document.createElement("li");
            listItem.textContent = data.name + " - " + data.score;
            leaderboardList.appendChild(listItem);
        });
    });
}

// Handle form submission
var scoreForm = document.getElementById("scoreForm");
scoreForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var nameInput = document.getElementById("nameInput");
    var name = nameInput.value;
    nameInput.value = ""; // Clear the input field
    addScore(name, 1); // Increase score by 1
});

// Display the leaderboard initially
displayLeaderboard();
