import { GithubIcon, LinkedinIcon, MailIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Socials = () => {
  return (
    <div className="mx-auto py-4 w-fit flex space-x-8 items-center">
      <Link
        href="https://x.com/http_samc"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-opacity"
      >
        <TwitterIcon />
      </Link>
      <Link
        href="https://github.com/http-samc"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-opacity"
      >
        <GithubIcon />
      </Link>
      <Link
        href="https://www.linkedin.com/in/iamsamc/"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-opacity"
      >
        <LinkedinIcon />
      </Link>
      <Link
        href="mailto:snc62@cornell.edu"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-opacity"
      >
        <MailIcon />
      </Link>
    </div>
  );
};

export default Socials;
