import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WhatsappModal = ({
  setOpenModal,
  eventId,
  sendSelectedModal
}) => {
  const token = localStorage.getItem("token");
  const [response, setResponse] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState("");

  const generateQR = () => {
    const xhr = new XMLHttpRequest();

    // Define the event to handle incoming data from the server
    xhr.onprogress = () => {
      const responseText = xhr.responseText.trim();
      const responses = responseText.split("\n\n"); // SSE events are separated by double newline

      if (responseText.startsWith("status: ")) {
        responses.forEach((line) => {
          if (line.startsWith("qrCode: ")) {
            setQrCode(line.replace("qrCode: ", "").trim()); // Update your state with the received QR code
          }

          if (line.startsWith("status: ")) {
            setStatus(line.replace("status: ", "").trim());
          }

          if (line.startsWith("error: ")) {
            setStatus(line.replace("error: ", "").trim());
          }

          if (line.startsWith("complete: ")) {
            setStatus(line.replace("complete: ", "").trim());
          }
        });
      }
    };

    // Open the connection with your backend server (SSE)
    xhr.open(
      "GET",
      `${process.env.REACT_APP_BACKEND_URL}/whatsapp/generate-qr?eventId=${eventId}`,
      true
    );

    // Set the Authorization header
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "text/event-stream");
    xhr.setRequestHeader("Content-Type", "application/json");
    // Send the request
    xhr.send();
  };

  // const generateQR = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/whatsapp/generate-qr?eventId=${eventId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log('......................', data)
  //     setQrCode(data.qrCode);
  //   } catch (error) {
  //     toast.error("QR is not Fetched");
  //   }
  // };

  // useEffect(() => {
  //   generateQR();
  // }, []);

  const individualWhatsuppBusinessInvite = async (guest) => {
    try {
      const { data } = await axios.post(
        `https://backend.aisensy.com/campaign/t1/api/v2`,
        {
          apiKey: process.env.REACT_APP_WHATSAPP_API_KEY,
          campaignName: "Nimantran_Camp",
          destination: sendSelectedModal?.at(0)?.mobileNumber,
          userName: "Stellanova Globaltech Pvt Ltd",
          templateParams: [],
          source: "new-landing-page form",
          media: {
            url: sendSelectedModal?.at(0)?.link,
            filename: "sample_media",
          },
          buttons: [],
          carouselCards: [],
          location: {},
          paramsFallbackValue: {},
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Message send successfully");
    } catch (error) {
      toast.error("Message not send successfully");
    }
  };

  const individualWhatsuppPersonalInvite = async () => {
    // try {
    //   const { data } = await axios.post(
    //     `${process.env.REACT_APP_BACKEND_URL}/whatsapp/individualPersonal?eventId=${eventId}`,
    //     {
    //       number: selectedWhatsapp,
    //       mediaUrl: sendMedia,
    //     },
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   if (data) {
    //     toast.success("Message was successufully sent on whatsapp");
    //     setResponse("Message sent successfully!");
    //   }
    // } catch (error) {
    //   setResponse(error.response.data.message);
    // }
  };

  const sendWhatsuppBusinessInvite = async () => {
    try {
      sendSelectedModal?.forEach(async (guest) => {
        const { data } = await axios.post(
          `https://backend.aisensy.com/campaign/t1/api/v2`,
          {
            apiKey: process.env.REACT_APP_WHATSAPP_API_KEY,
            campaignName: "Nimantran_Camp",
            destination: guest?.mobileNumber,
            userName: "Stellanova Globaltech Pvt Ltd",
            templateParams: [],
            source: "new-landing-page form",
            media: {
              url: guest?.link,
              filename: "sample_media",
            },
            buttons: [],
            carouselCards: [],
            location: {},
            paramsFallbackValue: {},
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      })
      toast.success("Message send successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg w-2/4 shadow-lg">
        <div className="p-6">
          {/* Heading and Close Icon */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Send Invitation</h2>
            <button
              onClick={() => setOpenModal(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Section 2 */}
          <div className="mb-4">
            <button
              onClick={() => sendWhatsuppBusinessInvite() }
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.508c-1.91-1.91-4.482-2.958-7.216-2.958-5.639 0-10.222 4.583-10.222 10.222 0 1.805.468 3.58 1.363 5.155l-1.427 5.189 5.331-1.399c1.534.858 3.292 1.307 5.113 1.307 5.639 0 10.222-4.583 10.222-10.222 0-2.734-1.047-5.306-2.958-7.216zm-7.264 15.652c-1.58 0-3.123-.423-4.474-1.226l-.32-.189-3.166.831.848-3.083-.207-.336c-.844-1.373-1.29-2.949-1.29-4.558 0-4.504 3.664-8.168 8.168-8.168 2.182 0 4.232.85 5.777 2.395s2.395 3.595 2.395 5.777c0 4.504-3.664 8.168-8.168 8.168zm4.694-6.211c-.257-.128-1.524-.75-1.761-.836s-.407-.128-.578.128c-.171.256-.664.836-.815 1.007-.149.171-.299.192-.556.064-.257-.127-1.083-.399-2.064-1.272-.764-.68-1.279-1.521-1.428-1.777-.149-.257-.016-.396.112-.523.114-.114.256-.299.384-.448.13-.15.171-.256.257-.427.085-.171.043-.321-.022-.448-.064-.128-.578-1.392-.792-1.907-.206-.492-.417-.425-.578-.433h-.497c-.171 0-.448.064-.685.299-.235.235-.899.878-.899 2.139s.921 2.479 1.05 2.646c.128.171 1.811 2.79 4.389 3.914.614.265 1.09.423 1.461.543.614.195 1.17.167 1.61.102.491-.073 1.524-.625 1.74-1.228.214-.599.214-1.115.149-1.228-.064-.107-.235-.171-.492-.299z" />
              </svg>
              Send Invitation with Business Number
            </button>
          </div>

          {/* Separator */}
          <hr className="my-6 border-gray-400" />

          {/* Section 1 */}
        </div>
      </div>
    </div>
  );
};

export default WhatsappModal;

          // <div className="mb-4">
          //   {/* <div className="flex items-center justify-center">
          //     <label
          //       htmlFor="sendTo"
          //       className="block text-sm font-medium text-gray-700 flex-1"
          //     >
          //       Send To:
          //     </label>
          //     <input
          //       type="text"
          //       id="sendTo"
          //       value={selectedWhatsapp}
          //       disabled
          //       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex-1"
          //     />
          //   </div> */}
          //   <div>
          //     {/* {qrCode ? ( */}
          //     <div className="flex flex-col m-4 items-center">
          //       <span>Scan QR Code with WhatsApp</span>
          //       <span
          //         className="text-sm text-gray-800 hover:text-gray-500 cursor-pointer"
          //         onClick={() => generateQR()}
          //       >
          //         (Show QR): {status}
          //       </span>
          //       {qrCode ? (
          //         <img
          //           src={qrCode}
          //           alt="WhatsApp QR Code"
          //           className="max-w-[260px]"
          //         />
          //       ) : (
          //         <p>Loading QR Code...</p>
          //       )}
          //       <span>{response}</span>
          //     </div>
          //     {/* ) : (
          //       <p>Loading QR Code...</p> */}
          //     {/* )} */}
          //   </div>
          //   <button
          //     onClick={() =>
          //       selectedWhatsapp === "all"
          //         ? bulkWhatsuppPersonalInvite()
          //         : individualWhatsuppPersonalInvite()
          //     }
          //     className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          //   >
          //     <svg
          //       className="w-5 h-5 mr-2"
          //       fill="currentColor"
          //       xmlns="http://www.w3.org/2000/svg"
          //       viewBox="0 0 24 24"
          //     >
          //       <path d="M20.52 3.508c-1.91-1.91-4.482-2.958-7.216-2.958-5.639 0-10.222 4.583-10.222 10.222 0 1.805.468 3.58 1.363 5.155l-1.427 5.189 5.331-1.399c1.534.858 3.292 1.307 5.113 1.307 5.639 0 10.222-4.583 10.222-10.222 0-2.734-1.047-5.306-2.958-7.216zm-7.264 15.652c-1.58 0-3.123-.423-4.474-1.226l-.32-.189-3.166.831.848-3.083-.207-.336c-.844-1.373-1.29-2.949-1.29-4.558 0-4.504 3.664-8.168 8.168-8.168 2.182 0 4.232.85 5.777 2.395s2.395 3.595 2.395 5.777c0 4.504-3.664 8.168-8.168 8.168zm4.694-6.211c-.257-.128-1.524-.75-1.761-.836s-.407-.128-.578.128c-.171.256-.664.836-.815 1.007-.149.171-.299.192-.556.064-.257-.127-1.083-.399-2.064-1.272-.764-.68-1.279-1.521-1.428-1.777-.149-.257-.016-.396.112-.523.114-.114.256-.299.384-.448.13-.15.171-.256.257-.427.085-.171.043-.321-.022-.448-.064-.128-.578-1.392-.792-1.907-.206-.492-.417-.425-.578-.433h-.497c-.171 0-.448.064-.685.299-.235.235-.899.878-.899 2.139s.921 2.479 1.05 2.646c.128.171 1.811 2.79 4.389 3.914.614.265 1.09.423 1.461.543.614.195 1.17.167 1.61.102.491-.073 1.524-.625 1.74-1.228.214-.599.214-1.115.149-1.228-.064-.107-.235-.171-.492-.299z" />
          //     </svg>
          //     Send Invitation with Personal Number
          //   </button>
          // </div>