import React from "react";
import "../styles/Tooltip.css";

const Tooltip = ({ topic }) => {
  return (
    <span className="tooltip">
      {topic}
      <span className="tooltiptext">{topic}</span>
    </span>
  );
};

export default Tooltip;
