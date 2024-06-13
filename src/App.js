import React from "react";
import ReviewList from "./components/ReviewList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1 style={{ color: "gray" }}>Reviews</h1>
      <ReviewList />
    </div>
  );
}

export default App;
