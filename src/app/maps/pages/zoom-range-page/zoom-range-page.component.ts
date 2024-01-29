import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import  { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit , OnDestroy{


  public zoom: number = 10
  public map?: Map;
  public LngLat: LngLat = new LngLat(-103.37851677182172, 20.71749179174745)

  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {

    if(!this.divMap) throw 'el elemento HTML no esta disponible';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.LngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListers()
  }

  ngOnDestroy(): void {
    this.map!.remove()
  }


  mapListers(){
    if( !this.map ) throw 'Mapa no encontrado'
    
    this.map.on('zoom' , (ev) => {
       this.zoom = this.map!.getZoom()
    })

    this.map.on('zoomend' , (ev) => {
      if( this.map!.getZoom() < 18) return
      this.map!.zoomTo(18)
    })

    this.map.on('move', ()=>  {
      this.LngLat = this.map!.getCenter()      
    })
  }
 
  zoomIn(){
    this.map?.zoomIn()
  }

  zoomOut(){
    this.map?.zoomOut()
  }

  zoomChange( value :string){
    this.zoom = Number(value)
    this.map?.zoomTo( this.zoom)
  }

}
