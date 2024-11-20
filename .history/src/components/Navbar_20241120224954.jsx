import React from "react";

const Navbar = () => {
  return (
    <div className=" text-blue-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-orange-600 russo-one-regular font-bold">
          Word Connect Game
        </h1>
        <div className="flex text-4xl space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-solid fa-code"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
      {/* Add more content here if needed */}
    </div>
  );
};

export default Navbar;
