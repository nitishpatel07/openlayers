import React, { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat, transform } from "ol/proj";
import { createBox } from "ol/interaction/Draw";
import Draw from "ol/interaction/Draw";
import { Fill, Stroke, Style } from "ol/style";
import { defaults as defaultInteractions } from "ol/interaction";
import "./map.css";
import Feature from "ol/Feature.js";
import GeoJSON from "ol/format/GeoJSON";
import { DUMMY } from "./dummydata";
import CoordinateInputForm from "./coordinateInputForm";
import { Polygon } from "ol/geom";
import { postAPI } from "./api";
import TileImage from "ol/source/TileImage";
import Logo from "./logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import CircularProgressOverlay from "./circularProgressOverlay";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import MapIcon from "@mui/icons-material/Map";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CircularProgress from "@mui/material/CircularProgress";
import {
  formatLargeNumber,
  showFailureToast,
  showRegularToast,
  showSuccessToast,
} from "./helperFunctions";
import { Link } from "react-router-dom";

var map;
let messageDisplayed = false;
export const MyContext = React.createContext();

export const TestMap = () => {
  const [draw, setDraw] = useState(false);
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [checked, setChecked] = React.useState(false);
  const [fillOpacity, setFillOpacity] = useState(0);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [area, setArea] = useState(0);
  const mapEl = useRef(null);

  const createFillStyleInput = (fillOpacity) => {
    return new Style({
      fill: new Fill({
        color: `rgba(250, 244, 67, ${fillOpacity})`,
      }),
      stroke: new Stroke({
        color: "#faf443",
        width: 2,
      }),
    });
  };

  const createFillStyleOutput = (fillOpacity) => {
    return new Style({
      fill: new Fill({
        color: `rgba(237, 36, 36, ${fillOpacity})`,
      }),
      stroke: new Stroke({
        color: "#ed2424",
        width: 2,
      }),
    });
  };

  useEffect(() => {
    const google = new TileLayer({
      id: "base-layer",
      source: new TileImage({
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      }),
    });

    map = new Map({
      target: mapEl.current,
      interactions: defaultInteractions(),

      layers: [google],

      view: new View({
        center: fromLonLat([-49.22371, -22.62051]),
        zoom: 5,
      }),
      controls: [],
    });

    return () => map.setTarget(null);
  }, [state]);

  const vectorSource = new VectorSource();

  const vectorLayer = new VectorLayer({
    id: "input-layer",
    source: vectorSource,
    style: createFillStyleInput(fillOpacity),
  });

  let NGROK = "https://ee62-35-230-100-55.ngrok.io";
  let POST_URL = NGROK + "/request";
  let POLL_URL = NGROK + "/poll";

  const zoomToExtent = (feat) => {
    map.getView().fit(feat.getGeometry().getExtent(), {
      duration: 300,
      maxZoom: 25,
      padding: [75, 75, 75, 75],
    });
  };

  const apiFunction = (coords) => {
    const params = {
      request: { region: coords },
    };
    postAPI(POST_URL, params)
      .then((response) => {
        console.log(response);
        setLoader(false);
        showSuccessToast("Post processing done!");
        setProgress(8);
        setTimeout(() => {
          showRegularToast("Fetching Images!");
        }, 1000);
        // Second API request
        const interval = setInterval(function () {
          postAPI(POLL_URL, {})
            .then((response) => {
              console.log(response);
              if (response.progress !== 1) {
                setProgress(parseInt(response.progress * 100));
              } else {
                if (!messageDisplayed) {
                  setProgress(100);
                  showSuccessToast("Images Fetched");
                  setTimeout(() => {
                    setProgress(0);
                    showRegularToast("Generating Data");
                    setLoader(true);
                  }, 3000);
                  messageDisplayed = true;
                }
              }

              const vLayer = new VectorLayer({
                source: new VectorSource({
                  features: new GeoJSON().readFeatures(response, {
                    dataProjection: "EPSG:4326",
                    featureProjection: "EPSG:3857",
                  }),
                }),
                style: createFillStyleOutput(fillOpacity),
              });
              map?.addLayer(vLayer);
              if (response.complete) {
                setLoader(false);
                clearInterval(interval);
                showSuccessToast("Final output generated");
              }
            })
            .catch((e) => {
              showFailureToast("Failed! Please reload and try again");
              console.error(e);
            });
        }, 10000);
      })
      .catch((e) => {
        setTimeout(() => {
          showFailureToast("Failed! Please reload and try again");
          setLoader(false);
        }, 1000);
        console.log(e);
      });
  };

  useEffect(() => {
    const inputCoords = coordinates;
    const outputCoords = inputCoords.map((coordinate) =>
      transform(coordinate, "EPSG:4326", "EPSG:3857")
    );
    const polygonCoords = outputCoords.concat([outputCoords[0]]);
    if (polygonCoords[0] !== undefined) {
      const polygon = new Polygon([polygonCoords]);
      setArea(polygon.getArea() / Math.pow(10, 6));
      const feature = new Feature(polygon);
      const source = new VectorSource({ features: [feature] });
      const layer = new VectorLayer({
        id: "input-layer",
        source: source,
        style: createFillStyleInput(fillOpacity),
      });
      map?.addLayer(layer);
      zoomToExtent(feature);
      console.log(coordinates);
      setLoader(true);
      showRegularToast("Post processing started");
      apiFunction(inputCoords);
    }
  }, [coordinates]);

  useEffect(() => {
    const drawing = new Draw({
      source: vectorSource,
      type: "Circle",
      geometryFunction: createBox(),
    });

    drawing.on("drawend", function (event) {
      map.removeInteraction(drawing);
      setDraw(false);
      const feature = new Feature({
        geometry: event.feature.getGeometry(),
      });
      vectorLayer.getSource().addFeature(feature);
      setArea(feature.getGeometry().getArea() / Math.pow(10, 6));
      zoomToExtent(feature);
      const clonedFeature = feature.clone();
      const geometry = clonedFeature.getGeometry();
      geometry.transform("EPSG:3857", "EPSG:4326");
      clonedFeature.setGeometry(geometry);
      const coords = clonedFeature.getGeometry().getCoordinates()[0];
      coords.pop();
      console.log(coords);
      map?.addLayer(vectorLayer);
      setLoader(true);
      showRegularToast("Post processing started");
      apiFunction(coords);
    });

    draw && map?.addInteraction(drawing);
  }, [draw]);

  const handleClick = () => {
    setDraw(!draw);
  };

  const handleClose = () => {
    setOpen(!open);
    console.log(open);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setFillOpacity(fillOpacity === 0 ? 0.4 : 0);
  };

  const resetState = () => {
    setState(!state);
    setDraw(false);
    setOpen(true);
    setProgress(0);
    setChecked(false);
    setFillOpacity(0);
    setLoader(false);
    setArea(0);
  };

  useEffect(() => {
    const layers = map?.getLayers().getArray().slice(1);
    layers.forEach((layer) => {
      if (layer.get("id") === "input-layer") {
        layer.setStyle(createFillStyleInput(fillOpacity));
      } else {
        layer.setStyle(createFillStyleOutput(fillOpacity));
      }
    });
  }, [fillOpacity]);

  return (
    <div className="app">
      <div className="header">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="name-box">
          <h4 className="name">test@attentive.ai</h4>
          <Link to="/login">
            <LogoutIcon className="icon" />
          </Link>
        </div>
      </div>
      <div
        className="mapContainer"
        style={{ cursor: draw ? "crosshair" : "default" }}
      >
        <div className={open ? "collapsible-coloum" : "show-coloum"}>
          <MyContext.Provider value={{ coordinates, setCoordinates }}>
            <CoordinateInputForm />
          </MyContext.Provider>
          <div className="fill-box">
            <div style={{ display: "flex", alignItems: "center" }}>
              <FormatColorFillIcon
                style={{ marginRight: "0.5rem", transform: "scale(.95)" }}
                size="large"
              />
              <h3>Fill Colour</h3>
            </div>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
        </div>

        <ArrowBackIosNewSharpIcon
          className={open ? "collapsible-button" : "show-button"}
          onClick={handleClose}
        />
        <Tooltip title="Draw" placement="top" arrow>
          <HighlightAltIcon
            className="draw-button"
            style={{ cursor: "pointer", padding: "5px 10px" }}
            onClick={handleClick}
          />
        </Tooltip>

        <Tooltip title="Reset" placement="top" arrow>
          <RestartAltIcon
            className="reset-button"
            style={{ cursor: "pointer", padding: "5px 10px" }}
            onClick={resetState}
          />
        </Tooltip>

        <div className="lot-area-box">
          <div style={{ display: "flex", alignItems: "center" }}>
            <MapIcon
              style={{
                marginRight: "0.15rem",
                transform: "scale(.75)",
                color: "#54bc7f",
              }}
            />
            <h5
              style={{
                marginRight: "1rem",
                color: "#fff",
                fontWeight: "400",
              }}
            >
              Lot Area
            </h5>
          </div>
          <h5 style={{ color: "#54bc7f" }}>
            {formatLargeNumber(parseInt(area))} sq.km{" "}
          </h5>
        </div>

        <div ref={mapEl} className="map" id="map" />
        {progress !== 0 && <CircularProgressOverlay progress={progress} />}
        {loader && (
          <div>
            <div className="loader-bg"></div>
            <CircularProgress
              className="loader"
              thickness={2}
              style={{ width: "150px", height: "150px", color: "#1f366b" }}
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
