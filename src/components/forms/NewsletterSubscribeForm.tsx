"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { company } from "@/data/brandArchitecture";
import { submitLead } from "@/utils/submitLead";

type Props = {
  formClassName: string;
  inputClassName?: string;
  buttonClassName: string;
  placement: "homepage" | "footer";
};

const NewsletterSubscribeForm = ({
  formClassName,
  inputClassName,
  buttonClassName,
  placement,
}: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "submitting") return;

    try {
      setStatus("submitting");
      await submitLead({
        name: "Newsletter Subscriber",
        email: email.trim(),
        source: "onefulfillcenter.com/newsletter",
        subscribe: true,
        role: "Newsletter Subscriber",
        message: "Newsletter subscription — Subscribe Newsletter to Get Updates",
        extraLines: [
          "Type: Newsletter subscription",
          `Placement: ${placement}`,
        ],
      });
      setStatus("sent");
      setEmail("");
      toast("Thank you for subscribing! Our fulfillment team will be in touch.");
    } catch {
      setStatus("idle");
      toast(
        `Subscription failed. Email ${company.investorEmail} and we will help from there.`,
      );
    }
  };

  return (
    <form className={formClassName} onSubmit={onSubmit}>
      <input
        type="email"
        name="email"
        required
        disabled={status === "submitting"}
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-label="Email address"
        className={inputClassName}
      />
      <button
        className={buttonClassName}
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
  );
};

export default NewsletterSubscribeForm;
