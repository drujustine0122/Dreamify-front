import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadService } from '../../../../core/upload/upload.service';
import { IdeaService } from '../../../../core/idea/idea.service';
import { CategoryService } from '../../../../core/category/category.service';
import { Category } from '../../../../core/category/category.model';
import { Idea } from '../../../../core/idea/idea.model';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export class CategoryNode {
  children?: CategoryNode[];
  name: string;
  id: string;
}

/** Flat to-do item node with expandable and level information */
export class CategoryFlatNode {
  name: string;
  level: number;
  expandable: boolean;
  id: string;
}

@Component({
  selector: 'idea-details',
  templateUrl: './idea-details.component.html',
  styleUrls: ['./idea-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IdeaDetailsComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CategoryFlatNode, CategoryNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CategoryNode, CategoryFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;
  treeControl: FlatTreeControl<CategoryFlatNode>;
  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;
  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(true /* multiple */);


  selectedCategories: Category[] = [];

  isImageUploading = false;
  isSaving = false;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { idea: Idea; categories: any },
    private dialogRef: MatDialogRef<IdeaDetailsComponent>,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private ideaService: IdeaService,
    private categoryService: CategoryService
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.data = this.data.categories as CategoryNode[];
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  async save() {
    try {
      this.isSaving = true;
      const payload = this.form.value;
      console.log("selectedCAT: ", this.selectedCategories, " ", payload, "dataidea: ", this.data.idea.id)
      payload.categories = this.selectedCategories.map(x => x.id);
      if (this.data.idea.id) {
        const idea = await this.ideaService.updateIdea(this.data.idea.id, payload).toPromise();
        this.ideaService.ideaUpdated(idea);
      } else {
        const idea = await this.ideaService.createIdea(payload).toPromise();
        this.ideaService.ideaCreated(idea);
      }
      this.dialogRef.close();
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

  async uploadImage(fileList: FileList): Promise<void> {
    if (!fileList.length) {
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = fileList[0];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    let url = null;
    try {
      this.isImageUploading = true;
      url = await this.uploadService.upload(file).toPromise();
      this.form.get('cover').setValue(url);
    } catch (e) {
      console.log(e);
    } finally {
      this.isImageUploading = false;
    }
  }

  isCategorySelected(category: Category): boolean {
    return !!this.selectedCategories.find(item => item.id === category.id);
  }

  toggleCategoryOnIdea(category: Category): void {
    if (this.isCategorySelected(category)) {
      const index = this.selectedCategories.findIndex(x => x.id === category.id);
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  initForm() {
    const idea = this.data.idea || {} as Idea;
    this.form = this.fb.group({
      title: [idea.title || '', Validators.required],
      description: [idea.description || '', Validators.required],
      cover: [idea.cover || '', Validators.required],
      categories: [idea.categories ? idea.categories.map(x => x.id) : []]
    });
    this.selectedCategories = idea.categories || [];
  }

  updateSelectedCategories() {
    const selectedCategories = this.checklistSelection.selected.filter(item => item.expandable === false);
    this.selectedCategories = selectedCategories;
  }




  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;

  getChildren = (node: CategoryNode): CategoryNode[] => node.children;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.name === '';


  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name ? existingNode : new CategoryFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);

  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  categorySelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(...descendants);
    } else {
      this.checklistSelection.deselect(...descendants);
    }
    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

    this.updateSelectedCategories();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    this.updateSelectedCategories();
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CategoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);

    const descAllSelected = descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}
