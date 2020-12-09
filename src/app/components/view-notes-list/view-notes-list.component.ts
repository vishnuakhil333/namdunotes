import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';
import { Notu } from 'src/app/shared/services/notu';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-view-notes-list',
  templateUrl: './view-notes-list.component.html',
  styleUrls: ['./view-notes-list.component.css']
})
export class ViewNotesListComponent implements OnInit {
  p: number = 1;                      // Fix for AOT compilation error for NGX pagination
  Notu: Notu[];                 // Save notes data in Note's array.
  hideWhenNoNote: boolean = false; // Hide notes data table when no Note.
  noData: boolean = false;            // Showing No Note Message, when no Note in database.
  preLoader: boolean = true;       // Showing Preloader to show user data is coming for you from thre server(A tiny UX Shit)
  notu: any;

  // -----------//
  nutusCollection: AngularFirestoreCollection<any>;
  coll: any;

  constructor(
    public crudApi: CrudService, // Inject Note CRUD services in constructor.
    public toastr: ToastrService, // Toastr service for alert message
    private afs: AngularFirestore
    ){ }


  ngOnInit() {
    this.dataState(); // Initialize Note's list, when component is ready
    this.nutusCollection = this.afs.collection<any>('notus-list');
    this.coll = this.nutusCollection.snapshotChanges().pipe(
      map(actions => {
       return actions.map(doc => {
        console.log('==', doc.payload.doc.id);
        console.log('$==$', doc.payload.doc.data());
        return{
          id: doc.payload.doc.id,
          ... doc.payload.doc.data()
        }
      })
    })
  )
  }

  // Using valueChanges() method to fetch simple list of notes data. It updates the state of hideWhenNoNote, noData & preLoader variables when any changes occurs in Note data list in real-time.
  dataState() {     
    this.crudApi.GetNotesList().subscribe(data => {
      this.preLoader = false;
      if(data.length <= 0){
        this.hideWhenNoNote = false;
        this.noData = true;
      } else {
        this.hideWhenNoNote = true;
        this.noData = false;
      }
    })
  }

  // Method to delete Note object
  deleteNote(id) {
    if (window.confirm('Are sure you want to delete this Note ?')) { // Asking from user before Deleting Note data.
      this.crudApi.DeleteNote(id) // Using Delete Note API to delete Note.
      this.toastr.success('Note with ' + id + ' successfully deleted!'); // Alert message will show up when Note successfully deleted.
    }
  }



}
