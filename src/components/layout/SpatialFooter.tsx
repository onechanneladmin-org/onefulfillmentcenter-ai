import Image from "next/image";
import Link from "next/link";
import { company, socialLinks } from "@/data/brandArchitecture";
import { SERVICE_NAV } from "@/data/ofcNav";

const phoneTel = `tel:${company.phone.replace(/[^+\d]/g, "")}`;

const footerColumns = [
  {
    title: "Fulfillment",
    links: SERVICE_NAV.slice(0, 6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "More services",
    links: SERVICE_NAV.slice(6).map((item) => ({ label: item.title, href: item.href })),
  },
  {
    title: "Resources",
    links: [
      { label: "Fulfillment Blog", href: "/blog/" },
      { label: "Request a Demo", href: "/#newsletter" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: company.phone, href: phoneTel },
      { label: company.investorEmail, href: `mailto:${company.investorEmail}` },
    ],
  },
] as const;

export default function SpatialFooter() {
  return (
    <footer className="home-foot">
      <div className="spatial-wrap home-foot__grid home-foot__grid--wide">
        <div>
          <Link href="/">
            <Image
              src="/assets/img/logo/onefulfillcenter-logo-light.png"
              alt="One Fulfillment Center"
              width={180}
              height={38}
            />
          </Link>
          <p>
            Distributed fulfillment infrastructure for brands and retailers: warehousing,
            inventory storage, B2B/B2C order fulfillment, reverse logistics, and shipping
            support.
          </p>
          <p><Link href={phoneTel}>{company.phone}</Link></p>
          <p><Link href={`mailto:${company.investorEmail}`}>{company.investorEmail}</Link></p>
          <p>{company.address}</p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="spatial-wrap home-foot__bottom">
        <p>© {new Date().getFullYear()} One Fulfillment Center</p>
        <div className="home-foot__social">
          {socialLinks.map((item) => (
            <Link key={item.title} href={item.href} aria-label={item.title} target="_blank" rel="noreferrer">
              <i className={item.icon} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
