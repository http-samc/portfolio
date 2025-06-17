import React from "react";

interface ExperienceGridProps extends React.PropsWithChildren {
  title: string;
}

const ExperienceGrid = ({ children, title }: ExperienceGridProps) => {
  return (
    <>
      <p className="italic font-medium font-serif">{title}</p>
      <div className="grid grid-r md:grid-cols-2 ml-12 gap-4 my-2">
        {children}
      </div>
    </>
  );
};

export default ExperienceGrid;
