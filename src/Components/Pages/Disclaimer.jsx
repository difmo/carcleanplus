import React from "react";
import Button from "../Button";
import img from "../../assets/mobiles.png";

function Disclaimer() {
  return (
    <>
      <div className="h-auto ">
        <div className="h-auto  ">
          <div className="md:px-40 bg-[#004578] text-white">
            <div className="text-center py-5 md:py-16 text-5xl font-bold ">
              Disclaimer
            </div>
            <div className=" px-4  md:px-28 text-center pb-10 text-xl ">
              At INFINITY WASH, we are committed to providing high-quality,
              eco-friendly car cleaning services while minimizing water usage.
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 100"
            height={130}
            preserveAspectRatio="none"
            className="w-full"
          >
            <path
              fill="#004578"
              opacity="0.33"
              d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
            ></path>
            <path
              fill="#004578"
              opacity="0.66"
              d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
            ></path>
            <path
              fill="#004578"
              d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
            ></path>
          </svg>
        </div>
        <div className="h-auto px-4 md:px-36 py-4">
          <div className="text-2xl p-2">Pre-existing Damage:</div>
          <div className="py- px-2 ">
            We take no responsibility for any pre-existing damage, defects, or
            wear and tear on the vehicle’s exterior or interior surfaces.
            Customers are encouraged to inspect their vehicle prior to cleaning
            and inform us of any areas that may require special attention.
          </div>
          <div className="text-2xl p-2">
            Liability for Custom Modifications:
          </div>
          <div className="py- px-2 ">
            If your vehicle has any custom modifications, non-standard finishes,
            or aftermarket accessories, please notify us in advance. We cannot
            be held liable for any damages to these modifications if they are
            not disclosed before service.
          </div>
          <div className="text-2xl p-2">Stain and Damage Removal:</div>
          <div className="py- px-2 ">
            While we use professional-grade cleaning methods and products, we
            cannot guarantee the complete removal of all stains, scuffs, or
            damages, especially those caused by extreme weather conditions,
            environmental factors, or long-term neglect.
          </div>
          <div className="text-2xl p-2">Water Efficiency:</div>
          <div className="py- px-2 ">
            Our service prides itself on using only 20 liters of water per wash
            to minimize wastage. This approach is intended to be both effective
            and environmentally responsible. However, for extremely dirty
            vehicles, certain areas may not achieve the desired level of
            cleanliness, and additional services may be recommended.
          </div>
          <div className="text-2xl p-2">No Guarantee for External Factors:</div>
          <div className="py- px-2 ">
            After your vehicle is cleaned, external factors such as weather
            conditions, road dirt, or environmental pollutants may quickly
            affect the appearance of your vehicle. We are not liable for any
            dirt, grime, or water spots that may occur after the vehicle leaves
            our premises or once the cleaning is complete.
          </div>
          <div className="text-2xl p-2">Customer Responsibility:</div>
          <div className="py- px-2 ">
            Customers are responsible for securing all personal belongings,
            valuables, and loose items in the vehicle before cleaning. We do not
            accept liability for any lost or damaged items left inside the
            vehicle during the cleaning process.
          </div>
          <div className="text-2xl p-2">Service Changes:</div>
          <div className="py- px-2  ">
            We reserve the right to modify, change, or cancel any services due
            to unforeseen circumstances, technical issues, or safety concerns.
            In such cases, we will inform the customer and offer alternative
            options or rescheduling as necessary.
          </div>
        </div>
        {/* <div className=" flex justify-center py-3">
          <Button />
        </div>
        <div className="px-3 justify-center flex">
          <img src={img} alt="" className="md:w-2/3 md:pr-20 py-10" />
        </div> */}
      </div>
      <div className="h-[100px]  ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="w-full h-full "
        >
          <path
            className="elementor-shape-fill "
            opacity="0.33"
            fill="#004578"
            d="M473,32.7c-203.9,-88.3-263.1,34-320.3,0C66,-19.1,0,40.3,0,40.3V100h1000V40.3 c0,0-62.1-26.1-94.9-29.3c-32.8-3.3-62.8,12.3-75.8,22.1C806,50.4,745.3,91.3,694.9,95.3S492.4,41,473,32.7z"
          ></path>
          <path
            className="elementor-shape-fill"
            opacity="0.66"
            fill="#004578"
            d="M734,32.7c-45.5,0-77.2,23.2-129.1,39.1c-28.6,8.7-150.3,10.1-254,-39.1 s-91.7,34.4-149.2,0C115.7,-18.3,0,60.2,0,60.2V100h1000v-36.5c0,0-28.2,18.5-92.1,18.5C810.2,81.9,775.7,32.7,734,32.7z"
          ></path>
          <path
            className="elementor-shape-fill"
            fill="#004578"
            d="M766.1,71.1c-200,57.5-266,-65.5-395.1,-19.5C242,98.2,242,94.6,184.8,79.4C128,64.2,132.3,55.1,89.9,47.5C28.6,36.3,0,100,0,100 h1000c0,0-9.9,-40.9-83.6,-48.1S829.6,53,766.1,71.1z"
          ></path>
        </svg>
      </div>
    </>
  );
}

export default Disclaimer;
