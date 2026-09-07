export const company = {
  name: "One Fulfillment Center",
  shortName: "OneFulfillCenter",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_ORIGIN ||
    "https://onefulfillcenter.com"
  ).replace(/\/+$/, ""),
  productUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_ORIGIN ||
    "https://onefulfillcenter.com"
  ).replace(/\/+$/, ""),
  demoUrl: "#newsletter",
  demoCta: "Request a Demo",
  leadEndpoint: "https://backend.onechanneladmin.com/inventory/customer/createContact?skipCloudFlare=true",
  investorEmail: "sales@onechanneladmin.com",
  investorSubject: "Fulfillment inquiry with One Fulfillment Center",
  phone: "+1 (888) 610-2044",
  address: "8 W Darlington Ave, Kissimmee, FL 34746",
  facebookUrl: "https://www.facebook.com/people/Onechanneladmin/61556811086501/",
  instagramUrl: "https://www.instagram.com/onechanneladmin/",
  linkedinUrl: "https://www.linkedin.com/company/onechanneladmin/",
  youtubeUrl: "https://www.youtube.com/@onechanneladmin",
}

export const socialLinks = [
  {
    title: "Facebook",
    href: company.facebookUrl,
    icon: "fa-brands fa-facebook-f",
  },
  {
    title: "Instagram",
    href: company.instagramUrl,
    icon: "fa-brands fa-instagram",
  },
  {
    title: "LinkedIn",
    href: company.linkedinUrl,
    icon: "fa-brands fa-linkedin-in",
  },
  {
    title: "YouTube",
    href: company.youtubeUrl,
    icon: "fa-brands fa-youtube",
  },
] as const;

