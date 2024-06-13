import PropTypes from "prop-types";
import Tooltip from "./Tooltip";
import "../styles/ReviewHighlighter.css";

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "Positive":
      return "#D9F2DD";
    case "Negative":
      return "#F2DBD9";
    case "Mixed":
      return "#F2E6D9";
    case "Neutral":
      return "#F2F1D9";
    default:
      return "transparent";
  }
};

const ReviewHighlighter = ({ review }) => {
  const {
    content,
    analytics,
    reviewer_name,
    source,
    date,
    rating,
    review_url,
  } = review;

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

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review">
      <div className="review-header">
        <div className="reviewer-info">
          <img
            src={source.icon}
            alt={`${reviewer_name}'s profile`}
            className="reviewer-pic"
          />
          <div>
            <div className="reviewer-name">
              {reviewer_name}{" "}
              <small style={{ color: "#989898" }}>wrote a review at</small>{" "}
              <a href={review_url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="review-rating">{renderStars()}</div>
        <div className="review-date">
          <time dateTime={new Date(date).toISOString()}>{date}</time>
        </div>
      </div>
      <div className="review-content">
        <p>{getHighlightedText()}</p>
      </div>
    </div>
  );
};

ReviewHighlighter.propTypes = {
  review: PropTypes.shape({
    content: PropTypes.string.isRequired,
    analytics: PropTypes.arrayOf(
      PropTypes.shape({
        highlight_indices: PropTypes.arrayOf(
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          )
        ).isRequired,
        topic: PropTypes.string.isRequired,
      })
    ).isRequired,
    reviewer_name: PropTypes.string.isRequired,
    source: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    review_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewHighlighter;
