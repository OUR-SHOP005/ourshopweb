import TeamMember from "@/components/about/TeamMember";
import { teamMembers } from "@/lib/data";

const AboutPage = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          About Our Shop
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          We're a team of passionate designers and developers dedicated to creating
          exceptional digital experiences that drive business growth.
        </p>

        {/* Team */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To empower businesses with innovative digital solutions that enhance
              their online presence and drive meaningful results. We combine
              creativity with technical expertise to deliver websites that not only
              look stunning but also perform exceptionally well.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading web design agency known for creating transformative
              digital experiences that set new standards in the industry. We strive
              to push the boundaries of what's possible in web design while
              maintaining a focus on user experience and business objectives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
