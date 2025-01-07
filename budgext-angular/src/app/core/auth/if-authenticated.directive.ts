import {
  DestroyRef,
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from './services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[ifAuthenticated]'
})
export class IfAuthenticatedDirective<T> implements OnInit {
  /** Auto lifecycle management */
  public destroyRef = inject(DestroyRef);
  /** Tracks if the view is currently displayed */
  public hasView = false;
  /** Holds the input value of directive */
  private condition: boolean | undefined;

  /** Input setter to receive the condition. Throws an error if undefined */
  @Input() set ifAuthenticated(condition: boolean) {
    if (condition === undefined) {
      throw new Error('The ifAuthenticated directive requires a condition to be set!');
    }
    this.condition = condition;
  }

  constructor(private templateRef: TemplateRef<T>,
              private viewContainerRef: ViewContainerRef,
              private userService: UserService) {}

  // TODO Remove condition from directive, so it automatically knows that ifAuthenticated shows or shows not
  ngOnInit(): void {
    this.userService.userAuthenticated
      .pipe(
        distinctUntilChanged(), // only react to changes
        takeUntilDestroyed(this.destroyRef) // Clean up on destroy
        )
      .subscribe((isAuthenticated: boolean) => {
        if (this.condition === undefined) {
          throw new Error('The ifAuthenticated directive must have a boolean value!');
        }
        // Determine if the view should be displayed
        const shouldShow = this.condition === isAuthenticated;
        this.updateView(shouldShow);
      });
  }

  /**
   * Updates the view container based on authentication state.
   * @param show - Boolean indicating whether the view should be displayed or not
   * @private
   */
  private updateView(show: boolean): void {
    if (show && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef); // Add view if not already added
      this.hasView = true;
    } else if (this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  }
}
