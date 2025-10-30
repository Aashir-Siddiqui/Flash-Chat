import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Host } from "@/utils/constant";
import { Hash } from "lucide-react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatData,
    setSelectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleContactClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="space-y-1 px-3">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => handleContactClick(contact)}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all duration-200 group ${
              selectedChatData?._id === contact._id
                ? "bg-[#2a2b33] ring-2 ring-teal-500/50"
                : ""
            }`}
          >
            {isChannel ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-2 border-teal-500/30 flex items-center justify-center group-hover:border-teal-500/60 transition-all">
                <Hash className="w-5 h-5 text-teal-400" strokeWidth={2.5} />
              </div>
            ) : (
              <Avatar className="w-10 h-10 ring-2 ring-[#2f303b] group-hover:ring-teal-500 transition-all">
                {contact.picture ? (
                  <AvatarImage
                    src={`${Host}/${contact.picture}`}
                    alt="Profile"
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback
                    className="text-sm font-bold text-white"
                    style={{ backgroundColor: getColor(contact.color) }}
                  >
                    {contact.firstName && contact.lastName
                      ? `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
                      : contact.email[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate flex items-center gap-2">
                {isChannel
                  ? contact.name
                  : contact.firstName && contact.lastName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </p>
              {!isChannel && (
                <p className="text-gray-400 text-xs truncate">
                  {contact.email}
                </p>
              )}
              {isChannel && (
                <p className="text-gray-400 text-xs truncate">
                  {contact.members?.length || 0}{" "}
                  {contact.members?.length === 1 ? "member" : "members"}
                </p>
              )}
            </div>

            {selectedChatData?._id === contact._id && (
              <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          {isChannel
            ? "No channels yet. Create one!"
            : "No conversations yet. Start a new chat!"}
        </div>
      )}
    </div>
  );
};

export default ContactList;
