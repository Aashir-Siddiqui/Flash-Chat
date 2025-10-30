import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Users, Hash, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constant.js";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/MultipleSelector";
import { toast } from "sonner";

function CreateChannel() {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(response.data.channel);

          toast.success("Channel created successfully!");
        }
      } else {
        toast.error("Please enter channel name and select members");
      }
    } catch (error) {
      console.error("Create channel error:", error);
      toast.error("Failed to create channel");
    }
  };

  const handleCloseModal = () => {
    setNewChannelModal(false);
    setChannelName("");
    setSelectedContacts([]);
  };

  const truncateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Plus
            className="text-neutral-400 font-light text-opacity-90 hover:text-teal-400 cursor-pointer transition-all duration-300"
            onClick={() => setNewChannelModal(true)}
            size={20}
          />
        </TooltipTrigger>
        <TooltipContent className="text-white bg-[#2a2b33] border-[#2f303b] mb-2 p-3">
          <p>Create New Channel</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={newChannelModal} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-[#1b1c24] border-2 border-[#2f303b] text-white max-w-[95vw] sm:max-w-2xl rounded-2xl p-0 overflow-hidden h-[85vh] sm:h-[80vh] flex flex-col">
          <DialogHeader className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-br from-[#1e1f28] via-[#1b1c24] to-[#16171f] border-b border-[#2f303b] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Hash
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-white text-start">
                    Create New Channel
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-xs sm:text-sm mt-1.5 text-start flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Connect with multiple people at once
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 scrollbar-thin scrollbar-thumb-[#2f303b] scrollbar-track-transparent">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Hash className="w-4 h-4 text-teal-500" />
                Channel Name
              </label>
              <div className="relative group">
                <Input
                  placeholder="Channel name..."
                  onChange={(e) => setChannelName(e.target.value)}
                  value={channelName}
                  className="bg-[#2a2b33] border-2 border-[#2f303b] text-white placeholder:text-gray-500 px-4 py-4 text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:border-teal-500 transition-all group-hover:border-[#3f404b]"
                  maxLength={50}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {channelName.length}/50
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                Add Members
                <span className="text-xs font-normal text-gray-400 ml-auto">
                  {selectedContacts.length}{" "}
                  {selectedContacts.length === 1 ? "member" : "members"}{" "}
                  selected
                </span>
              </label>
              <div className="relative">
                <MultipleSelector
                  className="rounded-xl bg-[#2a2b33] border-2 border-[#2f303b] hover:border-[#3f404b] transition-all min-h-[100px]"
                  defaultOptions={allContacts.map((contact) => ({
                    ...contact,
                    label: truncateName(contact.label, 25),
                  }))}
                  placeholder="Search and select contacts..."
                  value={selectedContacts}
                  onChange={setSelectedContacts}
                  emptyIndicator={
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-medium">
                        No contacts found
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try adjusting your search
                      </p>
                    </div>
                  }
                  badgeClassName="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-md"
                  hideClearAllButton={false}
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/30 rounded-xl">
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-4 h-4 rounded-lg text-teal-300 flex items-center justify-center">
                    <Info />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-teal-300 font-medium">
                    Channel Guidelines
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Channels are perfect for team collaboration. All members
                    will be able to see and participate in conversations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-[#16171f] to-transparent border-t border-[#2f303b]">
            <Button
              onClick={createChannel}
              disabled={!channelName.trim() || selectedContacts.length === 0}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6 sm:py-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <Hash className="w-5 h-5 mr-2" />
              Create Channel
              {selectedContacts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  with {selectedContacts.length}{" "}
                  {selectedContacts.length === 1 ? "member" : "members"}
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
