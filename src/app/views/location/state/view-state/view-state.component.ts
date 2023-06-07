import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IState } from '../../i-location';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from '../../location.service';
import { AddUpdateStateComponent } from '../add-update-state/add-update-state.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-state',
  templateUrl: './view-state.component.html',
  styleUrls: ['./view-state.component.scss']
})
export class ViewStateComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['rno', 'statename', 'countryname', 'editupdate'];
  dataSource!: MatTableDataSource<IState>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private countryService: LocationService,
    private stateService: LocationService) {
    // Assign the data to the data source for the table to render
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
  }

  private loadData() {
    this.ngSubscription.add(
      this.countryService.fetchStateList().subscribe((resp: IState[]) => {
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

  addmodifyState(mode: string, data?: IState){
    this.dialog.open(AddUpdateStateComponent, {
      data: {
        mode: mode,
        entity: data
      },
    }).afterClosed().subscribe((()=>{
      this.loadData();
    }));
  }

  deleteState(data: IState){
    data.aed = 'D';
    this.ngSubscription.add(
      this.countryService.modifyState(data).subscribe((d: any) => {
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
