import React, { useEffect } from "react";

const ProtectionOptions: React.FC = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable printing
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

    return () => {
      // Clean up event listeners and style on component unmount
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
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
    </div>
  );
};

export default ProtectionOptions;
