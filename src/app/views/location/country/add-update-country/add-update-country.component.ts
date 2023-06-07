import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationService } from '../../location.service';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICountry } from '../../i-location';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-update-country',
  templateUrl: './add-update-country.component.html',
  styleUrls: ['./add-update-country.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, ReactiveFormsModule, MatInputModule,
  MatFormFieldModule, MatIconModule, MatSelectModule, MatOptionModule, MatSnackBarModule
  ],
})
export class AddUpdateCountryComponent implements OnInit, OnDestroy {
  ngSubscription: Subscription = new Subscription();
  frm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private countryService: LocationService) {
    this.frm = this.fb.group({
      countryname: this.fb.control(this.data.entity?.countryname || null, Validators.compose([Validators.required, Validators.minLength(3)]))
    });
  }
  
  
  public get countryname() : AbstractControl {
    return this.frm.get('countryname')!;
  }
  

  ngOnInit(): void {

  }

  close() {
    this.dialog.closeAll();
  }
  
  saveDetails() {
    const d: ICountry = this.frm.getRawValue();
    d.aed = this.data.mode;
  this.ngSubscription.add(
    this.countryService.modifyCountry(d).subscribe((d:any) => {
      if(d[0].code === 'D101' || d[0].code === 'D102' || d[0].code === 'D104'){
        this._snackBar.open(d[0].msg, '',{
          duration: 3000
        });
        if(d[0].code !== 'D104'){
          this.close();
        }
      }
    })
  );  
  }
  
  ngOnDestroy(): void {
  this.ngSubscription.unsubscribe();
  }
}

export interface DialogData {
  mode: string,
  entity?: ICountry
}