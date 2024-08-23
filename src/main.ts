import "./style.css";
import { ISSType } from "./types";
import { posFetcher } from "./fetcher.ts";

async function elementUpdater(data: ISSType) {
  try {
    // Request needed libraries.
    const { Map } = (await google.maps.importLibrary(
      "maps",
    )) as google.maps.MapsLibrary;

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;

    const myLatlng = { lat: data.latitude, lng: data.longitude };

    const img = document.createElement("img");
    img.src = "./assets/issImage.png";
    img.alt = "ISSIMAGE";
    img.width = 100;
    img.height = 100;
    img.id = "iss";

    let map = new Map(document.getElementById("map") as HTMLElement, {
      zoom: 4,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      mapId: "ISS_MAP_ID",
    });

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
      position: myLatlng,
    });
    infoWindow.setContent(JSON.stringify(myLatlng, null, 2));

    infoWindow.open(map);

    let overlayImg = new AdvancedMarkerElement({
      map: map,
      position: myLatlng,
      content: img,
      title: "ISS",
      zIndex: 999,
    });

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();

      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
      );
      infoWindow.open(map);
    });
  } catch (error) {
    console.error("Failed to render map: ", error);
    throw error;
  }
}

const data = await posFetcher();
elementUpdater(data);

setInterval(async () => {
  try {
    const data = await posFetcher();
    elementUpdater(data);
  } catch (error) {
    console.error("Failed to render map: ", error);
    throw error;
  }
}, 5000);

export {};
