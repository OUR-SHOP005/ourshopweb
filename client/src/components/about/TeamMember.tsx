import { Card, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { TeamMember as TeamMemberType } from "@/lib/data";

interface TeamMemberProps {
  member: TeamMemberType;
}

const TeamMember = ({ member }: TeamMemberProps) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row">
      <img
        src={member.image}
        alt={member.name}
        className="w-40 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
      />
      <div>
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-primary font-medium mb-3">{member.role}</p>
        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
        <a 
          href={`https://instagram.com/${member.instagram}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-700 flex items-center gap-1"
        >
          <Instagram size={18} />
          {member.instagram}
        </a>
      </div>
    </Card>
  );
};

export default TeamMember;
