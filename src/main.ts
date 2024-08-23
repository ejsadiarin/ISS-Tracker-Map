import "./style.css";
import { ISSType } from "./types";
import { posFetcher } from "./fetcher.ts";

let map: google.maps.Map;
//let infoWindow: google.maps.InfoWindow;
let overlayImgNew: google.maps.marker.AdvancedMarkerElement;

// construct/initialize/render the needed elements with default values
// -> values get populated at runtime (with API)
async function initMap() {
  const { Map } = (await google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    zoom: 4,
    center: { lat: 0, lng: 0 },
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    mapId: "ISS_MAP_ID",
  });

  //infoWindow = new google.maps.InfoWindow({
  //  position: { lat: 0, lng: 0 },
  //});

  const img = document.createElement("img");
  img.src = "./assets/iss-tracker-map-icon-img.png";
  img.alt = "ISSIMAGE";
  img.width = 250;
  img.height = 230;
  img.id = "iss";

  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    "marker",
  )) as google.maps.MarkerLibrary;
  overlayImgNew = new AdvancedMarkerElement({
    map: map,
    position: { lat: 0, lng: 0 },
    content: img,
    title: "ISS",
    zIndex: 999,
  });
}

async function updateElements(data: ISSType) {
  const myLatlng = { lat: data.latitude, lng: data.longitude };

  // update map center
  map.setCenter(myLatlng); // can turn off if becomes annoying lol

  // update InfoWindow position and content
  //infoWindow.setPosition(myLatlng);
  //infoWindow.setContent(JSON.stringify(myLatlng, null, 2));
  //infoWindow.open(map);

  // update overlay image position
  overlayImgNew.position = myLatlng;
}

function updateISSInfoData(data: ISSType) {
  document.querySelector<HTMLParagraphElement>("#latitude")!.textContent =
    `Latitude: ${data.latitude.toString()}`;
  document.querySelector<HTMLParagraphElement>("#longitude")!.textContent =
    `Longitude: ${data.longitude.toString()}`;
  document.querySelector<HTMLParagraphElement>("#altitude")!.textContent =
    `Altitude: ${data.altitude.toString()}`;
  document.querySelector<HTMLParagraphElement>("#velocity")!.textContent =
    `Velocity: ${data.velocity.toString()}`;
  document.querySelector<HTMLParagraphElement>("#units")!.textContent =
    `Units: ${data.units}`;
}

initMap().then(async () => {
  const data = await posFetcher();
  updateElements(data);

  // fetch new latlong data every 5 seconds
  setInterval(async () => {
    try {
      const data = await posFetcher();
      updateElements(data);
      updateISSInfoData(data);
    } catch (error) {
      console.error("Failed to render map: ", error);
      throw error;
    }
  }, 5000);
});
