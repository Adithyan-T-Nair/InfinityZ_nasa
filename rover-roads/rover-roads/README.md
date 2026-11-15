# Rover Roads – Moon & Mars

An interactive 3D web app that shows where NASA landers and rovers touched down on the Moon and Mars, how far each one travelled, and the story of each mission.

---

## 1. Problem statement

Numbers like "45.16 km" or "27.8 km" are easy to read and hard to feel. A table of rover distances does not show **where** these machines went, **how big** that distance is on a real planet, or **what** each mission actually achieved. Mission facts are also scattered across many separate NASA pages (NASA Science, NSSDCA, mission sites), each with a different layout.

**Goal:** build one clean, visual, easy-to-explore place where a person can:

1. See the Moon and Mars as realistic 3D worlds, using real NASA-based surface maps.
2. Find every landing site as a clickable marker at its true latitude and longitude.
3. Understand each rover's driving distance at true scale (a ring on the planet with that distance as its radius).
4. Read the key facts and story of each mission in short, organised slides instead of long web pages.
5. Compare any spot on the surface with the nearest landing site by dropping their own pin.

---

## 2. What the project does (features)

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

## 3. Missions included

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

## 4. Project structure

```
rover-roads/
├── index.html              Page structure only (buttons, panels, script/style links)
├── css/
│   └── style.css           All styling, including the phone layout
├── js/
│   ├── config.js           Texture paths, planet radii, shared text
│   ├── data/
│   │   └── missions.js     ALL mission content: facts, slides, coordinates, distances
│   ├── globe.js            3D scene, planets, markers, rings, camera controls, picking
│   ├── panels.js           Mission card, 3D model viewer, detail slides, user pins
│   └── main.js             Home / Moon / Mars navigation and start-up
├── assets/
│   └── textures/
│       ├── moon.jpg        Moon surface map (2K)
│       └── mars.jpg        Mars surface map (2K)
├── start-server.bat        One-click local server (Windows)
├── start-server.sh         One-click local server (Mac/Linux)
└── README.md
```

Scripts are plain (non-module) files that share global variables, and `index.html` loads them in this order: `config.js` → `data/missions.js` → `globe.js` → `panels.js` → `main.js`. Keep that order if you add files.

---

## 5. How it works (technical details)

