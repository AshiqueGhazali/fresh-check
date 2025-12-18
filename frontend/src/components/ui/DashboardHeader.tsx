import React from "react";

const DashboardHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold leading-2.5 md:leading-5 text-[#047857]">{title}</h2>
      <p className="text-gray-600 text-[12px] md:text-[16px] mt-2">{description}</p>
    </div>
  );
};

export default DashboardHeader;
