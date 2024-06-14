import React, { useEffect, useRef } from "react";
import EasyQRCode from "easyqrcodejs";
import logo from "./logo.dbg.png";

import bg from '../utils/logo.png'
interface QRCodeProps {
  text: string;
  logo?: string;
  width?: number;
  height?: number;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({
  text,
  width = 300,
  height = 300,
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<EasyQRCode | null>(null);

  useEffect(() => {
    if (qrCodeRef.current) {
      if (qrInstanceRef.current) {
        // If QR code instance already exists, clear the container
        qrCodeRef.current.innerHTML = "";
      }

      qrInstanceRef.current = new EasyQRCode(qrCodeRef.current, {
        text,
        width,
        height,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: EasyQRCode.CorrectLevel.H, // L, M, Q, H

        // ====== dotScale
        dotScale: 0.5, // For body block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleTiming: 0.4, // Default for timing block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleTiming_H: 0.4, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleTiming_V: 0.4, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleA: 0.4, // Default for alignment block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleAO: 0.4, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
        dotScaleAI: 0.4, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1

        // ====== Quiet Zone
        quietZone: 0,
        quietZoneColor: "rgba(0,0,0,0)",

        // ====== Logo
        logo,
        // logoWidth: 80, // fixed logo width. default is `width/3.5`
        // logoHeight: 80, // fixed logo height. default is `height/3.5`
        // logoMaxWidth: 80, // Maximum logo width. if set will ignore `logoWidth` value
        // logoMaxHeight: 80, // Maximum logo height. if set will ignore `logoHeight` value
        logoBackgroundColor: "#ffffff", // Logo background color, Invalid when `logoBackgroundTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent: true, // Whether use transparent image, default is false

        // ====== Background Image
        backgroundImage: bg, // Background Image
        backgroundImageAlpha: 0.4, // Background image transparency, value between 0 and 1. default is 1
        autoColor: false, // Automatic color adjustment(for data block)
        autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
        autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color

        // ====== Colorful
        // === Position Pattern (Eye) Color
        PO: "#e1622f", // Global Position Outer color. if not set, the default is `colorDark`
        PI: "#aa5b71", // Global Position Inner color. if not set, the default is `colorDark`
        PO_TL: "", // Position Outer color - Top Left
        PI_TL: "", // Position Inner color - Top Left
        PO_TR: "", // Position Outer color - Top Right
        PI_TR: "", // Position Inner color - Top Right
        PO_BL: "", // Position Outer color - Bottom Left
        PI_BL: "", // Position Inner color - Bottom Left

        // === Alignment Color
        AO: "", // Alignment Outer. if not set, the default is `colorDark`
        AI: "", // Alignment Inner. if not set, the default is `colorDark`

        // === Timing Pattern Color
        timing: "#e1622f", // Global Timing color. if not set, the default is `colorDark`
        timing_H: "", // Horizontal timing color
        timing_V: "", // Vertical timing color

        // ====== Title
        // title: "QR Title", // content
        // titleFont: "normal normal bold 18px Arial", // font. default is "bold 16px Arial"
        // titleColor: "#004284", // color. default is "#000"
        // titleBackgroundColor: "#fff", // background color. default is "#fff"
        // titleHeight: 70, // height, including subTitle. default is 0
        // titleTop: 30, // draws y coordinates. default is 30

        // ====== SubTitle
        // subTitle: "QR subTitle", // content
        // subTitleFont: "normal normal normal 14px Arial", // font. default is "14px Arial"
        // subTitleColor: "#004284", // color. default is "4F4F4F"
        // subTitleTop: 40, // draws y coordinates. default is 0

        // ===== Event Handler
        onRenderingStart: undefined,
        onRenderingEnd: undefined,

        // ===== Versions
        /*
        version: 0, // The symbol versions of QR Code range from Version 1 to Version 40. default 0 means automatically choose the closest version based on the text length.
        */

        // ===== Binary (hex) data mode
        /*
        binary: false, // Whether it is binary mode, default is text mode. 
        */

        // ===== Tooltip
        /*
        tooltip: false, // Whether set the QRCode Text as the title attribute value of the QRCode div
        */

        // ==== CORS
        crossOrigin: null, // String which specifies the CORS setting to use when retrieving the image. null means that the crossOrigin attribute is not set.

        // ===== Drawing method
        drawer: "canvas", // Which drawing method to use. 'canvas', 'svg'. default is 'canvas'

        // ===== UTF-8 without BOM
        /*
        utf8WithoutBOM: true
        */
      });
    }
  }, [text, logo, width, height]);

  return <div ref={qrCodeRef}></div>;
};

export default QRCodeComponent;
