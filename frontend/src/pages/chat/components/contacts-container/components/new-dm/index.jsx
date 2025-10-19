import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACT_ROUTES, Host } from "@/utils/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils"; // ✅ Import getColor function
import { useAppStore } from "@/store";

function NewDM() {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewModal, setOpenNewModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Contact select karne par chat open ho
  const handleSelectContact = (contact) => {
    setOpenNewModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Plus
            className="text-neutral-400 font-light text-opacity-90 hover:text-teal-400 cursor-pointer transition-all duration-300"
            onClick={() => setOpenNewModal(true)}
            size={20}
          />
        </TooltipTrigger>
        <TooltipContent className="text-white bg-[#2a2b33] border-[#2f303b] mb-2 p-3">
          <p>Select new contact</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent
          className="bg-[#1b1c24] border-2 border-[#2f303b] text-white max-w-[95vw] sm:max-w-md rounded-2xl p-0 overflow-hidden"
          hideClose
        >
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gradient-to-r from-[#1e1f28] to-[#1b1c24] border-b border-[#2f303b]">
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              New Message
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm mt-1">
              Search and select a contact to start chatting
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#1b1c24]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search by name or email..."
                onChange={(e) => searchContacts(e.target.value)}
                className="bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 pl-9 sm:pl-10 pr-4 py-4 sm:py-5 text-sm rounded-lg focus-visible:ring-2 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <ScrollArea className="h-[60vh] sm:h-[400px] px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-2">
              {searchedContacts.length > 0 ? (
                searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleSelectContact(contact)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all duration-200 group"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-[#2f303b] group-hover:ring-teal-500 transition-all">
                        {contact.picture ? (
                          <AvatarImage
                            src={`${Host}/${contact.picture}`}
                            alt="Profile"
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback
                            className="text-lg font-bold text-white"
                            style={{ backgroundColor: getColor(contact.color) }}
                          >
                            {contact.firstName && contact.lastName
                              ? `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
                              : contact.email[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {contact.email}
                      </p>
                    </div>

                    {/* Arrow Icon on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                        <Plus size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center duration-1000 transition-all">
                  <DotLottieReact
                    src="/src/assets/flash.lottie"
                    loop
                    autoplay
                    style={{ width: 200, height: 200 }}
                  />
                  <div className="text-center mt-4 space-y-2">
                    <h3 className="font-poppins text-2xl font-semibold text-white">
                      Hi <span className="text-teal-500">!</span> Welcome to
                      <span className="text-teal-500"> Flash</span> Chat App.
                    </h3>
                    <p className="text-gray-500 font-poppins font-light">
                      Search a contact to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
