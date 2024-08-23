import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "../assets/vite.svg";
import { setupCounter } from "./counter.ts";
import { ISSType } from "./types";
import { posFetcher } from "./fetcher.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

document.addEventListener("DOMContentLoaded", async (event) => {
  const script = document.createElement("script");
  script.innerHTML = `
        (g => {
            var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
            b = b[c] || (b[c] = {});
            var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
            d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
        })({
            key: "${import.meta.env.VITE_MAPS_API_KEY}",
            v: "weekly",
            // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
            // Add other bootstrap parameters as needed, using camel case.
        });
    `;
  document.body.appendChild(script);
});

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
