import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Output, EventEmitter, Input
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { IdeaDetailsComponent } from 'app/modules/common/ideas/idea-details/idea-details.component';
import { NotesService } from 'app/modules/common/ideas/notes.service';
import { Label, Note } from 'app/modules/common/ideas/ideas.types';
import { cloneDeep } from 'lodash-es';
import { DreamCategoryService } from '../../../../core/dream_category/dream_category.service';
import { IdeaService } from '../../../../core/idea/idea.service';
import { DreamLists, Idea } from '../../../../core/idea/idea.model';
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
  selector: 'app-dream-sidebar',
  templateUrl: './dream-sidebar.component.html',
  styleUrls: ['./dream-sidebar.component.css'],
})
@Injectable({
  providedIn: 'root'
})
export class DreamSidebarComponent implements OnInit, OnDestroy {

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

  categories = [];
  labels$: Observable<Label[]>;
  notes$: Observable<Note[]>;
  ideas$ = this.ideaService.ideas$;

  filter$: BehaviorSubject<[]> = new BehaviorSubject([]);
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 3;
  dream = 3;
  dreams: string[] = [];
  drList: Array<DreamLists> = [];
  message: string = 'valid';
  dreamtitle = "Dreams";
  clickedDreamName: string = '';
  rootDreams = [{
    dreamId: 0,
    dreamName: "All Dreams",
    children: []
  }, {
    dreamId: 0,
    dreamName: "Type"
  }, {
    dreamId: 0,
    dreamName: "Calendar"
  }, {
    dreamId: 0,
    dreamName: "Map"
  }, {
    dreamId: 0,
    dreamName: "Local",
    children: [{
      dreamId: 1,
      dreamName: "All Local Dreams"
    }, {
      dreamId: 1,
      dreamName: "Experiences",
      children: []
    }, {
      dreamId: 1,
      dreamName: "Activities",
      children: []
    }, {
      dreamId: 1,
      dreamName: "Goods",
      children: []
    }, {
      dreamId: 1,
      dreamName: "Deals",
      children: [{
        dreamId: 2,
        dreamName: "Below"
      }, {
        dreamId: 2,
        dreamName: "Left"
      }, {
        dreamId: 2,
        dreamName: "This month"
      }, {
        dreamId: 2,
        dreamName: "Offline"
      }
      ]
    }, {
      dreamId: 1,
      dreamName: "Coupons",
      children: [{
        dreamId: 2,
        dreamName: "Top"
      }, {
        dreamId: 2,
        dreamName: "Local"
      }, {
        dreamId: 2,
        dreamName: "This Week"
      }, {
        dreamId: 2,
        dreamName: "Online"
      }, {
        dreamId: 2,
        dreamName: "Friends"
      }, {
        dreamId: 2,
        dreamName: "Following"
      }
      ]
    }]
  }, {
    dreamId: 0,
    dreamName: "My Dreams"
  }
  ];
  isroot = false;
  menuItems = [];
  // typeItems = ['General','Contests','Challenges','Offers','Experiences','Products','Services','Gifts','Deals'];
  typeItems = ['Learning', 'Experiencing', 'Owning']//change by Ivan

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private dreamCategoryService: DreamCategoryService,
    private ideaService: IdeaService,
    // private rootDreams: DreamLists,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.data = [] as CategoryNode[];
    this.isroot = true;
    this.menuItems = this.rootDreams;
  }

  get filterStatus(): [] {
    return this.filter$.value;
  }

  ngOnInit(): void {
    this.dreamCategoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
      this.dataSource.data = res as CategoryNode[];
      console.log("Category and data:", this.categories, this.dataSource.data);
    });
    this.ideaService.initIdeas();
    this.filter$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.ideaService.setCategoryFilter(res);
    });

    this.searchQuery$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe((res) => {
      this.ideaService.setQueryFilter(res);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addNewIdea(): void {
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: {}, categories: this.categories },
    });
  }

  openEditLabelsDialog(): void {
  }

  openIdeaDialog(idea: Idea): void {
    console.log(idea);
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: cloneDeep(idea), categories: this.categories }
    });
  }


  showlist(dream): void {
    console.log("dreamlist:", dream);
    this.clickedDreamName = dream.dreamName;
    this.sendMessage(dream);
    this.menuItems = dream.children;
    this.isroot = false;
    this.dreamtitle = dream.dreamName;
    this.ideaService.setDreamType(dream.dreamName);
    this.ideaService.loadIdeas();
  }
  showListByType(type): void {
    console.log(type);
  }

  getCurrentDream() {
    return this.clickedDreamName;
  }

  backMenu() {
    this.isroot = true;
    this.menuItems = this.rootDreams;
    this.dreamtitle = "Dreams";
    this.messageEvent.emit();
    this.ideaService.setDreamType("");
    this.ideaService.loadIdeas();
  }

  filterByQuery(query: string): void {
    this.searchQuery$.next(query);
    this.ideaService.loadIdeas();
  }

  resetFilter(): void {
    this.filter$.next([]);
    this.ideaService.loadIdeas();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterByCategory(): void {
    const selectedCategories = this.checklistSelection.selected.filter(item => item.expandable === false);
    const selectedIds = selectedCategories.map(item => item.id);
    console.log(selectedIds);

    this.filter$.next(selectedIds as []);
    this.ideaService.loadIdeas();
  }

  getSelectedCategoryIds() {
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

    this.filterByCategory();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    this.filterByCategory();

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

  //add for sharing data...
  @Output() messageEvent = new EventEmitter<string>();
  sendMessage(dream) {
    // let filters = dream.children;
    this.messageEvent.emit(dream)
  }
}
