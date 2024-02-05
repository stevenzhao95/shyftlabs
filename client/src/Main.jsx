import React from "react";
import { links } from "./links";

export const Main = () => {
  return (
    <nav className="navigation">
      <div className="app-name">Student Result Management System</div>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a className="links" href={link.to} to={link.to}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
