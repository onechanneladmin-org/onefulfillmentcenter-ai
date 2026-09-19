import NewsletterSubscribeForm from "@/components/forms/NewsletterSubscribeForm";

const HomeNewsletter = () => {
  return (
    <section className="spatial-block home-news" id="newsletter">
      <h2>Subscribe Newsletter to Get Updates</h2>
      <NewsletterSubscribeForm
        formClassName="home-news__form"
        buttonClassName="spatial-btn spatial-btn--teal"
        placement="homepage"
      />
    </section>
  );
};

export default HomeNewsletter;
