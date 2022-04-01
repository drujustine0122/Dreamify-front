import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdeaService } from '../../../../core/idea/idea.service';
import { Idea } from '../../../../core/idea/idea.model';

@Component({
  selector: 'idea-reomve',
  templateUrl: './idea-remove.component.html',
  styleUrls: ['./idea-remove.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IdeaRemoveComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { idea: Idea;},
    private dialogRef: MatDialogRef<IdeaRemoveComponent>,
    private ideaService: IdeaService
  ) {

  }

  ngOnInit(): void {

  }

  async remove() {
    const result = await this.ideaService.removeIdeaById(this.data.idea.id).toPromise();
    if (result) this.ideaService.ideaRemoved(this.data.idea);
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
