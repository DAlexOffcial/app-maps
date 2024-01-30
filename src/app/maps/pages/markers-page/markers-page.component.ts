import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { MapBoxService } from '../../service/map-box.service';

interface MarkerAndColor {
  color: string,
  marker: Marker
}

interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  public markers: MarkerAndColor[] = []
  public map!: Map;
  public LngLat: LngLat = new LngLat(2.2945, 48.8584)
  isRotating: boolean = false;

  private _mabBoxService = inject(MapBoxService)

  addresses: string[] = []

  selectrdAddress = ''

  mapbox_id: string = ''

  animationFrameId: number = 0;

  plainMarkers: PlainMarker[] = [
    { color: "#830fa9", lngLat: [-103.433149480852, 20.63779985475925] },
    { color: "#5346da", lngLat: [-103.35221461124456, 20.65630444948806] },
    { color: "#d22ad0", lngLat: [-103.43184839013702, 20.683547191660807] },
    { color: "#f76819", lngLat: [-103.3509927876803, 20.694796489724368] },
    { color: "#ce4fe2", lngLat: [-94.07478419448307, 42.47861279287264] },
    { color: "#16904d", lngLat: [-94.17177284241916, 42.50698111759888] },
    { color: "#cea7e7", lngLat: [-87.62615011527669, 41.88810354929922] },
    { color: "#d19cfb", lngLat: [2.2943984481244684, 48.85835066619654] },
    { color: "#b7fdd4", lngLat: [2.3058746069374934, 48.851481116354506] },
    { color: "#545772", lngLat: [-103.45479119300752, 20.56951661081868] },
  ]

  search(event: Event | string) {
    let searchTerm: string;

    if (typeof event === 'string') {
      searchTerm = event;
    } else {
      searchTerm = (event.target as HTMLInputElement).value;
    }

    if (searchTerm && searchTerm.length > 0) {
      searchTerm = searchTerm.replace(' ', '+');

      this._mabBoxService.searchWord(searchTerm).subscribe(data => {
        this.mapbox_id = data.suggestions[0].mapbox_id;
        this.addresses = data.suggestions.map(suggestion => suggestion.name);
        console.log(this.mapbox_id);


      });
    }
  }

  onSelect(address: Event) {
    const selectedAddress = (address.target as HTMLLIElement).innerText.trim();
    this.selectrdAddress = selectedAddress
    console.log(selectedAddress);

    this.search(selectedAddress);

  }


  flyToPlace() {
    this._mabBoxService.getCoordinates(this.mapbox_id).subscribe(data => {
      const lat = data.features[0].properties.coordinates.latitude
      const log = data.features[0].properties.coordinates.longitude
      console.log(lat, log);

      this.map?.flyTo({
        zoom: 19,
        center: [log, lat]
      })
    })
  }



  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'el elemento HTML no esta disponible';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/standard', // style URL
      center: this.LngLat, // starting position [lng, lat]
      zoom: 17, // starting zoom
      pitch: 45
    });

    this.map.on('style.load', () => {

      // planisies 
      this.map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      this.map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });



      // 3d 
      const layers = this.map.getStyle().layers;
      for (const layer of layers) {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          // remove text labels
          this.map.removeLayer(layer.id);
        }
      }

      this.map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

    });

    this.readFromLocalStorage()
  }

  createMarket() {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const LngLat = this.map.getCenter()

    this.addMartek(LngLat, color)
  }

  addMartek(LngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(LngLat)
      .addTo(this.map)

    this.markers.push({
      color,
      marker
    })
    this.saveToLocalStorage()

    marker.on('dragend', () => {
      this.saveToLocalStorage()
    })
  }

  deleteMarket(index: number) {
    this.markers[index].marker.remove()
    this.markers.splice(index, 1)
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    })

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers))

  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]'
    this.plainMarkers = JSON.parse(plainMarkersString)

    this.plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat
      const coords = new LngLat(lng, lat)

      this.addMartek(coords, color)
    })
  }

  rotateCamera(timestamp: number): void {
    const rotationSpeed = 0.5;  // Ajusta este valor según tu preferencia

    if (this.isRotating) {
      this.map.rotateTo((timestamp * rotationSpeed) % 360, { duration: 0 });
      this.animationFrameId = requestAnimationFrame(() => this.rotateCamera(timestamp + 1));
    }
  }

  startRotation(): void {
    this.isRotating = true;
    this.rotateCamera(0);
  }

  stopRotation(): void {
    this.isRotating = false;
    cancelAnimationFrame(this.animationFrameId);
  }


}
