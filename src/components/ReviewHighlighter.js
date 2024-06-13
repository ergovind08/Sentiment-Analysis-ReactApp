import React from "react";
import PropTypes from "prop-types";
import { FaRegBookmark, FaEllipsisV } from "react-icons/fa";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import Tooltip from "./Tooltip";
import "../styles/ReviewHighlighter.css";
import { CiMenuKebab } from "react-icons/ci";

const SENTIMENT_COLORS = {
  Positive: "#D9F2DD",
  Negative: "#F2DBD9",
  Mixed: "#F2E6D9",
  Neutral: "#F2F1D9",
  default: "transparent",
};

const getSentimentColor = (sentiment) =>
  SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.default;

const ReviewHighlighter = ({ review }) => {
  const {
    content,
    analytics,
    reviewer_name,
    source,
    date,
    review_url,
    rating_review_score,
    out_of,
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
    const filledStars = Math.round((rating_review_score / out_of) * 5);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= filledStars ? "filled" : ""}`}
          style={{ color: i <= filledStars ? "#FEBE10" : "gray" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <article className="review">
      <header className="review-header">
        <div className="reviewer-info">
          <img
            src={source.icon}
            alt={`${reviewer_name}'s profile`}
            className="reviewer-pic"
          />
          <div>
            <h4 className="reviewer-name">
              {reviewer_name}
              <small style={{ color: "#989898" }}> wrote a review at </small>
              <a href={review_url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
            </h4>
          </div>
        </div>
        <div className="review-icons">
          <MdOutlinePersonAddAlt1 size={24} style={{ margin: "0 5px" }} />
          <FaRegBookmark size={24} style={{ margin: "0 5px" }} />
          <CiMenuKebab
            size={24}
            style={{ margin: "0 5px", transform: "rotate(90deg)" }}
          />{" "}
        </div>
      </header>
      <section
        className="review-details"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="review-rating">{renderStars()}</div>
        <time className="review-date" dateTime={new Date(date).toISOString()}>
          {date}
        </time>
      </section>
      <section className="review-content">
        <p>{getHighlightedText()}</p>
      </section>
    </article>
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
    review_url: PropTypes.string.isRequired,
    rating_review_score: PropTypes.number.isRequired,
    out_of: PropTypes.number.isRequired,
  }).isRequired,
};

export default ReviewHighlighter;
