import { useState, useEffect } from "react";
import ReviewHighlighter from "./ReviewHighlighter";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviewsData.json")
      .then((response) => response.json())
      .then((data) => setReviews(data));
  }, []);

  return (
    <div>
      {reviews.map((review, index) => (
        <ReviewHighlighter key={index} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
