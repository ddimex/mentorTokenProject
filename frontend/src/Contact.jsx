import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:10000/sendContactMessage", form);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(
        "Error sending message:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="flexCol alignCenter">
      <Header />
      <div className="contact flexCol alignCenter">
        <div className="contactContainer flexCol">
          <h1 className="contactTitle font"> Let’s Talk! </h1>
          <p className="contactSubtitle font">
            We’re thrilled to connect with you! Whether you have a question,
            need assistance, or want to discuss a potential project, we’re here
            to listen and help. At Mentor Token, we believe in the power of
            collaboration and are committed to providing you with the best
            support and solutions. Fill out the form below, and one of our team
            members will get back to you as soon as possible.
            <br /> <span>Let’s create something amazing together!</span>{" "}
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="name"
              onChange={handleChange}
              value={form.name}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email adress"
              className="email"
              onChange={handleChange}
              value={form.email}
              required
            />
            <textarea
              type="text"
              name="message"
              placeholder="Your message"
              className="message"
              onChange={handleChange}
              value={form.message}
              required
            />
            <button
              type="submit"
              className="contactButton"
              style={{ cursor: "pointer" }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
