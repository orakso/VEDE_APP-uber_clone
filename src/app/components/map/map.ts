import { Component, NgZone, ViewChild, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { 
  ActionSheetController, 
  AlertController, 
  App, 
  LoadingController, 
  NavController, 
  Platform, 
  ToastController
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

declare var google: any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapDirective implements OnInit, OnChanges{
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  @Input() isPickupRequested: boolean;

  listSearch: string = '';

  map: any;
  pickupMarker: any;
  loading: any;
  error: any;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public nav: NavController,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation
  ) {
    this.platform.ready().then(() => {

    });
  }

  ngOnInit(){
    this.loadMaps();
    this.addMapEventListeners();
  }

  ngOnChanges(changes){
    console.log(changes);
    if(this.pickupMarker){
      if(this.isPickupRequested){
        this.pickupMarker.setDraggable(false);
      }else if(!this.isPickupRequested){
        this.pickupMarker.setDraggable(true);
      }
    }
  }

  loadMaps() {
    if (google) {
      this.initializeMap();
      this.initAutocomplete();
    } else {
      this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
    }
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }

  initAutocomplete(): void {
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.createAutocomplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);
      let options = {
        center: location,
        zoom: 10
      };
      this.map.setOptions(options);

      this.placePickUpMarker(location);
     
      //this.addMarker(location);//, "Pickup");
      
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          console.log('Searched: ', place.geometry.location.lat() + ', ' + place.geometry.location.lng());
          sub.next(place.geometry.location);
          //sub.complete();
        }
      });
    });
  }
  
  initializeMap() {
    this.zone.run(() => {
      var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map(mapEle, {
        zoom: 10,
        center: { lat: 52.2170692, lng: 21.0158284 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // styles: [
        //   { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, 
        //   { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, 
        //   { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, 
        //   { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, 
        //   { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, 
        //   { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, 
        //   { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, 
        //   { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, 
        //   { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, 
        //   { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, 
        //   { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, 
        //   { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, 
        //   { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, 
        //   { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }
        // ],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });

      this.getCurrentPosition();

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        google.maps.event.trigger(this.map, 'resize');
        mapEle.classList.add('show-map');
      });

      google.maps.event.addListener(this.map, 'bounds_changed', () => {
        this.zone.run(() => {
          this.resizeMap();
        });
      });
    });
  } 

  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 200);
  }

  getCurrentPositionfromStorage() {
    this.storage.get('actualLocation').then((result) => {
      if (result) {
        let myPos = new google.maps.LatLng(result.lat, result.long);
        this.map.setOptions({
          center: myPos,
          zoom: 10
        });

        this.placePickUpMarker(myPos);

        //this.marker = this.addMarker(myPos);//, "Last Location: " + result['lat'] + ', ' + result['long']);

        this.resizeMap();
      }
    });
  }     

  addMarker(position) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      //animation: google.maps.Animation.BOUNCE,
      position: position,
      icon: 'assets/icon/pointer/person.png'
      //draggable: true
    });

    setTimeout( () => {
      marker.setAnimation(null);
    }, 750);

   //this.addInfoWindow(marker, content);
    return marker;
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    infoWindow.open(this.map, marker);

    // google.maps.event.addListener(marker, 'click', () => {
    //   infoWindow.open(this.map, marker);
    // });
  } 

  navigateToMyActualLocation(){
    this.getCurrentPosition();
    this.updatePickUpSearchbarContent();
  }

  updatePickUpSearchbarContent(){
    if(this.pickupMarker){
      this.addressElement.value = String(this.pickupMarker.getPosition().lat().toFixed(4) + ', ' + this.pickupMarker.getPosition().lng().toFixed(4));
    }else{
      this.placePickUpMarker(this.pickupMarker);
      this.addressElement.value = String(this.pickupMarker.getPosition().lat() + ', ' + this.pickupMarker.getPosition().lng());
    }
  }

  getCurrentPosition() {
    
    this.loading = this.loadingCtrl.create({
      content: 'Searching Location ...'
    });
    this.loading.present();

    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      (position) => {
        this.loading.dismiss().then(() => {

          this.showToast('Location found!');

          console.log(position.coords.latitude, position.coords.longitude);
          let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let options = {
            center: myPos,
            zoom: 14
          };
          this.map.setOptions(options);
          this.placePickUpMarker(myPos);

          let actualLocation = { lat: position.coords.latitude, long: position.coords.longitude };
          this.storage.set('actualLocation', actualLocation)
            .then(() => {
              this.showToast('Location saved');
            });
          
        });
      },
      (error) => {
        this.getCurrentPositionfromStorage();
        this.loading.dismiss().then(() => {
          this.showToast('Location not found. Please enable GPS!');

          console.log(error);
        });
      }
    )
  }

  addMapEventListeners() {

    // google.maps.event.addListener(this.pickupMarker, 'click', () =>{
    //   console.log('click');
    // });

    // google.maps.event.addListener(this.pickupMarker, 'mouseover', () =>{
    //   console.log('mouseover');
    //   google.maps.event.clearInstanceListeners(this.pickupMarker);
    // });

  }
//this.marker.setMap(null);
  placePickUpMarker(position){
    if(!this.isPickupRequested){
      if(this.pickupMarker != null){
        this.updatePickUpMarker(position);
      }else{
          this.pickupMarker = this.addMarker(position);
          this.pickupMarker.setDraggable(true);

          google.maps.event.addListener(this.pickupMarker, 'mousedown', () =>{
          console.log('mousedown');
          //this.addInfoWindow(this.pickupMarker, 'mousedown');
        });

        google.maps.event.addListener(this.pickupMarker, 'mouseup', () =>{
          console.log('mouseup');
          this.updatePickUpSearchbarContent();
          //this.addInfoWindow(this.pickupMarker, 'mouseup');
          //google.maps.event.clearInstanceListeners(this.pickupMarker);
        });
      }
    }
    ;
  }

  updatePickUpMarker(position){
    if(!this.isPickupRequested){
      this.pickupMarker.setPosition(position);
      this.pickupMarker.setDraggable(true);
    }else{
      console.log('Channot change pickup location after ordering the ride.')
    }
  }

  removePickupMarker(){
     if(this.pickupMarker != null && !this.isPickupRequested){
        this.pickupMarker.setMap(null);
        this.pickupMarker = null;
    }
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
