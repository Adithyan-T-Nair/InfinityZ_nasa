# Rover Roads – Moon & Mars (InfinityZ NASA)

An interactive 3D web app that shows where NASA landers and rovers touched down on the Moon and Mars, how far each one travelled, and the story of each mission.

---

## 1. Problem Statement

Numbers like "45.16 km" or "27.8 km" are easy to read and hard to feel. A table of rover distances does not show **where** these machines went, **how big** that distance is on a real planet, or **what** each mission actually achieved. Mission facts are also scattered across many separate NASA pages (NASA Science, NSSDCA, mission sites), each with a different layout.

**Goal:** build one clean, visual, easy-to-explore place where a person can:

1. See the Moon and Mars as realistic 3D worlds, using real NASA-based surface maps.
2. Find every landing site as a clickable marker at its true latitude and longitude.
3. Understand each rover's driving distance at true scale (a ring on the planet with that distance as its radius).
4. Read the key facts and story of each mission in short, organised slides instead of long web pages.
5. Compare any spot on the surface with the nearest landing site by dropping their own pin.

---

## 2. Features

| Feature | Description |
|---|---|
| **Realistic globes** | The Moon and Mars use 2K NASA-based surface maps wrapped on 3D spheres, with relief shading so craters catch the light. Mars also has a thin atmosphere glow. |
| **Home screen** | Both worlds float side by side. Hover one to bring it forward, click to explore. |
| **Landing-site markers** | Cyan markers at each site's real coordinates. Tap one to open the mission card. |
| **Mission card** | Name, tagline, landing year, coordinates, a rotating 3D model of the vehicle, and the distance driven (or flown or walked). |
| **Detail slides** | The "Mission details →" button opens a side panel (a bottom sheet on phones) with tabs and Back/Next buttons: Overview, journey, science, records. |
| **Distance rings** | A ring around each landing site whose radius equals the distance travelled, drawn to true scale on the planet. |
| **Pin mode** | Turn it on, tap anywhere on the surface to drop an orange pin. The app reports the nearest landing site, the distance to it, and whether the pin is inside that rover's driven-distance ring. |
| **Units toggle** | Switch between miles and kilometres. |
| **Other missions list** | Dawn, Kepler, Pioneer 10 and NEAR Shoemaker don't land on the Moon or Mars, so they live in a list in the top menu with their own slides. |
| **Touch and mouse controls** | Drag to rotate, scroll or pinch to zoom, tap to select. Works on phones, tablets and desktops. |

---

## 3. Missions Included

Distances are from the NASA pages and NASA's "driving distances" chart (as of **Oct 12, 2026**). Curiosity and Perseverance are still driving, so their numbers will grow.

### Moon
| Mission | Landed | Site | Distance |
|---|---|---|---|
| Apollo 11 (LM "Eagle") | Jul 20, 1969 | Mare Tranquillitatis, 0.67° N 23.47° E | ~0.25 km walked |
| Apollo 12 (LM "Intrepid") | Nov 19, 1969 | Oceanus Procellarum, 3.01° S 23.42° W | ~1.35 km walked |
| Surveyor 3 *(same site as Apollo 12)* | Apr 20, 1967 | Oceanus Procellarum, ~3.0° S 23.41° W | stationary lander |
| Apollo 15 (Lunar Roving Vehicle) | Jul 30, 1971 | Foot of the Apennines, Mare Imbrium, 26.13° N 3.63° E | 27.8 km driven |
| Apollo 16 (Lunar Roving Vehicle) | 1972 | 8.97° S 15.50° E | 27.1 km driven |
| Apollo 17 (Lunar Roving Vehicle) | 1972 | 20.19° N 30.77° E | 35.74 km driven |

### Mars
| Mission | Landed | Site | Distance |
|---|---|---|---|
| Viking 1 | Jul 20, 1976 | Chryse Planitia, 22.48° N 47.94° W | stationary lander |
| Mars Pathfinder / Sojourner | Jul 4, 1997 | Ares Vallis (approx. 19.13° N 33.22° W) | ~0.1 km (Sojourner) |
| Spirit | Jan 3, 2004 | Gusev Crater, 14.57° S 175.48° E | 7.7 km |
| Opportunity | Jan 24, 2004 | Meridiani Planum, 1.95° S 5.53° W | 45.16 km |
| Curiosity | 2012 | Gale Crater, 4.59° S 137.44° E | 38.15 km (still driving) |
| InSight | Nov 26, 2018 | Elysium Planitia (~4.5° N 135.9° E) | stationary lander |
| Perseverance | Feb 18, 2021 | Jezero Crater, 18.45° N 77.45° E | 45.22 km (still driving) |
| Ingenuity *(same site as Perseverance)* | Feb 18, 2021 | Jezero Crater | ~17.0 km flown over 72 flights |

### Other missions (list only, no globe marker)
Dawn (Vesta and Ceres), Kepler / K2 (planet-hunting telescope), Pioneer 10 (first to Jupiter), NEAR Shoemaker (first to orbit and land on an asteroid).

---

## 4. Project Structure

```
.
├── README.md
├── data/                   NASA reference source documents and textures
└── rover-roads/
    └── rover-roads/
        ├── index.html      Page structure
        ├── css/style.css   All styling and responsive layout
        ├── js/
        │   ├── config.js   Texture paths, planet radii, shared text
        │   ├── data/       Mission facts, slides, coordinates, distances
        │   ├── globe.js    3D scene, planets, markers, rings, camera
        │   ├── panels.js   Mission card, 3D model viewer, detail slides
        │   └── main.js     Navigation and start-up
        ├── assets/         2K Moon and Mars textures
        ├── start-server.bat
        └── start-server.sh
```

---

## 5. How to Run

1. **Quickest:** run `start-server.bat` inside `rover-roads/rover-roads/` (Windows) or `./start-server.sh` (Mac/Linux), then open **http://localhost:8000**.
2. **VS Code:** install the *Live Server* extension, open `rover-roads/rover-roads/index.html` with Live Server.
3. **Static host:** host on GitHub Pages, Netlify, or Vercel.
