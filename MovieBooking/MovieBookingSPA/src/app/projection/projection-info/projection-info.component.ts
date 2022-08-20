import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { MoviesFacadeService } from 'src/app/movies/domain/application-services/movies-facade.service';
import { IMovieDetails } from 'src/app/movies/domain/models/movie-details';
import { TheaterHallFacadeService } from 'src/app/theater-hall/domain/application-services/theater-hall-facade.service';
import { ITheaterHall } from 'src/app/theater-hall/domain/models/theater-hall.model';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IFormProjection } from '../domain/models/form-projection.model';
import { IProjection } from '../domain/models/projection.model';

@Component({
  selector: 'app-projection-info',
  templateUrl: './projection-info.component.html',
  styleUrls: ['./projection-info.component.css']
})
export class ProjectionInfoComponent implements OnInit {

  public projection: IProjection;
  private paramMapSub: Subscription | null;
  public modalReference: NgbModalRef;
  public projectionForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public theaterHalls: ITheaterHall[] = [];
  public movies: IMovieDetails[] = [];
  public theaterHall: ITheaterHall;
  public theaterHallFromForm: ITheaterHall;
  public movie: IMovieDetails;
  public movieFields: Object = {text: 'Name', value: 'Id'};

  constructor(private projectionFacadeService: ProjectionFacadeService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private theaterHallFacadeService: TheaterHallFacadeService,
              private moviesFacadeService: MoviesFacadeService) { 
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const projectionId = params.get('projectionId');
      this.projectionFacadeService.getProjection(projectionId)
      .subscribe(projection => {
        this.projection = projection;
        console.log(projection);
        this.showFormErrors = true;
        this.showServerError = false;
        this.theaterHallFacadeService.getTheaterHalls()
          .subscribe(theaterHalls => {
            this.theaterHalls = theaterHalls;
        });
        this.moviesFacadeService.getMoviesDetails()
          .subscribe(movies => {
            this.movies = movies;
        });
        this.resetForm();
      })      
    });
  }

  public resetForm(){
    this.projectionForm = this.formBuilder.group({
      movieId: [this.projection.movieId, [Validators.required]],
      projectionDate: [this.projection.projectionDate, [Validators.required, Validators.pattern('([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])')]],
      theaterHallId: [this.projection.theaterHallId, [Validators.required]],
      theaterHallTerm: [this.projection.projectionTerm, [Validators.required]],
      price: [this.projection.price, [Validators.required, Validators.pattern('[0-9]+')]]
    });
    this.theaterHallFacadeService.getTheaterHall(this.projection.theaterHallId)
      .subscribe(thaterhall => {
        this.theaterHallFromForm = thaterhall;
      });

  }

  

  public deleteProjection(){
    this.projectionFacadeService.deleteProjection(this.projection.id)
    .subscribe({
      error: (err) => {
        console.log(err);
        return of(false);
      },
      complete: () => {
        window.alert("Projection deleted");
        this.modalReference.close();
        this.router.navigate((['/projection']));
      }
    });
  }

  public changeMovie(e: any) {
    this.movieId?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public changeTheaterHall(e: any) {
    this.theaterHallId?.setValue(e.target.value, {
      onlySelf: true,
    });
    const data: IFormProjection = this.projectionForm.value as IFormProjection;
    this.theaterHallFacadeService.getTheaterHall(data.theaterHallId)
      .subscribe(theaterHall => {
        this.theaterHallFromForm = theaterHall;
    });
  }

  public changeTheaterHallTerm(e: any) {
    this.theaterHallTerm?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public get movieId(){
    return this.projectionForm.get('movieId');
  }

  public get theaterHallId(){
    return this.projectionForm.get('theaterHallId');
  }

  public get theaterHallTerm(){
    return this.projectionForm.get('theaterHallTerm');
  }

  public get projectionDate(){
    return this.projectionForm.get('projectionDate');
  }

  public get price(){
    return this.projectionForm.get('price');
  }
 
  public onProjectionFormSubmit(){
    
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.projectionForm.invalid) {
      this.showFormErrors = true;
      console.error("Form errors")
      return;
    }

    const data: IFormProjection = this.projectionForm.value as IFormProjection;
    console.log(data);

    let thId: string = data.theaterHallId;
    if(data.theaterHallId.split(" ").length > 1){
      thId = data.theaterHallId.split(" ")[1];
    }

    let mId: string = data.movieId;
    if(data.movieId.split(" ").length > 1){
      mId = data.movieId.split(" ")[1];
    }

    let term: string = data.theaterHallTerm;
    if(data.theaterHallTerm.split(" ").length > 2){
      term = data.theaterHallTerm.split(" ")[1] + " " + data.theaterHallTerm.split(" ")[2];
    }
    this.theaterHallFacadeService.getTheaterHall(thId)
      .subscribe(thaterhall => {
        this.theaterHall = thaterhall;
        console.log(this.theaterHall.name);
        this.moviesFacadeService.getMovieDetails(mId)
          .subscribe(movieDetails => {
            this.movie = movieDetails;
            console.log(this.movie.title);
            this.projectionFacadeService.updateProjection(this.projection.id, this.movie.id, this.movie.title, this.movie.runtime, 
              this.theaterHall.id, this.theaterHall.name, data.projectionDate, term, 
              this.theaterHall.numberOfSeats, 0, data.price)
             .subscribe({
                error: (err) => {
                  this.showServerError = true;
                  console.log(err);
                  return of(false);
                },
                complete: () => {
                  window.alert("Projection updated");
                  this.projectionForm.reset();
                  this.modalReference.close();
                  window.location.reload();
                }
              });
        });
    });
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal'});
  }

  public close() {
    this.modalReference.close();
    this.resetForm();
  }


  ngOnInit(): void {
  }

}