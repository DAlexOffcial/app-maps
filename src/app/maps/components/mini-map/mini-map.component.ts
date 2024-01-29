import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import {  Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit{

  @Input() lngLat?: [number , number]

  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {
    if(!this.divMap?.nativeElement) throw "Map Div not found"
    if(!this.lngLat) throw "Map can not be null"

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat , 
      zoom: 15, // starting zoom
      interactive :  false
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( map )
  }
}
