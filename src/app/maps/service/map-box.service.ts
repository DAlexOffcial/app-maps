import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MapBoxSearch } from '../interfaces/mapbox-search.interface';
import { MapBoxCoordinates } from '../interfaces/mapbox-coordinates.interface';

@Injectable({
  providedIn: 'root'
})

export class MapBoxService {

  constructor(private http : HttpClient) { }

  //https://api.mapbox.com/search/searchbox/v1/suggest?q=la+p&language=es&session_token=0a3fff87-fc85-4ca1-88d5-ac76d050c735&access_token=pk.eyJ1IjoiYWxleGRpczU1MjUiLCJhIjoiY2xxeHlzZWkzMGs4ODJpcG8xdXAybG5ycyJ9.3PSMgybuiKrSQGmL9_cr7A

  /*searchWord(query: string) : Observable<any>{
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/}'

    return this.http.get<any>(url + query + '.json?types=address&access_token=pk.eyJ1IjoiYWxleGRpczU1MjUiLCJhIjoiY2xxeHlzZWkzMGs4ODJpcG8xdXAybG5ycyJ9.3PSMgybuiKrSQGmL9_cr7A')
      .pipe(map( (res : MapBoxOutput) => {
        console.log(res);
        
        return res.features
      }))
  }*/

  searchWord(place : string) : Observable<MapBoxSearch>{

    const session_token = '0a3fff87-fc85-4ca1-88d5-ac76d050c735'

    const access_token = 'pk.eyJ1IjoiYWxleGRpczU1MjUiLCJhIjoiY2xxeHlzZWkzMGs4ODJpcG8xdXAybG5ycyJ9.3PSMgybuiKrSQGmL9_cr7A'
         
    const url = 'https://api.mapbox.com/search/searchbox/v1/suggest?q='+ place + '&language=en&session_token=' + session_token + '&access_token=' + access_token
      
    return this.http.get<MapBoxSearch>(url)
  }

  ///https://api.mapbox.com/search/searchbox/v1/retrieve/dXJuOm1ieHBvaTo5NDE4NjY2MC02NWE0LTQzYmItYjJiNS00NjU1MzlhMmJhMzM?session_token=026dc8d8-37ca-40d1-88d5-b4625730fbc8&access_token=pk.eyJ1IjoiYWxleGRpczU1MjUiLCJhIjoiY2xxeHlzZWkzMGs4ODJpcG8xdXAybG5ycyJ9.3PSMgybuiKrSQGmL9_cr7A

  getCoordinates(mapbox_id : string): Observable<MapBoxCoordinates>{

    const session_token = '0a3fff87-fc85-4ca1-88d5-ac76d050c735'

     const access_token = 'pk.eyJ1IjoiYWxleGRpczU1MjUiLCJhIjoiY2xxeHlzZWkzMGs4ODJpcG8xdXAybG5ycyJ9.3PSMgybuiKrSQGmL9_cr7A'

    const url = 'https://api.mapbox.com/search/searchbox/v1/retrieve/' + mapbox_id + '?session_token=' + session_token + '&access_token=' + access_token

    return this.http.get<MapBoxCoordinates>(url)
  }
  

}
