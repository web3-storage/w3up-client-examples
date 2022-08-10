import React, { useState, useContext, useRef, useEffect } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  PanResponder,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { ImagesContext } from "../providers/Images";
import * as FileSystem from "expo-file-system";
import Canvas, { Image as CanvasImage } from "react-native-canvas";
import uuid from "react-native-uuid";
import theme from "../theme";

function PictureModifier({ currentPhoto, onImageModified }) {
  const [base64FileUri, setBase64FileUri] = useState("");
  const [ctx, setCtx] = useState(null);
  const [pressing, setPressing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const canvasRef = useRef(null);
  const imagesContext = useContext(ImagesContext);
  const [pen, setPen] = useState({ x: 0, y: 0 });
  const [lastPen, setLastPen] = useState({ x: 0, y: 0 });
  const [lineWidth, setLineWidth] = useState(7);
  const [strokeColor, setStrokeColor] = useState("#111");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const x = Math.round(evt.nativeEvent.locationX);
        const y = Math.round(evt.nativeEvent.locationY);
        setPen({
          x,
          y,
        });
        setLastPen({
          x,
          y,
        });
      },

      onPanResponderMove: (evt, gestureState) => {
        setPen({
          x: Math.round(evt.nativeEvent.locationX),
          y: Math.round(evt.nativeEvent.locationY),
        });
        setPressing(true);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const x = Math.round(evt.nativeEvent.locationX);
        const y = Math.round(evt.nativeEvent.locationY);
        setPen({
          x,
          y,
        });
        setLastPen({
          x,
          y,
        });
        setPressing(false);
        updateModifiedImage();
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    })
  );

  const { images, addImage } = imagesContext;

  const initCanvas = (canvas) => {
    const ctx = canvas.getContext("2d");
    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new CanvasImage(canvas, 100, 100);
    img.src = base64FileUri;
    img.addEventListener("load", () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
    setCtx(ctx);
  };

  const drawOnCanvas = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(lastPen.x, lastPen.y);
    if (lastPen.x != pen.x && lastPen.y != pen.y) {
      ctx.lineWidth = lineWidth;
      ctx.lineTo(pen.x, pen.y);
      ctx.strokeStyle = strokeColor;
      ctx.strokeWidth = 9;
      ctx.stroke();
      setLastPen(pen);
    }
  };

  const updateModifiedImage = async () => {
    // const ctx = canvasRef.current.getContext("2d");
    // const imageData = await ctx.getImageData(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    let imageData = await canvasRef.current.toDataURL();
    imageData = imageData
      .replace(/^"|"$/g, ``)
      .replace("data:image/png;base64,", "");

    onImageModified(imageData);
  };

  const getFileinBase64 = async () => {
    const b64String = await FileSystem.readAsStringAsync(currentPhoto.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setBase64FileUri(`data:image/png;base64,${b64String}`);
  };

  useEffect(() => {
    if (base64FileUri == "") {
      getFileinBase64();
    }

    if (base64FileUri && canvasRef.current && dimensions.width && !ctx) {
      initCanvas(canvasRef.current);
    }

    if (pen.x && pen.y && pressing && ctx) {
      drawOnCanvas(ctx);
    }
  }, [base64FileUri, canvasRef, dimensions, pen, ctx]);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setDimensions({
          height: event.nativeEvent.layout.height,
          width: event.nativeEvent.layout.width,
        });
      }}
      {...panResponder.current.panHandlers}
    >
      <Canvas
        style={{ width: dimensions.width, height: dimensions.height }}
        width={dimensions.width}
        height={dimensions.height}
        ref={canvasRef}
      />
      <Text
        style={{
          position: "absolute",
          backgroundColor: "rgba(255,255,255, 0.5)",
        }}
      >{`${pressing ? "👇" : "☝️"} \t x:${pen.x} y:${
        pen.y
      } \t ⚫ ${lineWidth} 🎨 ${strokeColor} `}</Text>
    </View>
  );
}

export default function PictureTaker({ uploader, navigateToGallery }) {
  const imagesContext = useContext(ImagesContext);

  const { images, addImage } = imagesContext;

  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState(
    "Click Take Picture and approve the permissions!"
  );
  const [cameraRef, setCameraRef] = useState(null);

  const [currentPhoto, setCurrentPhoto] = useState(null);

  const [modifiedImage, setModifiedImage] = useState(null);

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status == "granted") {
      setCameraIsOpen(true);
      setUserMessage("Approved Camera");
    } else {
      setUserMessage("You refused camera access.");
    }
  };

  const closeCamera = () => {
    setCameraIsOpen(false);
    setCurrentPhoto(null);
  };

  const flipCamera = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    if (cameraRef !== null) {
      const photo = await cameraRef.takePictureAsync();
      setCurrentPhoto(photo);
    }
  };

  const keepCurrentPhoto = async (modifiedImage) => {
    const id = uuid.v4();
    const uri = `${FileSystem.documentDirectory}${id}.jpg`;

    console.log(modifiedImage);

    const response = await FileSystem.writeAsStringAsync(uri, modifiedImage, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(response);

    addImage({
      id,
      uri,
    });
    navigateToGallery();
  };

  let view = (
    <View>
      <TouchableOpacity style={theme.button} onPress={openCamera}>
        <Text style={theme.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      <Text>{userMessage}</Text>
      <TouchableOpacity style={theme.button} onPress={navigateToGallery}>
        <Text style={theme.buttonText}>Gallery [{images.length}]</Text>
      </TouchableOpacity>
    </View>
  );

  if (cameraIsOpen) {
    view = (
      <View
        style={{
          flex: 1,
          width,
          height,
        }}
      >
        <Camera
          style={{
            flex: 1,
            width,
            height,
          }}
          ref={(r) => setCameraRef(r)}
          type={cameraType}
        ></Camera>
        <View style={theme.cameraControlPanel}>
          <TouchableOpacity style={theme.button} onPress={takePicture}>
            <Text style={theme.buttonText}> Take Picture </Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.button} onPress={flipCamera}>
            <Text style={theme.buttonText}> Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme.button} onPress={closeCamera}>
            <Text style={theme.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cameraIsOpen && currentPhoto) {
    view = (
      <View
        style={{
          flex: 1,
          width: width,
        }}
      >
        <PictureModifier
          currentPhoto={currentPhoto}
          onImageModified={(currentModifiedImage) => {
            setModifiedImage(currentModifiedImage);
          }}
        />
        <View style={theme.cameraControlPanel}>
          <TouchableOpacity
            style={theme.button}
            onPress={() => {
              if (currentPhoto.uri && modifiedImage) {
                keepCurrentPhoto(modifiedImage);
              }
            }}
          >
            <Text style={theme.buttonText}>Keep</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={theme.button}
            onPress={() => {
              setCurrentPhoto(null);
            }}
          >
            <Text style={theme.buttonText}> Retry </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <View style={theme.container}>{view}</View>;
}
