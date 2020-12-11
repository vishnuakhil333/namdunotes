import { Injectable, NgZone } from '@angular/core';
import { Notu } from './notu';  // Note data type interface class
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  notusRef: AngularFireList<any>;    // Reference to Note data list, its an Observable
  notuRef: AngularFireObject<any>;   // Reference to Note object, its an Observable too
  notuData: any;

  
  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone) {

   }

  // Create Note
  AddNote(notu: Notu) {
    notu.dateTime = this.getTimestamp();
    return this.db.collection('notus-list').add(notu);

  }

  // Fetch Single Note Object
  // GetNote(id: string): Observable<Notu> {
  //   return new Observable((observer) => {
  //     this.db.collection('notus-list').doc(id).subscribe(function(doc) => {
  //       let data = doc.data();
  //       observer.next({
  //         id: doc.id,
  //         title: data.title,
  //         description: data.description,
  //         dateTime: data.dateTime
  //       });
  //     });
  //   });
  // }

    GetNote(id: string) {
    return this.db.collection('notus-list').doc(id);
  }

  // Fetch Notes List
  GetNotesList() {
    // this.notusRef = this.db.list('notus-list');
    // return this.notusRef;
    return this.db.collection('notus-list').snapshotChanges();
  }

  // Update Note Object
  UpdateNote(id: string,notu: any) {
    notu.dateTime = this.getTimestamp();
    return this.db.collection('notus-list').doc(id).update(notu)
  }  

  // Delete Note Object
  DeleteNote(id) { 
    console.log(id);
    return this.db.doc('notus-list/' + id).delete();
  }
  getTimestamp() {
    var d = new Date();
    return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " -" + d.getHours() + ":" + d.getMinutes()
  }

  
}