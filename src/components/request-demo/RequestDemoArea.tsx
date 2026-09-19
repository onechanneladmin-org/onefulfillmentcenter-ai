import RequestDemoForm from "../forms/RequestDemoForm";
import { company } from "@/data/brandArchitecture";

const demo_content = {
  sub_title: "Request a Demo",
  title: "See OneFulfillCenter in action",
  info: "Complete this form and one of our fulfillment specialists will reach out to discuss your omni-channel, B2B, and B2C requirements.",
  points: [
    "Walkthrough tailored to your catalog, channels, and warehouse footprint",
    "Covers distributed warehousing, WMS, shipping, returns, and marketplace integrations",
    "No commitment — get pricing and rollout guidance for your team",
  ],
};

const RequestDemoArea = () => {
  return (
    <section className="contact-area oc-request-demo-area pt-115 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-6">
            <div className="tp-contact-main mb-40">
              <div className="tp-section tp-section-two mb-25">
                <span className="tp-section-sub-title">
                  <i className="flaticon-edit"></i>
                  {demo_content.sub_title}
                </span>
                <h4 className="tp-section-title">{demo_content.title}</h4>
                <div className="tp-section-title-wrapper">
                  <p>{demo_content.info}</p>
                </div>
              </div>
              <ul className="oc-demo-points">
                {demo_content.points.map((point, i) => (
                  <li key={i}>
                    <i className="fa-light fa-circle-check"></i>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="tp-contact-location-wrap d-flex align-items-center">
                <div className="tp-contact-location">
                  <span className="tp-contact-location-title">Prefer to talk?</span>
                  <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
                    <i className="fa-light fa-phone"></i>
                    {company.phone}
                  </a>
                  <a href={`mailto:${company.investorEmail}`}>
                    <i className="fa-light fa-envelope"></i>
                    {company.investorEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="offset-xl-1 col-xl-6 col-lg-6">
            <div className="tp-contact-details-form mb-40">
              <RequestDemoForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestDemoArea;
