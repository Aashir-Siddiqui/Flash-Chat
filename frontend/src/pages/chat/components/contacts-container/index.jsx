import Logo from "../../../../components/Logo";
import React, { useEffect } from "react";
import { Users, Hash } from "lucide-react";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import CreateChannel from "./components/create-channel";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM, GET_USER_CHANNELS_ROUTE } from "@/utils/constant";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";

function ContactsContainer() {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels, 
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_CONTACTS_FOR_DM, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    getContacts();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    getChannels();
  }, [setChannels]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full bg-[#1b1c24] border-r-2 border-[#2f303b] flex flex-col h-screen pb-16">
      <div className="pt-5 px-5 border-b-2 border-[#2f303b]">
        <Logo />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2f303b] scrollbar-track-transparent">
        <div className="my-6">
          <div className="flex justify-between items-center px-5 mb-3">
            <Title text="Direct Messages" icon={<Users size={16} />} />
            <NewDM />
          </div>
          <ContactList contacts={directMessagesContacts} />
        </div>

        <div className="my-6">
          <div className="flex justify-between items-center px-5 mb-3">
            <Title text="Channels" icon={<Hash size={16} />} />
            <CreateChannel />
          </div>
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;

const Title = ({ text, icon }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-neutral-400">{icon}</span>
      <h6 className="uppercase tracking-widest font-semibold text-neutral-400 text-xs">
        {text}
      </h6>
    </div>
  );
};
