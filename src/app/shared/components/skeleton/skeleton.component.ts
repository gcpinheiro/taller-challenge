import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  rows = 5;
  columns = 5;
}
