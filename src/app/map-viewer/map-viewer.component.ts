import {Output, EventEmitter, Input, Component, SimpleChange} from "@angular/core";
import {LocationEvent, Map, Marker, LatLng} from "leaflet";
import {Injectable} from "@angular/core";
import { MapViewerService } from "./map-viewer.service";
import { MediaFile } from "../media-file/types";

import { Subscription } from 'rxjs/Subscription';
import * as geolib from 'geolib';

@Component({
  selector: "map-viewer",
  templateUrl: "./map-viewer.component.html",
  styleUrls: ['./map-viewer.component.less']
})

export class MapViewerComponent {
  public map: Map;
  @Input() mapId: string;
  @Input() media: MediaFile[];
  @Input() selected: MediaFile;
  @Output() centerMap = new EventEmitter();
  centerMarker: any;
  center: L.LatLng;
  centerStr = {
    lat: '0',
    lng: '0'
  };

  centerSub: Subscription;
  
  constructor(private mapService: MapViewerService) {
    this.center = L.latLng(-26, 66);
    this.centerToStr();
    this.centerSub = mapService.whenCurrentLocation().subscribe(n => {
      this.center = L.latLng(n.lat, n.lng);
      console.log("Localizacion del cliente")
      console.log(n);
      this.centerMap.emit(this.center);
      if (this.map != null) {
        this.map.setView(this.center, null);
      }
    });
  }

  ngOnInit() {
    console.log ("MapID: "+ this.mapId);
    console.log( "Lofggding from leaflet Component");
    console.log( this.media);
  }

  centerToStr() {
    this.centerStr.lat = geolib.decimal2sexagesimal(this.center.lat);
    this.centerStr.lng = geolib.decimal2sexagesimal(this.center.lng);
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
    var __this = this;
    if (this.map != null) {
      var map = this.map;
      if (changes['media'] !== undefined) {
        changes['media'].currentValue.forEach(function (f) {
          if (f.location !== undefined) {
            let marker = L.marker([f.location.lat, f.location.lng], {
                icon: L.icon({
                  iconUrl: '/assets/images/leaflet/marker-icon.png',
                  shadowUrl: '/assets/images/leaflet/marker-shadow.png'
                }),
                draggable: false
            })
            .bindPopup(f.name, {
                offset: L.point(12, 6)
            })
            .addTo(__this.map)
            .openPopup();
          }
        });
      } else if (changes['selected'] !== undefined) {
        if (this.map != null) {
          if (this.selected.location !== undefined)
            this.map.setView(this.selected.location, null);
        }
      }
    }
  }

  ngAfterViewInit() {
    var bmps = this.mapService.createBaseMaps();
    this.map = L.map(this.mapId, {
        zoomControl: false,
        center: L.latLng(this.mapService.currentLat!=null? this.mapService.currentLat: 0, this.mapService.currentLng!= null? this.mapService.currentLng: 0),
        zoom: 8,
        minZoom: 4,
        maxZoom: 19,
        layers: [bmps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(this.map);
    L.control.layers(bmps).addTo(this.map);
    L.control.scale().addTo(this.map);

    //let __this = this;
    if (this.media != null) {
      this.media.forEach((f: MediaFile) => {
        if (f.location !== undefined) {
          let marker = L.marker([f.location.lat, f.location.lng], {
              icon: L.icon({
                  iconUrl: '/leaflet/marker-icon.png',
                  shadowUrl: '/leaflet/marker-shadow.png'
              }),
              draggable: false
          })
          .bindPopup(f.name, {
              offset: L.point(12, 6)
          })
          .addTo(this.map)
          .openPopup();
        }
      });
    }

    this.centerMarker = L.marker([this.center.lat, this.center.lng], {
      icon: L.icon( {
        iconUrl: '/assets/icons/leaflet-target.png'
      }),
      draggable: false

    }).addTo(this.map);

    this.map.on('moveend', e => {
      this.center = this.map.getCenter();
      this.centerToStr();
      this.centerMarker.setLatLng(this.center);
      this.centerMap.emit(this.center);
    });
  }
}
