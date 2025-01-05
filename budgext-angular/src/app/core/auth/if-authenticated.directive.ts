import { DestroyRef, Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from './services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[ifAuthenticated]'
})
export class IfAuthenticatedDirective<T> implements OnInit {
  public destroyRef = inject(DestroyRef);
  public hasView = false;

  private condition: boolean | undefined;

  @Input() set ifAuthenticated(condition: boolean) {
    this.condition = condition;
  }

  constructor(private templateRef: TemplateRef<T>,
              private viewContainerRef: ViewContainerRef,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userAuthenticated
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated: boolean) => {
        if (this.condition === undefined) {
          throw new Error('The ifAuthenticated directive must have a boolean value!');
        }
        const authRequired = isAuthenticated && this.condition;
        const unauthRequired = !isAuthenticated && !this.condition;

        if ((authRequired || unauthRequired) && !this.hasView) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (this.hasView) {
          this.viewContainerRef.clear();
          this.hasView = false;
        }
      });
  }
}
