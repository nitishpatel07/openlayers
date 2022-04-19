import React, { useState, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import Vector from "ol/source/Vector";
import { createRegularPolygon, createBox } from "ol/interaction/Draw";
import Draw from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import {
  Select,
  Translate,
  defaults as defaultInteractions,
} from "ol/interaction";
import "./map.css";

var map, draw;
const layers = new Map();

let fill = [
  "rgba(11, 71, 0, 0.2)",
  "rgba(120, 80, 0, 0.2)",
  "rgba(40, 1, 92, 0.3)",
];
let stroke = ["#0b4700", "#785000", "#28015c"];

const Mapping = () => {
  // const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [arr, setArr] = useState([]);
  const [active, setActive] = useState("");
  const [checked, setChecked] = React.useState(true);
  const [copy, setCopy] = React.useState(true);
  // const layer = (id, url) => {
  //   const vectorLayer = new VectorLayer({
  //     id: id,
  //     source: new VectorSource({
  //       url: url,
  //       format: new GeoJSON(),
  //     }),
  //     color: "red",
  //   });
  //   map.addLayer(vectorLayer);
  // };

  // const select = new Select();
  // console.log(arr);
  // console.log(layers.get(active));

  const copyButton = () => {
    setCopy(!copy);
  };

  const translate = new Translate({
    layers: [layers.get(active)],
  });

  useEffect(() => {
    map = new Map({
      interactions: defaultInteractions().extend([translate]),

      view: new View({
        center: fromLonLat([-104, 39]),
        zoom: 1,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "map",
      controls: [],
    });
  }, [copy]);

  const [val, setVal] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      // setName(file.name);
      // setContent(reader.result);
      sourceLayer(`layer${val + 1}`, reader.result, fill[val], stroke[val]);
      setVal(val + 1);
    };
  };

  const conversion = (features) => {
    return new GeoJSON().readFeatures(features, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  };

  const sourceLayer = (id, data, fill, stroke) => {
    const vectorSource = new Vector({
      features: conversion(data),
    });
    const vectorLayer = new VectorLayer({
      id: id,
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: fill,
        }),
        stroke: new Stroke({
          color: stroke,
          width: 2,
        }),
      }),
    });
    map.addLayer(vectorLayer);
    layers.set(id, vectorLayer);
    arr.push(id);
    setArr(arr);
  };
  var layerExtent;

  const zoomIn = (e) => {
    const { value } = e.target;
    const vector = layers.get(value);
    console.log(vector.getVisible()); // getVisible()
    vector
      .getSource()
      .getFeatures()
      .map((item) => console.log(item.clone())); // getVisible()

    if (vector.getVisible() === true) {
      layerExtent = vector.getSource().getExtent();
      if (layerExtent) {
        map.getView().fit(layerExtent); //animation keys
      }
    }
  };

  const hideLayer = (e) => {
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);
    layers.get(value).setVisible(checked);
  };

  const downloadFile = (id) => {
    const vector = layers.get(id);
    var json = new GeoJSON().writeFeatures(vector.getSource().getFeatures(), {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    download(json, "layer.geojson", "text/plain");
  };

  const addInteraction = (type) => {
    const vector = layers.get(active);
    if (vector) {
      let value = "Polygon",
        geometryFunction;
      if (type === "Square") {
        value = "Circle";
        geometryFunction = createRegularPolygon(4);
      } else if (type === "Box") {
        value = "Circle";
        geometryFunction = createBox();
      } else if (type === "Circle") {
        value = "Circle";
      }
      draw = new Draw({
        source: vector.getSource(),
        type: value,
        geometryFunction: geometryFunction,
      });
      map.addInteraction(draw);
    } else {
      console.log("no vector");
      map.addLayer();
    }
  };

  const handleChange = (val) => {
    if (draw) {
      map.removeInteraction(draw);
    }
    addInteraction(val);
  };

  return (
    <div>
      <div className="header">
        {/* <button onClick={() => layer("1", "data.json")}>show vector layer</button> */}
        <div className="buttons">
          <div>
            <input
              type="radio"
              value="Square"
              onChange={(e) => handleChange(e.target.value)}
              name="button"
            />{" "}
            add square
          </div>
          <div>
            <input
              type="radio"
              value="Box"
              onChange={(e) => handleChange(e.target.value)}
              name="button"
            />{" "}
            add rectangle
          </div>
          <div>
            <input
              type="radio"
              value="Circle"
              onChange={(e) => handleChange(e.target.value)}
              name="button"
            />{" "}
            add circle
          </div>
          <div>
            <input
              type="radio"
              value="Polygon"
              onChange={(e) => handleChange(e.target.value)}
              name="button"
            />{" "}
            add polygon
          </div>
        </div>
        <div>
          <input type="file" onChange={handleFileChange}></input>

          <input
            type="checkbox"
            id="translate"
            name="translate"
            value="Boat"
            onChange={copyButton}
          />
          <label for="translate">Translate</label>
        </div>
        {/* <p>{name}</p> */}
        {/* <p>{content}</p> */}
        {/* <p>{val}</p> */}

        <div className="layers">
          {arr.map((item) => (
            <div>
              <input
                type="checkbox"
                value={item}
                name="layers"
                defaultChecked={checked}
                onChange={hideLayer}
              />
              <span
                onClick={() => setActive(item)}
                className={`${active === item ? "red" : "normal"}`}
              >
                {item}
              </span>
              <button value={item} onClick={zoomIn}>
                zoom in
              </button>
              <button onClick={() => downloadFile(item)}>download</button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="map"
        id="map"
        style={{
          width: "100%",
          height: "500px",
        }}
      ></div>
    </div>
  );
};

export default Mapping;
