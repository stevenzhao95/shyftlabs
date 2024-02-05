import { Link } from "react-router-dom";

export const HomeButton = () => {
  return (
    <Link to="/">
      <button className="homeButton" to="/">
        HOME
      </button>
    </Link>
  );
};