**Technology:** HTML, CSS and vanilla JavaScript with [three.js r128](https://threejs.org/) (WebGL), loaded from the cdnjs CDN. There is no build step and no framework.

**Planet surfaces.** Each world is a 128 × 96 segment sphere. The 2K image is an equirectangular map (longitude 0° at the centre, east to the right). The same image is also used as a bump map so craters and ridges get shading. Texture colour uses sRGB output for correct brightness. Mars gets a second, slightly larger back-face sphere with a small shader that makes a soft orange rim glow.

**Latitude/longitude to 3D.** The function `ll(lat, lon)` converts coordinates to a point on the unit sphere (x = cos φ · cos λ, y = sin φ, z = −cos φ · sin λ). This matches how the texture wraps, so a marker sits on the right spot of the image. Longitudes are east-positive, so western longitudes are negative.

**Distance rings.** A ring is a small circle on the sphere around the landing site. Its angular radius is `distance ÷ planet radius` (Moon 1,737.4 km, Mars 3,389.5 km), so the ring is to true scale. It shows how far the vehicle travelled in total, not its actual route.

**Pin mode.** A tap on the surface is raycast to a point, converted to latitude/longitude, and compared with every landing site using the haversine great-circle formula. The nearest site is reported, along with whether the pin falls inside that site's ring.

**Camera and input.** One-finger or mouse drag rotates the planet. Two-finger pinch or scroll zooms. A tap with under 5 px of movement counts as a click. Marker sizes scale with zoom so they stay tappable.

**Mission card model.** The 3D vehicle in the card is built from simple boxes and cylinders (rover, Moon buggy, lander, helicopter). It is a stylised shape, not an engineering model.

**Data format.** Each mission in `js/data/missions.js` is one object:

```js
{ id:"op", pl:"mars", n:"Opportunity", tag:"Mars Exploration Rover · Meridiani Planum",
  yr:2004, lat:-1.946, lon:-5.527, km:45.16, ty:"mer", src:"NASA Science",
  s:[ ["Overview","paragraph",[["Landed","Jan 24, 2004"]],["bullet 1","bullet 2"]], ... ] }
```

| Field | Meaning |
|---|---|
| `id` | Short unique ID |
| `pl` | `moon`, `mars` or `deep` (deep = shown in the "Other missions" list only) |
| `n`, `tag` | Display name and subtitle |
| `yr`, `lat`, `lon` | Landing year and coordinates (degrees, east-positive longitude) |
| `km` | Distance in kilometres, or `null` if none |
| `lb` | Optional label for the number (e.g. "DISTANCE WALKED", "DISTANCE FLOWN") |
| `st:1` | Marks a stationary lander (shows "Stationary lander") |
| `ty` | 3D model: `lrv`, `lm`, `mer`, `big`, `heli` |
| `pin:0` | No marker on the globe; reached through a neighbour's `also` button |
| `also` | ID of a mission at the same site, shown as a button on the card |
| `s` | Slides: `[title, paragraph, [[label, value]…], [bullets…]]` (use `0` to skip a part) |
| `src` | Source line shown under the slides |

---

## 6. How to run

Browsers block the planet images when a page is opened by double-clicking `index.html`, so serve the folder instead:

- **Quickest:** run `start-server.bat` (Windows) or `./start-server.sh` (Mac/Linux; needs Python), then open **http://localhost:8000**.
- **VS Code:** install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.
- **Any static host:** drag the whole folder onto [netlify.com/drop](https://app.netlify.com/drop), or push it to a GitHub repo and enable GitHub Pages.

An internet connection is needed for the three.js library from the CDN. To make the project fully offline, download `three.min.js` (r128), put it in `js/lib/`, and change the `<script src="https://cdnjs…">` line in `index.html` to `js/lib/three.min.js`.

**Browser requirements:** a current Chrome, Edge, Firefox or Safari with WebGL enabled.

---

## 7. How to edit or extend

- **Add a mission:** copy an entry in `js/data/missions.js`, change the fields, done. A marker, card and slides appear automatically.
- **Update a distance:** change its `km` value (kilometres).
- **Change colours, fonts or layout:** `css/style.css` (colours are variables at the top).
- **Use higher-resolution textures:** replace the two JPGs in `assets/textures/` with 4K versions of the same name. They look sharper up close but load slower.
- **Change marker or ring colours:** `js/globe.js`, in the `init` function.

---

## 8. Data accuracy notes

- Distances come from NASA mission pages and NASA's driving-distance chart (Oct 12, 2026). Apollo 15 shows 27.8 km (chart); the NSSDCA page totals its three traverses at 27.9 km. Both are noted in its slides.
- **Mars Pathfinder:** the supplied NASA page gave no coordinates, so the position (19.13° N 33.22° W) is approximate.
- **InSight:** coordinates are rounded to 4.5° N, 135.9° E, as given on its NASA page.
- **Apollo 16 and 17:** only landing year, location and distance are included, because their mission pages were not part of the source material.
- **Apollo 11 and 12** show distance *walked* by the astronauts, not driven.
- **Surveyor 3 and Ingenuity** share a site with Apollo 12 and Perseverance, so they have no marker of their own. Open them from the neighbouring mission's card.
- Landing coordinates are shown as approximate because the marker is drawn on a 2K map, so precision is limited to a few kilometres.
- The distance ring shows total reach around the landing site, not the real driving route.

---

## 9. Possible future improvements

- Draw each rover's real driven route instead of a simple ring.
- Add mission photos and video links.
- Add the Chinese and Soviet rovers (Yutu, Yutu 2, Lunokhod 1 and 2, Zhurong) to the Moon and Mars views.
- Add Apollo 16 and 17 mission slides.
- Add a timeline slider to show missions appearing by year.
- Add 4K textures and elevation maps for real terrain relief.
- Support offline use through a service worker.

---

## 10. Credits and sources

- **Surface textures:** [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0), based on NASA data.
- **Mission facts and distances:** NASA Science (science.nasa.gov) mission pages and the NASA Space Science Data Coordinated Archive (NSSDCA): Apollo 11, 12 and 15; Surveyor 3; Viking 1; Mars Pathfinder; Spirit and Opportunity; InSight; Ingenuity; Dawn; Kepler / K2; Pioneer 10; NEAR Shoemaker.
- **3D engine:** three.js (MIT license).
- Built with the help of Claude (Anthropic).

This is an educational, non-commercial project and is not affiliated with or endorsed by NASA.