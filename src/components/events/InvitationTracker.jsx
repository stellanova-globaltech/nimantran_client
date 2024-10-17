import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Model = ({ handleClose, mediaItems = "imageEdit", media }) => {
  const close = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-black bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center w-8 h-8"
        >
          &times;
        </button>
        {mediaItems === "imageEdit" && media && (
          <img
            src={media}
            className="max-h-[80vh] max-w-[80vw]"
            alt="Selected media"
          />
        )}
        {mediaItems === "videoEdit" && media && (
          <video src={media} className="w-full h-auto" controls />
        )}
        {mediaItems === "cardEdit" && media && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "60vw",
              maxHeight: "500px",
              overflow: "hidden",
            }}
          >
            {/* Uncomment the following lines if you have pdfjs and react-pdf installed */}
            {/* <Worker workerUrl={pdfjsWorker}>
              <Viewer
                fileUrl={media}
                plugins={[defaultLayoutPluginInstance]}
                scrollMode="Page"
                renderPage={(props) => {
                  const { canvasLayer, textLayer, annotationLayer } = props;
                  return (
                    <div
                      style={{ width: "500px", height: "500px" }}
                      id="pdfPage"
                    >
                      {canvasLayer.children}
                      {textLayer.children}
                      {annotationLayer.children}
                    </div>
                  );
                }}
              />
            </Worker> */}
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <tr>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
      </td>
    </tr>
  );
};

const InvitationTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [media, setMedia] = useState(null);
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/whatsapp/all?eventId=${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filteredData =
    selectedStatus === "All"
      ? data
      : data.filter((item) => item.status === selectedStatus.toLowerCase());

  const handleViewClick = (mediaLink) => {
    setMedia(mediaLink);
    setOpenModel(true);
  };

  return (
    <div className="container mx-auto flex items-center justify-center">
      {!filteredData.length > 0 ? (
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="border px-4 py-2 box-border">From</th>
              <th className="border px-4 py-2 box-border">To</th>
              <th className="border px-4 py-2 box-border">
                <label>Status: </label>
                <select
                  className="border px-4 py-1 box-border rounded-md"
                  onChange={handleFiltersStatusChange}
                  value={selectedStatus}
                >
                  <option value="All">All</option>
                  <option value="sended" className="text-yellow-500">
                    sended
                  </option>
                  <option value="notSended" className="text-red-500">
                    notSended
                  </option>
                  <option value="queued" className="text-gray-500">
                    queued
                  </option>
                </select>
              </th>
              <th className="border px-4 py-2 box-border">Date</th>
              {/* <th className="border px-4 py-2 box-border">Preview</th> */}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 box-border">{row?.from}</td>
                  <td className="border px-4 py-2 box-border">{row?.to}</td>
                  <td className="border px-4 py-2 box-border">{row?.status}</td>
                  <td className="border px-4 py-2 box-border">
                    {new Date(row?.date).toLocaleString()}
                  </td>
                  {/* <td className="border px-4 py-2 box-border">
                    <button
                      className="bg-gray-500 px-4 rounded-sm py-0.5 text-gray-100"
                      onClick={() => handleViewClick(row.link)}
                    >
                      View
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full min-h-[80dvh] max-w-[160vh] flex items-center justify-center border-2 border-gray-300 rounded-xl flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="256px"
            height="256px"
            fill="gray"
          >
            <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z" />
          </svg>
          <h1 className="text-3xl text-gray-400">No Invitation Found</h1>
        </div>
      )}

      {openModel && (
        <Model
          handleClose={() => setOpenModel(false)}
          mediaItems="imageEdit"
          media={media}
        />
      )}
    </div>
  );
};

export default InvitationTracker;
