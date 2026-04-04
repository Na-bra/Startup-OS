import React from "react";

const StartupCard = ({ startup }) => {
    return (
        <div className="startup-card">
            <h3>{startup.name}</h3>
            <p>{startup.description}</p>
            <p>Industry: {startup.industry}</p>
        </div>
    );
};

export default StartupCard;