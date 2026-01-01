<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Notes</title>
</head>
<body>

<h2>Notes</h2>

<textarea id="noteInput" placeholder="Write your note here..." rows="5" cols="30"></textarea>
<br><br>

<button onclick="addNote()">Save Note</button>

<ul id="notesList"></ul>

<br>
<button onclick="location.hash='home'">Back</button>

<script src="notes.js"></script>
</body>
</html>
