import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/brandArchitecture";

const OfcHero = () => {
  return (
    <section className="ofc-hero">
      <div className="ofc-hero__media" aria-hidden="true">
        <Image
          src="/assets/img/about/oca/about-warehouse-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 35%" }}
        />
      </div>
      <div className="ofc-hero__shade" aria-hidden="true" />

      <div className="ofc-container ofc-hero__content">
        <p className="ofc-hero__brand">
          One <span>Fulfillment</span> Center
        </p>
        <h1 className="ofc-hero__title">
          Next Generation <em>Fulfillment</em> Center
        </h1>
        <p className="ofc-hero__copy">
          For eCommerce business — omni-channel fulfillment with a distributed
          warehouse network that helps you grow, reach more customers, and
          deliver orders swiftly.
        </p>
        <div className="ofc-hero__actions">
            <Link className="ofc-btn ofc-btn--primary" href={company.demoUrl}>
              Request a Demo
            </Link>
          <Link className="ofc-btn ofc-btn--ghost" href="#how-it-works">
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfcHero;
