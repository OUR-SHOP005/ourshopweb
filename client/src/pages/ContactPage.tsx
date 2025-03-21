import ContactForm from "@/components/contact/ContactForm";

const ContactPage = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Have a project in mind? We'd love to hear from you. Send us a message
          and we'll respond as soon as possible.
        </p>

        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
