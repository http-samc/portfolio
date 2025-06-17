import React from "react";
import { TypewriterEffect } from "../ui/typewriter-effect";

const Footer = () => {
  return (
    <div className="w-full px-6">
      <footer className="my-4 border-t w-full mx-auto">
        {/* <p className="italic w-full text-center mt-4">
        made with <span className="not-italic">💙</span> &{" "}
        <span className="not-italic">☕️</span> by{" "}
        <span className="brand-gradient-text">smrth</span>
      </p> */}
        <TypewriterEffect
          className="italic w-full text-center mt-4 text-sm"
          words={[
            {
              text: "made",
            },
            {
              text: "with",
            },
            {
              text: "♥",
            },
            {
              text: "&",
            },
            {
              text: "☕️",
            },
            {
              text: "by",
            },
            {
              text: "smrth",
              className: "font-mono text-blue-400 not-italic",
            },
          ]}
          cursorClassName="-mb-1 w-0.5 bg-blue-400 text-sm h-5"
        />
      </footer>
    </div>
  );
};

export default Footer;
