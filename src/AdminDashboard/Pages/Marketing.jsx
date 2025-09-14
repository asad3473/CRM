import React from "react";
import CampaignsPage from "../Components/Marketing/CampaignsPage"; // adjust the path if needed
import TemplatesPage from "../Components/Marketing/TemplatesPage";
import AudiencesTagsPage from "../Components/Marketing/AudiencesTagsPage";

const Marketing = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Marketing Section</h1>
      <CampaignsPage />
      <TemplatesPage/>
      <AudiencesTagsPage/>
    </div>
  );
};

export default Marketing;
