"use client";

import Image from "next/image";
import Link from "next/link";
import { company, socialLinks } from "@/data/brandArchitecture";
import { SERVICE_NAV } from "@/data/ofcNav";
import NewsletterSubscribeForm from "@/components/forms/NewsletterSubscribeForm";

const phoneTel = `tel:${company.phone.replace(/[^+\d]/g, "")}`;

const FOOTER_COLS = [
  {
    title: "Fulfillment",
    links: SERVICE_NAV.slice(0, 6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "More services",
    links: SERVICE_NAV.slice(6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "Get Started",
    links: [{ label: "Request a Demo", href: company.demoUrl }],
  },
  {
    title: "Contact",
    links: [
      { label: company.phone, href: phoneTel },
      { label: company.investorEmail, href: `mailto:${company.investorEmail}` },
    ],
  },
] as const;

const OfcNewsletterFooter = () => {
  return (
    <>
      <section className="ofc-newsletter" id="newsletter">
        <div className="ofc-container">
          <div className="ofc-newsletter__bar">
            <h3>Subscribe Newsletter to Get Updates</h3>
            <NewsletterSubscribeForm
              formClassName="ofc-newsletter__form"
              buttonClassName="ofc-btn ofc-btn--primary"
              placement="footer"
            />
          </div>
        </div>
      </section>

      <footer className="ofc-footer">
        <div className="ofc-container">
          <div className="ofc-footer__grid">
            <div className="ofc-footer__brand">
              <Link href="/">
                <Image
                  src="/assets/img/logo/onefulfillcenter-logo.png"
                  alt="One Fulfillment Center"
                  width={180}
                  height={38}
                />
              </Link>
              <p>
                Distributed fulfillment infrastructure for brands and retailers:
                warehousing, inventory storage, B2B/B2C order fulfillment, reverse
                logistics, and shipping support.
              </p>
              <p>
                <Link href={phoneTel}>{company.phone}</Link>
              </p>
              <p>
                <Link href={`mailto:${company.investorEmail}`}>{company.investorEmail}</Link>
              </p>
              <p>{company.address}</p>
            </div>

            {FOOTER_COLS.map((column) => (
              <div className="ofc-footer__col" key={column.title}>
                <h4>{column.title}</h4>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ofc-footer__bottom">
            <p>© {new Date().getFullYear()} One Fulfillment Center</p>
            <div className="ofc-footer__social">
              {socialLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  aria-label={item.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={item.icon} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default OfcNewsletterFooter;
