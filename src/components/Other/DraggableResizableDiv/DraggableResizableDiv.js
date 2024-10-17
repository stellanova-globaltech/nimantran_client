// DraggableResizableDiv.js
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./DraggableResizableDiv.css";

const DraggableResizableDiv = ({
  videoRef,
  takeTextDetails,
  property,
  openContextMenuId,
  setOpenContextMenuId,
  type,
  resizedSize,
}) => {
  const [text, setText] = useState(property?.text);
  const [position, setPosition] = useState(property?.position);
  const [size, setSize] = useState(property?.size);
  const [visible, setVisible] = useState(true);
  const [isAtCenter, setIsAtCenter] = useState(false);

  const handleDrag = (e, data) => {
    if (e.target.className.includes("react-resizable-handle")) {
      return false; // Prevent dragging when resizing
    }
    if (data.x >= 0 && data.y >= 0) {
      setPosition({ x: data.x, y: data.y });
    }
    // if (data.y >= resizedSize.h - property?.size?.height) {
    //   setPosition({ x: resizedSize.w / 2, y: resizedSize.h / 2 });
    // }
    // if (data.x >= resizedSize.w - property?.size?.width) {
    //   setPosition({ x: resizedSize.w / 2, y: resizedSize.h / 2 });
    // }
    if (Math.abs(resizedSize.w / 2 - size?.width / 2 - data.x) < 2) {
      setIsAtCenter(true);
    } else {
      setIsAtCenter(false);
    }
    setTimeout(() => {
      setIsAtCenter(false);
    }, 4000);
  };

  const handleResize = (e, { size, handle }) => {
    // if (!type) {
    //   let newWidth = size.width;
    //   let newHeight = size.height;
    //   let newX = position.x;
    //   let newY = position.y;

    //   // Check if the new size exceeds the image boundaries
    //   if (newX + newWidth > resizedSize.w) {
    //     newWidth = resizedSize.w - newX;
    //   }
    //   if (newY + newHeight > resizedSize.h) {
    //     newHeight = resizedSize.h - newY;
    //   }

    //   // Adjust position if resizing from left or top
    //   if (handle.includes("w")) {
    //     newX = Math.max(0, position.x + size.width - newWidth);
    //   }
    //   if (handle.includes("n")) {
    //     newY = Math.max(0, position.y + size.height - newHeight);
    //   }
    //   setSize({ width: newWidth, height: newHeight });
    //   setPosition({ x: newX, y: newY });
    // } else {
    //   setSize({ width: size?.width, height: size?.height });
    // }
    setSize({ width: size?.width, height: size?.height });
  };

  const handleContextMenu = (e) => {
    setOpenContextMenuId(property?.id);
  };

  useEffect(() => {
    takeTextDetails({
      id: property?.id,
      text,
      position,
      size,
      fontColor: property?.fontColor,
      fontWeight: property?.fontWeight,
      underline: property?.underline,
      fontSize: property?.fontSize,
      fontFamily: property?.fontFamily,
      fontStyle: property?.fontStyle,
      startTime: property?.startTime,
      duration: property?.duration,
      backgroundColor: property?.backgroundColor,
      backgroundOpacity: property?.backgroundOpacity,
      transition: property?.transition,
      hidden: property?.hidden,
      page: property?.page,
      link: property?.link,
    });
  }, [position, size, text, property?.page, property?.hidden]);

  useEffect(() => {
    // try {
    const checkVisibility = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        setVisible(
          currentTime >= property?.startTime && currentTime <= property?.duration
        );
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", checkVisibility);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", checkVisibility);
      }
    };
    // } catch (error) {}
  }, [property?.startTime, property?.duration, videoRef]);

  return (
    <Draggable key={property?.id} onDrag={handleDrag} position={position}>
      <div
        className="draggable-container"
        onClick={handleContextMenu}
        style={{
          zIndex: openContextMenuId === property?.id ? 40 : 1,
          display: property?.hidden ? "none" : "inline-block",
        }}
      >
        <ResizableBox
          width={size?.width}
          height={size?.height}
          minConstraints={[100, 40]}
          onResizeStop={handleResize}
          className="resizable-box "
        >
          {property?.id?.startsWith("text") && (
            <div
              className="editable-box "
              style={{
                display: visible ? "flex" : "none",
                background: `${property?.backgroundColor}`,
                opacity: property?.backgroundOpacity,
              }}
            >
              <input
                type="text"
                style={{
                  color: property?.fontColor,
                  fontStyle: property?.fontStyle,
                  fontSize: `${property?.fontSize}px`,
                  fontFamily: property?.fontFamily,
                  display: visible ? "flex" : "none",
                  fontWeight: property?.fontWeight,
                  textDecoration: property?.underline,
                }}
                className="textInput"
                placeholder="Write Text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
          {property?.id?.startsWith("image") && (
            <img
              src={property?.link}
              alt="image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                opacity: property?.backgroundOpacity,
                display: visible ? "flex" : "none",
              }}
            />
          )}
        </ResizableBox>

        {isAtCenter && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "1px",
              backgroundColor: "black",
              zIndex: 30,
            }}
          />
        )}
      </div>
    </Draggable>
  );
};

export default DraggableResizableDiv;
