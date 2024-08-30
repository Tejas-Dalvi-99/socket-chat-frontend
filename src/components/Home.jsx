import { useState } from "react";
import "./Home.scss";

function Home() {

  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      localStorage.setItem("name", name);
      window.location.href = "/chat";
    } else{
        alert("Please enter your name");
    }
  }

  return (
    <div className="home">
      <form onSubmit={handleSubmit}>
        <h1>Enter Your Name</h1>
        <input
          type="text"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
