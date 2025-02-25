import React from "react";
import Viresonapp from "../Viresonapp";
function HelpSupport() {
  return (
    <>
      <div className="mt-24">
        <div className="object-cover mx-4 md:mx-48 my-8 md:my-16 h-36 md:h-72 bg-[rgb(0,69,120)] rounded-3xl">
          <div className="font-medium text-3xl md:text-7xl text-cyan-50 text-center py-10 md:py-28 px-6  md:px-">
            Help & Support
          </div>
        </div>
        <div className="md:px-20 py-10 font-serif">
          <div className=" px-4 md:px-12">
            <h1 className=" font-sans  text-2xl">
              At INFINITY WASH, we prioritize customer satisfaction and are here
              to assist you with any questions or concerns you may have
              regarding our services. Below is a comprehensive guide to help you
              navigate our offerings and get the support you need .
            </h1>
            <div className="font-bold py-2">Contact Us</div>
            <div>
              <h1 className="font-bold ">Phone Support:</h1>
              <p>
                For immediate assistance, call us at{" "}
                <span>[Phone No. +91 9939553453] </span>. Our customer service
                team is available [insert hours of operation].
              </p>
              <h1 className="font-bold ">Email Support:</h1>
              <p>
                You can reach us at{" "}
                <span>[Email Id. carcleanplus@gmail.com ]</span> for any
                inquiries or feedback. We aim to respond within [insert response
                time, e.g., 24 hours].
              </p>
            </div>

            <div className="font-bold py-2 ">
              Frequently Asked Questions (FAQs){" "}
            </div>
            <div>
              <h1 className="font-bold ">What services do you offer?</h1>
              <p>
                We provide a range of services, including exterior washing,
                interior cleaning, detailing, and custom car ceiling solutions.
                Visit our Services page for more details.
              </p>
              <h1 className="font-bold ">
                How much water do you use for cleaning?
              </h1>
              <p>
                We are committed to conserving water and use only 20 litres to
                wash a car effectively.
              </p>
              <h1 className="font-bold ">Can I book an appointment online?</h1>
              <p>
                Yes, you can book an appointment directly through our website
                using our online scheduling tool.
              </p>
              <h1 className="font-bold ">
                What if it rains after my car is cleaned?
              </h1>
              <p>
                While we strive to deliver the best results, external factors
                like weather can affect your vehicle’s cleanliness. We recommend
                parking under cover when possible.
              </p>
              <h1 className="font-bold ">
                Do you offer discounts for regular customers?
              </h1>
              <p>
                Yes, we have loyalty programs and discounts for repeat
                customers. Check our Promotions page for current offers.
              </p>
            </div>

            <div className="font-bold py-2">Service Policies</div>
            <div>
              <h1 className="font-bold ">Cancellation Policy:</h1>
              <p>
                If you need to cancel or reschedule your appointment, please
                notify us at least [insert time frame, e.g., 24 hours] in
                advance to avoid cancellation fees.
              </p>
              <h1 className="font-bold ">Satisfaction Guarantee:</h1>
              <p>
                We stand by our services. If you are not completely satisfied,
                please contact us within [insert time frame, e.g., 24 hours] of
                service completion, and we will work to make it right.
              </p>
            </div>
            <div className="font-bold py-2">Feedback and Suggestions</div>
            <div>
              <p>
                We value your feedback! If you have suggestions or comments
                about your experience with our services, please reach out to us
                via email or through our website’s feedback form.
              </p>
            </div>
          </div>
        </div>
        {/* <Viresonapp /> */}
      </div>
    </>
  );
}

export default HelpSupport;
