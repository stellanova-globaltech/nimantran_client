import React, { useState, useRef, useEffect } from "react";
import "../WeddingVideo/WeddingVideo.css";
import DraggableResizableDiv from "../Other/DraggableResizableDiv/DraggableResizableDiv";
import { toast } from "react-hot-toast";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import {
  EditingTopBar,
  SideConfiguration,
} from "../Other/sideConfiguration/SideConfiguration";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextEditor from "../Other/TextEditor/TextEditor";
import ShowSampleModal from "../Other/modal/ShowSampleModal";
import Papa from "papaparse";
import Loader from "../Other/Loader/Loader";
import { firebaseStorage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SampleGuestList } from "../../constants";
import axios from "axios";
import { debounce } from "loadsh";
import { v4 as uuid } from "uuid";

export default function WeddingVideo() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  useEffect(() => {
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const [forZip, setForZip] = useState([]);
  const [savingState, setSavingState] = useState("saved"); // not saved, saving, saved
  const [CountModelOpenNumber, setCountModelOpenNumber] = useState(0);
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const parentRef = useRef();
  const [pdfFile, setPdfFile] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestList, setShowGuestList] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [jsonData, setJsonData] = useState(SampleGuestList);
  const [showPreview, setShowPreview] = useState(false);
  const [OriginalSize, setOriginalSize] = useState({
    w: 0,
    h: 0,
  });
  const [resized, setResized] = useState({
    w: 0,
    h: 0,
  });
  const [processedVideoUrls, setProcessedVideoUrls] = useState([]);
  const [isSample, setIsSample] = useState(true);
  const [fileName, setFileName] = useState("");

  const onDocumentLoad = async ({ doc }) => {
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });

    setOriginalSize({
      w: viewport.width,
      h: viewport.height,
    });

    setFileLoading(false);
  };

  const createTextDiv = () => {
    if (!pdfFile) {
      toast.error("Please First Upload Card in Pdf");
      return;
    }
    const newText = {
      id: "text#" + uuid(),
      duration: null,
      fontColor: "#000000",
      fontFamily: "Josefin Slab",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "normal",
      position: { x: 10, y: 10 },
      size: { width: 150, height: 80 },
      startTime: null,
      text: `{name}`,
      backgroundColor: "none",
      underline: "none",
      hidden: false,
      page: currentPage,
      backgroundOpacity: "1",
      transition: null,
    };
    setTexts([...texts, newText]);
  };

  const createImageDiv = async (e) => {
    if (!pdfFile) {
      toast.error("Please First Upload Image");
      return;
    }
    const uploadedImage = e.target.files[0];
    const overlayImageId = 'image#'+uuid();
    if(uploadedImage) {
      const fileName = `${overlayImageId}.${uploadedImage.name.split('.')[1]}`;
      let storageRef = ref(firebaseStorage, `eventsImages/${eventId}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, uploadedImage);
      const url = await getDownloadURL(snapshot.ref);

      const newOverlayImage = {
        id: overlayImageId,
        duration: null,
        fontColor: null,
        fontFamily: null,
        fontSize: null,
        fontStyle: null,
        fontWeight: null,
        position: { x: 10, y: 10 },
        size: { width: 200, height: 100 },
        startTime: null,
        text: null,
        backgroundColor: null,
        underline: null,
        hidden: false,
        page: currentPage,
        backgroundOpacity: "1",
        transition: null,
        link: url
      };

      setTexts([...texts, newOverlayImage]);
    }
  }

  useEffect(() => {
    // if (texts.length !== 0) {
    setSavingState("saving");
    var debouncedFetch = debounce(async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/texts/save?eventId=${eventId}`,
          { texts, inputFile: pdfFile },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {}
      setSavingState("saved");
    }, 3000);
    debouncedFetch();
    return () => {
      debouncedFetch.cancel();
    };
    // }
  }, [texts]);

  var getText = async () => {
    try {
      setFileLoading(true);
      var { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/texts/get?eventId=${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTexts(data.texts);
      setPdfFile(data.inputFile);

      const fileName = `inputFile.${
        data.inputFile
          ?.split("/")
          ?.pop()
          ?.split("#")[0]
          ?.split("?")[0]
          ?.split(".")[1]
      }`;
      setFileName(fileName);

      // const videoPlayer = document.getElementById("videoPlayer");
      // const img = new Image();
      // img.onload = () => {
      //   // Set the original size
      //   setOriginalSize({
      //     w: img.naturalWidth,
      //     h: img.naturalHeight,
      //   });

      //   // Set the resized size after the image is loaded and resized in the container
      //   setResized({
      //     w: videoPlayer.clientWidth,
      //     h: videoPlayer.clientHeight,
      //   });
      // };

      // setInputUrl(data.inputFile);
      // img.src = data.inputFile;
      // videoPlayer.src = data.inputFile;
      setShowGuestList(false);
    } catch (error) {}
    setFileLoading(false);
  };

  useEffect(() => {
    getText();
  }, []);

  const handleFileChange = async (event) => {
    setFileLoading(true);
    const file = event.target.files[0];
    try {
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            "File size exceeds 100MB. Please select a smaller video."
          );
          setFileLoading(false);
          return;
        }
        const fileName = `inputFile.${file?.name?.split(".")[1]}`;
        setFileName(fileName);
        let storageRef = ref(firebaseStorage, `uploads/${eventId}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setPdfFile(url);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const takeTextDetails = (details) => {
    const others = texts.filter((val) => val?.id !== details?.id);
    setTexts([...others, details]);
  };

  const handleGuestNamesChange = (event, isManual, contacts) => {
    if (isManual) {
      setJsonData(contacts);
    } else {
      const file = event.target.files[0];

      if (file) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setJsonData(results.data);
          },
        });
      }
    }
    setShowGuestList(true);
  };

  const handleSubmit = async (event, isSample) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      setIsSample(isSample);
      let scalingW = OriginalSize.w / resized.w;
      let scalingH = OriginalSize.h / resized.h;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!pdfFile) {
        setIsLoading(false);
        return toast.error("Please Upload the Video");
      }

      if (texts?.length === 0) {
        setIsLoading(false);
        return toast.error("Add the Text Box");
      }

      if (!isSample && jsonData?.length <= 0) {
        setIsLoading(false);
        return toast.error("Please Add into Guest List");
      }

      if (!jsonData[0]?.name || !jsonData[0].mobileNumber) {
        setIsLoading(false);
        return toast.error("name and mobileNumber coloums are required");
      }

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${process.env.REACT_APP_BACKEND_URL}/pdfEdit?eventId=${eventId}`,
        true
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("Accept", "text/event-stream");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onprogress = function () {
        const responseText = xhr.responseText.trim();
        const responses = responseText.split("\n\n"); // SSE events are separated by double newline

        responses.forEach((response) => {
          if (response.startsWith("data: ")) {
            const data = JSON.parse(response.replace("data: ", ""));
            // Update processedVideoUrls ensuring uniqueness by mobileNumber
            setProcessedVideoUrls((prev) => {
              const newList = [...prev];
              const existingIndex = newList.findIndex(
                (item) => item.mobileNumber === data.mobileNumber
              );
              if (existingIndex === -1) {
                newList.push(data);
              } else {
                newList[existingIndex] = data; // Replace existing object if found
              }
              return newList;
            });
          }
        });
      };

      xhr.onerror = function () {
        setIsLoading(false);
        toast.error("Network error!");
      };

      xhr.onloadend = function () {
        if (xhr.status >= 400) {
          // Handle backend error response and display the error message
          const errorResponse = JSON.parse(xhr.responseText);
          toast.error(errorResponse.message || "An error occurred!");
          setIsLoading(false);
          return;
        }

        if (isSample) {
          setShowPreview(true);
        } else {
          navigate(`/event/mediaGrid?eventId=${eventId}`);
        }
        setIsLoading(false); // Set isLoading to false after the response ends
      };

      xhr.send(
        JSON.stringify({
          guestNames: !isSample && jsonData,
          textProperty: texts,
          scalingFont,
          scalingW,
          scalingH,
          isSample,
          fileName,
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <ShowSampleModal
        showGuestList={showGuestList}
        setShowGuestList={setShowGuestList}
        data={jsonData}
        CountModelOpenNumber={CountModelOpenNumber}
        Type={"Card"}
      />

      {isLoading && (
        <Loader
          text={
            isSample
              ? `Please wait while Generating Sample Media: ${processedVideoUrls?.length} / 5 `
              : `Please wait while Generating Media ${processedVideoUrls?.length} / ${jsonData?.length} `
          }
        />
      )}

      {fileLoading && <Loader text={`Please wait while its Loading`} />}

      <div className="mainContainer">
        {openContextMenuId && (
          <TextEditor
            property={texts
              ?.filter((val) => val.id === openContextMenuId)
              ?.at(0)}
            openContextMenuId={openContextMenuId}
            takeTextDetails={takeTextDetails}
          />
        )}
        <div className="main-wrapper">
          <EditingTopBar
            handleGuestNamesChange={handleGuestNamesChange}
            setCountModelOpenNumber={setCountModelOpenNumber}
            setShowGuestList={setShowGuestList}
            handleVideoUpload={handleFileChange}
            createTextDiv={createTextDiv}
            comp={"Pdf"}
            jsonData={jsonData}
            createImageDiv={createImageDiv}
          />

          <div className="mainbar">
            {!pdfFile && (
              <label
                className="upload-container"
                onChange={handleFileChange}
                style={{
                  height: pdfFile && "50px",
                  margin: pdfFile && "0 auto",
                  padding: pdfFile && "5px",
                }}
              >
                <input type="file" accept="application/pdf" />
                <div className="upload-content">
                  <h2
                    className="upload-button"
                    style={{
                      fontSize: pdfFile && "15px",
                      padding: pdfFile && "8px",
                    }}
                  >
                    Upload PDF
                  </h2>
                  {!pdfFile && <p>or Drag & Drop a file</p>}
                  {/* <p className="paste-text">paste File or URL</p> */}
                </div>
              </label>
            )}
            <div
              className="videoContainer"
              style={{ display: !pdfFile ? "none" : "flex" }}
            >
              {pdfFile && (
                <div
                  id="mainResized"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "65vw",
                    maxHeight: "var(--contentMaxHeight)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Worker workerUrl={pdfjsWorker}>
                    <Viewer
                      // defaultScale="PageFit"
                      fileUrl={pdfFile}
                      plugins={[defaultLayoutPluginInstance]}
                      initialPage={currentPage - 1}
                      scrollMode="Page"
                      onPageChange={(e) => setCurrentPage(e.currentPage)}
                      onDocumentLoad={onDocumentLoad}
                      renderPage={(props) => {
                        const { canvasLayer, textLayer, annotationLayer } =
                          props;

                        if (
                          resized.w !== props.width ||
                          resized.h !== props.height
                        ) {
                          setResized({ w: props.width, h: props.height });
                        }

                        // setResized({ w: props.width, h: props.height });
                        return (
                          <div
                            style={{ width: "100%", height: "100%" }}
                            id="pdfPage"
                            ref={parentRef}
                          >
                            {canvasLayer.children}
                            {textLayer.children}
                            {annotationLayer.children}
                            <div
                              style={{ position: "absolute", top: 0, left: 0 }}
                            >
                              {console.log(texts)}
                              {texts?.map(
                                (val) =>
                                  val.page === currentPage && (
                                    <DraggableResizableDiv
                                      openContextMenuId={openContextMenuId}
                                      setOpenContextMenuId={
                                        setOpenContextMenuId
                                      }
                                      key={val?.id}
                                      videoRef={parentRef}
                                      takeTextDetails={takeTextDetails}
                                      property={val}
                                      resizedSize={resized}
                                      type={"pdf"}
                                    />
                                  )
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </Worker>
                </div>
              )}
            </div>
          </div>
        </div>
        {pdfFile && (
          <SideConfiguration
            texts={texts}
            setTexts={setTexts}
            handleSubmit={handleSubmit}
            eventId={eventId}
            mediaItems={forZip}
            savingState={savingState}
          />
        )}
      </div>
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-80 items-center justify-center z-50"
        style={{ display: !isLoading && showPreview ? "flex" : "none" }}
      >
        <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 max-w-4xl">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            onClick={() => {
              setShowPreview(false);
              setForZip(processedVideoUrls);
              setProcessedVideoUrls([]);
            }}
          >
            &times;
          </button>

          {/* Modal Content */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Previews</h2>

            {/* Horizontal Scrollable Container */}
            <div className="flex space-x-4 overflow-x-auto p-2">
              {processedVideoUrls.map((val, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "350px",
                    maxHeight: "500px",
                    overflow: "auto",
                    position: "relative",
                  }}
                >
                  <Worker workerUrl={pdfjsWorker}>
                    <Viewer fileUrl={val.link} />
                  </Worker>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
