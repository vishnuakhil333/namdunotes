import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';
import { Location } from '@angular/common';
import { Notu } from 'src/app/shared/services/notu';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.css']
})
export class EditNotesComponent implements OnInit {
  editForm: FormGroup;  // Define FormGroup to Note's edit form
  id;
  note: Notu;

  constructor(
    private crudApi: CrudService,       // Inject CRUD API in constructor
    private fb: FormBuilder,            // Inject Form Builder service for Reactive forms
    public location: Location,         // Location service to go back to previous component
    private actRoute: ActivatedRoute,   // Activated route to get the current component's inforamation
    private router: Router,             // Router service to navigate to specific component
    private toastr: ToastrService,       // Toastr service for alert message 
    // private editForm: FormGroup
    
    ){ }

  ngOnInit() {
    this.updateNoteData();   // Call updateNoteData() as soon as the component is ready 
    this.id = this.actRoute.snapshot.paramMap.get('id');  // Getting current component's id or information using ActivatedRoute service
    console.log(this.id);
    
    // 3
    // console.log(
    //   this.crudApi.GetNote(this.id).subscribe(data => {
    //       // id: data.doc.id,
    //       this.note.title =  data.payload.doc.data().title,
    //       this.note.description= data.payload.doc.data().description
    //     //  console.log("data",data);
    //     // this.editForm.setValue(data);
        
    //   })
    // )
    // 2
    // this.crudApi.GetNote(id).get().subscribe(data => {
    //   this.note = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       title: e.payload.doc.data()['title'],
    //       description: e.payload.doc.data()['description'],
    //     };

    //   })
    //   console.log(this.note);
    // })
    
    // 1
    // this.crudApi.GetNote(id).ref.get().then(function(doc) {
    //   // this.note.id = doc.id;
    //   this.note = doc.data();
    //   this.note.id = doc.id;
    //   console.log(this.note.id);
    //   console.log(this.note);
    //   // this.editForm.setValue(note);
    // })
    this.crudApi.GetNote(this.id).valueChanges().subscribe((data: Notu) => {
      let formData =  {
        'title': data.title,
        'description': data.description
      };
      console.log(formData);
      this.editForm.setValue(formData)  // Using SetValue() method, It's a ReactiveForm's API to store intial value of reactive form 
    })
  }

  // Accessing form control using getters
  get title() {
    return this.editForm.get('title');
  }

  get description() {
    return this.editForm.get('description');
  }

  // Contains Reactive Form logic
  updateNoteData() {
    this.editForm = this.fb.group({
      title: ['',[Validators.required, Validators.minLength(2)]],
      description: ['',[Validators.required]]
    })
    
  }

  // Go back to previous component
  goBack() {
    this.location.back();
  }

  // Below methods fire when somebody click on submit button
  updateForm(){
    this.crudApi.UpdateNote(this.id,this.editForm.value);       // Update Note data using CRUD API
    console.log(this.editForm.value);
    console.log(this.id);
    this.toastr.success(this.editForm.controls['title'].value + ' updated successfully');   // Show succes message when data is successfully submited
    this.router.navigate(['view-notu']);               // Navigate to Note's list page when Note data is updated
  }


}