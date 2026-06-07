import Image from "next/image";
import React from "react";

type Affiliates = "YCombinator" | "General Catalyst" | "a16z";

const AFFILIATE_LOOKUP: Record<Affiliates, string> = {
  YCombinator:
    "https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg",
  "General Catalyst":
    "https://media.licdn.com/dms/image/v2/D4E0BAQERYnF8X59-HA/company-logo_200_200/company-logo_200_200/0/1729764250620/general_catalyst_logo?e=2147483647&v=beta&t=X3SGbG8fOHdUBUEFwRn5lySLG-Iz0JRyReN1dilbAO8",
  a16z: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRenltFJ95Hc108dDbvoyLDsyQzrwRIpXniXg&s",
};

interface ExperienceProps {
  company: string;
  title: string;
  logoUrl: string;
  affiliates: Affiliates[];
  backgroundColor?: string;
  padding?: number;
}

const Experience = ({
  company,
  title,
  logoUrl,
  affiliates = [],
  ...styles
}: ExperienceProps) => {
  return (
    <div className="flex items-center space-x-4 not-prose">
      <div
        className="relative w-12 aspect-square rounded-lg overflow-hidden"
        style={styles}
      >
        <Image
          src={logoUrl}
          alt={company}
          fill
          sizes="20vw"
          draggable={false}
        />
      </div>
      <div className="flex flex-col justify-start">
        <p className="dark:text-gray-200 text-gray-700 font-semibold">
          {title}
        </p>
        <div className="flex justify-between items-center w-full -mt-1">
          <p className="">{company}</p>
          <div className="flex gap-2">
            {affiliates.map((affiliate) => (
              <img
                key={affiliate}
                src={AFFILIATE_LOOKUP[affiliate]}
                className="object-contain"
                draggable={false}
                style={{ width: "1.25rem", height: "1.25rem" }}
                alt={`${affiliate} logo`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
