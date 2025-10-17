import Logo from "@/Logo";
import React from "react";

function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full bg-[#1b1c24] border-r-2 border-teal-200">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex justify-between pr-10 items-center">
          <Title text="Direct Messages" />
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between pr-10 items-center">
          <Title text="Channels" />
        </div>
      </div>
    </div>
  );
}

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest font-light text-neutral-400 text-opacity-90 pl-10 text-sm">
      {text}
    </h6>
  );
};
