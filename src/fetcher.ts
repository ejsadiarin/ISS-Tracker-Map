import { ISSType } from "./types";

const API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
export async function posFetcher(): Promise<ISSType> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const ISSData: ISSType = await response.json();
    console.log(ISSData);
    return ISSData;
  } catch (error) {
    console.error("Failed to fetch ISS position:", error);
    throw error;
  }
}

//{
//    "name": "iss",
//    "id": 25544,
//    "latitude": 50.11496269845,
//    "longitude": 118.07900427317,
//    "altitude": 408.05526028199,
//    "velocity": 27635.971970874,
//    "visibility": "daylight",
//    "footprint": 4446.1877699772,
//    "timestamp": 1364069476,
//    "daynum": 2456375.3411574,
//    "solar_lat": 1.3327003598631,
//    "solar_lon": 238.78610691196,
//    "units": "kilometers"
//}
