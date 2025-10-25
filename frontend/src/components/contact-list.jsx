import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Host } from "@/utils/constant";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatData,
    setSelectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleContactClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    // ✅ Clear messages only if switching to different contact
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="space-y-1 px-3">
      {contacts && contacts.length > 0 ? ( // ✅ Fixed: Check 'contacts' prop
        contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => handleContactClick(contact)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all duration-200 group"
          >
            {/* Avatar */}
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

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {contact.firstName && contact.lastName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </p>
              <p className="text-gray-400 text-xs truncate">{contact.email}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No conversations yet. Start a new chat!
        </div>
      )}
    </div>
  );
};

export default ContactList;
