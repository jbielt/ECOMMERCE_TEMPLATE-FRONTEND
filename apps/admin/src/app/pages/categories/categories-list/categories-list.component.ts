import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService, Category} from "@eastblue/products";
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit, OnDestroy{

  categories: Category[] = [];
  endSubscription$: Subject<any> = new Subject();


  constructor(private categoriesService: CategoriesService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy() {
    this.endSubscription$.next();
    this.endSubscription$.complete();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubscription$))
      .subscribe(cats => {
        this.categories = cats;
      });
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService
          .deleteCategory(categoryId)
          .pipe(takeUntil(this.endSubscription$))
          .subscribe(
      () => {
            this._getCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category is deleted!'
            });
          },
      () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category cannot be deleted!'
            });
          }
        );
      }
    })
  }



}
