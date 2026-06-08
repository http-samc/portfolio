import { MailIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Socials = () => {
  return (
    <div className="mx-auto py-4 w-fit flex space-x-8 items-center">
      <Link
        href="https://x.com/http_samc"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-all hover:!text-purple-800 dark:hover:!text-purple-400"
      >
        <FaXTwitter size={24} />
      </Link>
      <Link
        href="https://github.com/http-samc"
        target="_blank"
        className="!text-gray-600 dark:!text-white hover:!text-purple-800 dark:hover:!text-purple-400 opacity-80 hover:opacity-100 transition-all"
      >
        <FaGithub size={24} />
      </Link>
      <Link
        href="https://www.linkedin.com/in/iamsamc/"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-all hover:!text-purple-800 dark:hover:!text-purple-400"
      >
        <FaLinkedin size={24} />
      </Link>
      <Link
        href="mailto:snc62@cornell.edu"
        target="_blank"
        className="!text-gray-600 dark:!text-white opacity-80 hover:opacity-100 transition-all hover:!text-purple-800 dark:hover:!text-purple-400"
      >
        <MailIcon />
      </Link>
    </div>
  );
};

export default Socials;
