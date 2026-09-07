"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { submitLead } from "@/utils/submitLead";

const HomeNewsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "submitting") return;

    try {
      setStatus("submitting");
      await submitLead({
        email: email.trim(),
        source: "onefulfillcenter.com/#newsletter",
        subscribe: true,
        message: "Newsletter subscription & demo interest from OneFulfillCenter homepage",
      });
      setStatus("sent");
      setEmail("");
      toast.success("Thank you for subscribing! Our fulfillment team will be in touch.");
    } catch {
      setStatus("idle");
      toast.error("Subscription failed. Please email sales@onechanneladmin.com directly.");
    }
  };

  return (
    <section className="spatial-block home-news" id="newsletter">
      <h2>Subscribe Newsletter to Get Updates</h2>
      <form className="home-news__form" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          required
          disabled={status === "submitting"}
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email address"
        />
        <button
          className="spatial-btn spatial-btn--teal"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting"
            ? "Submitting..."
            : status === "sent"
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </form>
    </section>
  );
};

export default HomeNewsletter;
