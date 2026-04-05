import React from "react";
import StartupCard from "../../components/startup/StartupCard";
import MilestoneCard from "../../components/milestone/MilestoneCard";
import DocumentCard from "../../components/document/DocumentCard";

const StudentDashboard = () => {
    return (
        <div>
            <h1>Student Dashboard</h1>
                <StartupCard/>
                <MilestoneCard/>
                <DocumentCard/>
        </div>
    );
};

export default StudentDashboard;