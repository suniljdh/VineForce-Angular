import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ICountry, IState } from '../../i-location';
import { LocationService } from '../../location.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-state',
  templateUrl: './add-update-state.component.html',
  styleUrls: ['./add-update-state.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, ReactiveFormsModule, MatInputModule,
    MatFormFieldModule, MatIconModule, MatSelectModule, MatOptionModule, MatDividerModule, MatSnackBarModule,
  ],
})
export class AddUpdateStateComponent implements OnInit, OnDestroy {
  ngSubscription: Subscription = new Subscription();
  frm: FormGroup;

  countrylist$: ICountry[]=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private countryService: LocationService) {
    this.frm = this.fb.group({
      statename: this.fb.control(this.data.entity?.statename || null, Validators.compose([Validators.required, Validators.minLength(3)])),
      countryid: this.fb.control(this.data.entity?.countryid || null, Validators.required)
    });

    this.ngSubscription.add(
      this.countryService.fetchCountryList().subscribe((d:ICountry[])=>{
        this.countrylist$ = d;
      })
    );
  }


  public get statename(): AbstractControl {
    return this.frm.get('statename')!;
  }

  public get countryid(): AbstractControl {
    return this.frm.get('countryid')!;
  }

  ngOnInit(): void {

  }

  close() {
    this.dialog.closeAll();
  }

  saveDetails() {
    const d: IState = this.frm.getRawValue();
    d.aed = this.data.mode;
    d.stateid = this.data.entity?.stateid;
    d.countryname = this.countrylist$.find(f=> f.countryid == this.countryid.value)?.countryname;
  this.ngSubscription.add(
    this.countryService.modifyState(d).subscribe((d:any) => {
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
  entity?: IState
}