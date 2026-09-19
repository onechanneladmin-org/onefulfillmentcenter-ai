"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitLead } from "@/utils/submitLead";

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Italy",
  "Ireland",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "Malaysia",
  "Japan",
  "South Korea",
  "China",
  "Hong Kong",
  "New Zealand",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Israel",
  "Turkey",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Poland",
  "Portugal",
  "Greece",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Philippines",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Other",
];

const schema = yup
  .object({
    name: yup.string().required().label("Name"),
    email: yup.string().required().email().label("Email"),
    phone: yup.string().required().label("Phone Number"),
    company: yup.string().required().label("Company Name"),
    website: yup.string().default("").label("Website"),
    country: yup.string().required().label("Country"),
    role: yup.string().default("").label("Role"),
    message: yup.string().required().label("Message"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const RequestDemoForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { country: "United States" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await submitLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        country: data.country,
        role: data.role || "Demo request",
        message: data.message,
        source: "onefulfillcenter.com/request-demo",
        extraLines: [
          "Type: Demo request",
          data.website && `Website: ${data.website}`,
          data.role && `Role: ${data.role}`,
          `Country: ${data.country}`,
        ],
      });
      toast("Demo request sent. Our team will be in touch shortly.");
      reset({ country: data.country });
    } catch {
      toast(
        "Request failed. Email sales@onefulfillcenter.com and we will help from there.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <input type="text" placeholder="Name" {...register("name")} />
            <span>
              <i className="fa-light fa-user"></i>
            </span>
            <p className="form_error">{errors.name?.message}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <input type="text" placeholder="Email" {...register("email")} />
            <span>
              <i className="fa-light fa-envelope"></i>
            </span>
            <p className="form_error">{errors.email?.message}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <input type="text" placeholder="Phone Number" {...register("phone")} />
            <span>
              <i className="fa-light fa-phone"></i>
            </span>
            <p className="form_error">{errors.phone?.message}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <input type="text" placeholder="Company Name" {...register("company")} />
            <span>
              <i className="fa-light fa-building"></i>
            </span>
            <p className="form_error">{errors.company?.message}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <input
              type="text"
              placeholder="Website (https://example.com)"
              {...register("website")}
            />
            <span>
              <i className="fa-light fa-globe"></i>
            </span>
            <p className="form_error">{errors.website?.message}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="tp-contact-details-form-input mb-20">
            <select className="oc-demo-form-select" {...register("country")}>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <span>
              <i className="fa-light fa-flag"></i>
            </span>
            <p className="form_error">{errors.country?.message}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="tp-contact-details-form-input mb-20">
            <input
              type="text"
              placeholder="What is your role? e.g. Operations Manager, Supply Chain Lead"
              {...register("role")}
            />
            <span>
              <i className="fa-light fa-briefcase"></i>
            </span>
            <p className="form_error">{errors.role?.message}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="tp-contact-details-form-input mb-20">
            <textarea
              placeholder="Tell us about your fulfillment needs — B2B/B2C volume, channels, warehousing, FBA prep, returns, or integrations"
              {...register("message")}
            ></textarea>
            <span>
              <i className="fa-light fa-pen"></i>
            </span>
            <p className="form_error">{errors.message?.message}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="tp-contact-details-form-btn">
            <button className="tp-btn oc-demo-btn" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request a Demo"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RequestDemoForm;
