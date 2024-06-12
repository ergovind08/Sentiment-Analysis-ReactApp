import React from "react";
import Tooltip from "./Tooltip";
import "./ReviewHighlighter.css";

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "Positive":
      return "#D9F2DD";
    case "Negative":
      return "#F2DBD9";
    case "Mixed":
      return "#e8bd6d3d";
    case "Neutral":
      return "#eaf09b6b";
    default:
      return "transparent";
  }
};

const ReviewHighlighter = ({ review }) => {
  const { content, analytics } = review;

  const getHighlightedText = () => {
    let parts = [];
    let lastIndex = 0;

    analytics.forEach((item, idx) => {
      item.highlight_indices.forEach((indexPair, index) => {
        const [start, end, sentiment] = indexPair;

        if (start > lastIndex) {
          parts.push(content.slice(lastIndex, start));
        }

        parts.push(
          <span
            key={`${idx}-${index}`}
            className="highlight"
            data-sentiment={sentiment}
            style={{ backgroundColor: getSentimentColor(sentiment) }}
          >
            {content.slice(start, end)}
            <Tooltip topic={item.topic} />
          </span>
        );

        lastIndex = end;
      });
    });

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="review">
      <h4>{review.reviewer_name}</h4>
      <p>{getHighlightedText()}</p>
      <small>{review.date}</small>
    </div>
  );
};

export default ReviewHighlighter;
