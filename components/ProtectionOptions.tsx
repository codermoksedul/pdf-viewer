import React, { useEffect } from "react";

const ProtectionOptions: React.FC = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable printing and text selection
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .no-print * {
          visibility: visible;
        }
        .no-print {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      body {
        -webkit-user-select: none; /* Disable text selection */
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      body {
        -webkit-touch-callout: none; /* Disable callout, e.g., on iOS */
      }
    `;
    document.head.appendChild(style);

    // Disable text selection and dragging
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleDragStart = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);

    // Disable specific keyboard keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const allowedKeys = [
        "Backspace",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Numpad0",
        "Numpad1",
        "Numpad2",
        "Numpad3",
        "Numpad4",
        "Numpad5",
        "Numpad6",
        "Numpad7",
        "Numpad8",
        "Numpad9",
      ];
      if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clean up event listeners and style on component unmount
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="protection-container no-print">
      {/* Protection overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          background: "transparent",
          pointerEvents: "none", // Allow clicks to pass through
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <div
        className="watermark"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          pointerEvents: "none",
          opacity: 0.5,
          fontSize: "3em",
          color: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>
    </div>
  );
};

export default ProtectionOptions;
