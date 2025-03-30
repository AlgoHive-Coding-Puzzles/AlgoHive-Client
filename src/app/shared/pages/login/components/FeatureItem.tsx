import React, { ReactNode } from "react";

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string | ReactNode;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex items-center">
    <span className="text-xl mr-2">{icon}</span>
    <div>
      <h3 className="font-semibold">{title}</h3>
      {typeof description === "string" ? (
        <p className="text-sm">{description}</p>
      ) : (
        description
      )}
    </div>
  </div>
);

export default FeatureItem;
