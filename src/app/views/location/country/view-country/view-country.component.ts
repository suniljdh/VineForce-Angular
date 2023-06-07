import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateCountryComponent } from '../add-update-country/add-update-country.component';
import { LocationService } from '../../location.service';
import { ICountry } from '../../i-location';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.scss']
})
export class ViewCountryComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['rno', 'countryname', 'editupdate'];
  dataSource!: MatTableDataSource<ICountry>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private countryService: LocationService) {
    // Assign the data to the data source for the table to render
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
  }

  private loadData() {
    this.ngSubscription.add(
      this.countryService.fetchCountryList().subscribe((resp: ICountry[]) => {
        this.dataSource = new MatTableDataSource(resp);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addmodifyCountry(mode: string, data?: ICountry){
    this.dialog.open(AddUpdateCountryComponent, {
      data: {
        mode: mode,
        entity: data
      },
    }).afterClosed().subscribe((()=>{
      this.loadData();
    }));
  }

  deleteCountry(data: ICountry){
    data.aed = 'D';
    this.ngSubscription.add(
      this.countryService.modifyCountry(data).subscribe((d: any) => {
        if(d[0].code === 'D103'){
          this._snackBar.open(d[0].msg, '',{
            duration: 3000
          });
          this.loadData();
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    this.ngSubscription.unsubscribe();
    }
}
