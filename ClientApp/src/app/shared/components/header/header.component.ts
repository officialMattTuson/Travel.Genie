import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input({ required: true }) pageTitle!: string;
  @Input() pageSubtitle!: string;
  @Input() pageActions!: Array<{ label: string; icon: string }>;
  @Output() actionClicked = new EventEmitter<string>();

  onActionClick(actionLabel: string): void {
    this.actionClicked.emit(actionLabel);
  }
}
