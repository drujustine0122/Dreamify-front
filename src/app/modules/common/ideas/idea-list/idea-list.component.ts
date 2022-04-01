import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterContentInit,
  NgZone,
  AfterViewInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, timeout } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { IdeaDetailsComponent } from 'app/modules/common/ideas/idea-details/idea-details.component';
import { IdeaRemoveComponent } from 'app/modules/common/ideas/idea-remove/idea-remove.component';
import { NotesService } from 'app/modules/common/ideas/notes.service';
import { Label, Note } from 'app/modules/common/ideas/ideas.types';
import { cloneDeep } from 'lodash-es';
import { DreamCategoryService } from '../../../../core/dream_category/dream_category.service';
import { DreamProductService } from '../../../../core/dream_product/dream_product.service';
import { IdeaService } from '../../../../core/idea/idea.service';
import { ProductService } from '../../../../core/product/product.service';
import { UploadService } from '../../../../core/upload/upload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Idea, CreateIdea } from '../../../../core/idea/idea.model';
import { DreamSidebarComponent } from 'app/modules/common/ideas/dream-sidebar/dream-sidebar.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Category } from '../../../../core/category/category.model';
import { Product } from '../../../../core/product/product.model';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DreamSubfilterComponent } from '../dream-subfilter/dream-subfilter.component';
import { MatTableDataSource } from '@angular/material/table';
import { AgmMap, MapsAPILoader, AgmMarker } from '@agm/core';
import { tags } from 'app/mock-api/apps/contacts/data';
import { UserService } from '../../../../core/user/user.service';
import { UserRole, User } from '../../../../core/user/user.model';


export class CategoryNode {
  children?: CategoryNode[];
  name: string;
  id: string;
}



export class ProductNode {
  children?: ProductNode[];
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

export class ProductFlatNode {
  name: string;
  level: number;
  expandable: boolean;
  id: string;
}

@Component({
  selector: 'idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IdeaListComponent implements OnInit, OnDestroy {

  user: User;

  title: string = 'AGM project';

  latitude: number;

  longitude: number;

  zoom: number = 8;

  address: string;

  action: string;

  private geoCoder;

  isImageUploading = [];

  selectedcategoryname: string;
  selectedproductname: string;

  form: FormGroup;

  payload: CreateIdea = {
    title: "",
    description: "",
    cover: "",
    categories: null,
  }

  isSaving = false;

  selectedCategories: Category[][] = [];
  selectedProducts: Product[][] = [];

  isShowCategory: boolean = false
  isListView: boolean = false

  @ViewChild('keywordsInput')
  public searchElementRef: ElementRef;
  keywordsInput: google.maps.Map;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CategoryFlatNode, CategoryNode>();
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatProductNodeMap = new Map<ProductFlatNode, ProductNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CategoryNode, CategoryFlatNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedProductNodeMap = new Map<ProductNode, ProductFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;
  treeControl: FlatTreeControl<CategoryFlatNode>;
  treeProductControl: FlatTreeControl<ProductFlatNode>;
  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;
  treeProductFlattener: MatTreeFlattener<ProductNode, ProductFlatNode>;
  displayedColumns: string[] = ['title', 'description', 'category', 'product', 'picture', 'location', 'save_button'];
  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;
  dataProductSource: MatTreeFlatDataSource<ProductNode, ProductFlatNode>
  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(false /* multiple */);
  checkProductlistSelection = new SelectionModel<ProductFlatNode>(true /* multiple */);

  categories = [];
  products = [];
  hideMap = [];
  showfitcategory = [];
  showfitproduct = [];

  labels$: Observable<Label[]>;
  notes$: Observable<Note[]>;
  ideas$ = this.ideaService.ideas$;

  filter$: BehaviorSubject<[]> = new BehaviorSubject([]);
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 3;

  dreamsubfilter$: BehaviorSubject<[]> = new BehaviorSubject([]);

  // private DreamLists: Subject<any> = new Subject<any>();

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    // private data: { idea: Idea; categories: any },
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dreamCategoryService: DreamCategoryService,
    private dreamProductService: DreamProductService,
    private dreamSidebarComponent: DreamSidebarComponent,
    private ideaService: IdeaService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private uploadService: UploadService,
    private userService: UserService,
    // private agmMap: AgmMap
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeProductFlattener = new MatTreeFlattener(
      this.producttransformer,
      this.getProductLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.treeProductControl = new FlatTreeControl<ProductFlatNode>(this.getProductLevel, this.isProductExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataProductSource = new MatTreeFlatDataSource(this.treeProductControl, this.treeProductFlattener);
    this.dataSource.data = [] as CategoryNode[];
    this.dataProductSource.data = [] as ProductNode[];
  }

  get filterStatus(): [] {
    return this.filter$.value;
  }

  getFilterStatus(): [] {
    return this.dreamsubfilter$.value;
  }

  // loading google maps api...
  loadngAfterContentInit(focusId) {
    //load Places Autocomplete
    // this.hideMap. = true;
    console.log("The focus ID:", focusId);
    // var all_locations = document.getElementsByClassName('searchloc');
    // for (var i = 0; all_locations.length; i++) {
    //   var item = all_locations[i];

    // }
    this.hideMap[focusId] = 1;
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        types: ["establishment"],
      };
      const input = document.getElementById('keywordsinput' + focusId) as HTMLInputElement;
      let autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          console.log("lat, long, zoom:", this.latitude, this.longitude, this.zoom)
        });
      });
    });
  }

  //confirm apply button...
  applyloc(id) {
    console.log(id);
    this.hideMap[id] = 0;
    return
  }

  //remove event of other element when you click one specific input element


  ngOnInit(): void {
    this.dreamCategoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
      this.dataSource.data = res as CategoryNode[];
      console.log("Category and data:", this.categories, this.dataSource.data);
      // let nodes = this.treeControl.dataNodes;
      // if (nodes.length) {
      //   this.treeControl.expandAll();
      //   this.categorySelectionToggle(nodes[0]);
      // }
      // console.log(this.treeControl.dataNodes[0]);
      for (var i = 0; i < this.categories.length; i++) {
        this.hideMap.push(0);
      }
      console.log("length:", this.categories.length, this.categories, this.hideMap)
    });

    this.dreamProductService.getAllProducts().subscribe((res: any) => {
      this.products = res;
      this.dataProductSource.data = res as ProductNode[];
      console.log("Product and data:", this.products, this.dataProductSource.data);
      // let nodes = this.treeControl.dataNodes;
      // if (nodes.length) {
      //   this.treeControl.expandAll();
      //   this.categorySelectionToggle(nodes[0]);
      // }
      // console.log(this.treeControl.dataNodes[0]);
      for (var i = 0; i < this.products.length; i++) {
        this.hideMap.push(0);
      }
      console.log("length:", this.products.length, this.products, this.hideMap)
    });

    // const idea = this.data.idea || {} as Idea;

    // const categories = [idea.categories ? idea.categories.map(x => x.id) : []]

    // // this.selectedCategories = idea.categories || [][];
    // this.selectedCategories = [idea.categories] || [];

    this.ideaService.initIdeas();
    console.log(this.ideas$)
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

    this.userService.user$.pipe(
      map((user) => {
        this.user = user;
        console.log(this.user)
      })
    ).subscribe()
  }


  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  //set current location in the google map...
  private setCurrentLocation() {

    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition((position) => {

        this.latitude = position.coords.latitude;

        this.longitude = position.coords.longitude;

        this.zoom = 8;

        this.getAddress(this.latitude, this.longitude);

      });

    }

  }

  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {

    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

      if (status === 'OK') {

        if (results[0]) {

          this.zoom = 12;

          this.address = results[0].formatted_address;

        } else {

          window.alert('No results found');

        }

      } else {

        window.alert('Geocoder failed due to: ' + status);

      }

    });

  }

  focuslost() {
    // this.hideMap = false;
    console.log("focus lost!");
  }

  addNewIdea(): void {
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: {}, categories: this.categories },
    });
  }

  openEditLabelsDialog(): void {
  }

  async uploadImage(fileList: FileList, imageid): Promise<void> {
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
      console.log("uploadid:", imageid);
      this.isImageUploading[imageid] = 1;
      url = await this.uploadService.upload(file).toPromise();
      console.log("uploadpic url:", url)
      this.form.get('cover').setValue(url);
    } catch (e) {
      console.log(e);
    } finally {
      this.isImageUploading[imageid] = 0;
    }
  }

  //confirm the selected category in checkbox 
  confirmCategories(category: string): void {
    console.log("category Name: ", category)
    console.log("One category is selected:", this.selectedCategories);
  }

  //confirm the selected category in checkbox 
  async confirmProducts(product: string, i) {
    try {
      this.isSaving = true;
      const prodArry = [];
      this.selectedProducts[i].map((res) => {
        prodArry.push({ id: res.id })
      })
      this.payload.title = this.ideas$.value[i].title;
      this.payload.description = this.ideas$.value[i].description
      this.payload.cover = this.ideas$.value[i].cover
      this.payload.categories = prodArry
      const dreamid = this.ideas$.value[i].id;
      if (dreamid) {
        const idea = await this.ideaService.updateIdea(dreamid, this.payload).toPromise();
        this.ideaService.ideaUpdated(idea);
      } else {
        const idea = await this.ideaService.createIdea(this.payload).toPromise();
        this.ideaService.ideaCreated(idea);
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
    console.log("product Name: ", product)
    console.log("cover: ", this.ideas$.value[i].cover)
    console.log("One product is selected:", this.selectedProducts[i]);
  }

  openIdeaDialog(idea: Idea): void {
    console.log(idea);
    this.dialog.open(IdeaDetailsComponent, {
      autoFocus: false,
      data: { idea: cloneDeep(idea), categories: this.categories }
    });
  }


  deleteRowData(row_obj) {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      return value.id != row_obj.id;
    });
  }


  filterByQuery(query: string): void {
    this.searchQuery$.next(query);
    this.ideaService.loadIdeas();
  }

  resetFilter(): void {
    this.filter$.next([]);
    this.ideaService.loadIdeas();
  }
  // add for sharing data...
  message: string;
  dreamListName = "All Dreams";
  receiveMessage($event) {
    if ($event != null && $event.children) {
      this.message = $event.children;
    }
    if ($event != null && $event.dreamName) {
      this.dreamListName = $event.dreamName;
    }
    console.log("message:", this.message);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterByCategory(): void {
    const selectedCategories = this.checklistSelection.selected.filter(item => item.expandable === false);
    const selectedIds = selectedCategories.map(item => item.id);
    console.log("ddddddddddddddddddddddddddddddddddddddd:", selectedIds);

    this.filter$.next(selectedIds as []);
    this.ideaService.loadIdeas();
  }


  filterByProduct(): void {
    const selectedProducts = this.checkProductlistSelection.selected.filter(item => item.expandable === false);
    console.log("hohohoohohohohohoh: ", selectedProducts)
    const selectedIds = selectedProducts.map(item => item.id);
    console.log(selectedIds);

    this.filter$.next(selectedIds as []);
    this.ideaService.loadIdeas();
  }
  // This example adds a search box to a map, using the Google Place Autocomplete
  // feature. People can enter geographical searches. The search box will return a
  // pick list containing a mix of places and predicted search terms.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


  getSelectedCategoryIds() {
  }


  updateSelectedCategories(i) {
    const selectedCategories = this.checklistSelection.selected.filter(item => item.expandable === false);
    this.selectedCategories[i] = selectedCategories;
  }

  updateSelectedProducts(i) {
    const selectedProducts = this.checkProductlistSelection.selected.filter(item => item.expandable === false);
    this.selectedProducts[i] = selectedProducts;
  }

  getLevel = (node: CategoryFlatNode) => node.level;
  getProductLevel = (node: ProductFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;
  isProductExpandable = (node: ProductFlatNode) => node.expandable;

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

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  producttransformer = (node: ProductNode, level: number) => {
    const existingNode = this.nestedProductNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name ? existingNode : new ProductFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.expandable = !!node.children?.length;
    this.flatProductNodeMap.set(flatNode, node);
    this.nestedProductNodeMap.set(node, flatNode);
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
    this.selectedcategoryname = node.name;
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

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  productSelectionToggle(node: ProductFlatNode): void {
    this.checkProductlistSelection.toggle(node);
    this.selectedproductname = node.name;
    const descendants = this.treeProductControl.getDescendants(node);
    if (this.checkProductlistSelection.isSelected(node)) {
      this.checkProductlistSelection.select(...descendants);
    } else {
      this.checkProductlistSelection.deselect(...descendants);
    }
    // Force update for the parent
    descendants.forEach(child => this.checkProductlistSelection.isSelected(child));
    this.checkAllProductParentsSelection(node);

    this.filterByProduct();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: CategoryFlatNode, showCategoryId): void {
    this.showfitcategory[showCategoryId] = 1;
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.updateSelectedCategories(showCategoryId);
    // this.filterByCategory();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoProductLeafItemSelectionToggle(node: ProductFlatNode, showProductId): void {
    console.log("pararara:", showProductId)
    this.showfitproduct[showProductId] = 1;
    this.checkProductlistSelection.toggle(node);
    this.updateSelectedProducts(showProductId);
    // this.filterByCategory();

  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllProductParentsSelection(node: ProductFlatNode): void {
    let parent: ProductFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkProductRootNodeSelection(parent);
      parent = this.getProductParentNode(parent);
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

  /** Check root node checked state and change it accordingly */
  checkProductRootNodeSelection(node: ProductFlatNode): void {
    const nodeSelected = this.checkProductlistSelection.isSelected(node);
    const descendants = this.treeProductControl.getDescendants(node);

    const descAllSelected = descendants.length > 0 && descendants.every(child => this.checkProductlistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checkProductlistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checkProductlistSelection.select(node);
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

  /* Get the parent node of a node */
  getProductParentNode(node: ProductFlatNode): ProductFlatNode | null {
    const currentLevel = this.getProductLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeProductControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeProductControl.dataNodes[i];

      if (this.getProductLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getCurrentDreamName() {
    return this.dreamSidebarComponent.getCurrentDream();
  }

  isAdmin() {
    if (this.user.role == UserRole.admin || this.user.role == UserRole.superAdmin) return true;
    return false;
  }

  isListViewSet() {
    if (this.isListView) return true;
    return false;
  }

  isDreamViewSet() {
    if (this.isListView) return false;
    return true;
  }

  toListView() {
    this.isListView = true;
  }

  toDreamView() {
    this.isListView = false;
  }

  isAllDreams() {
    if (this.dreamListName == "All Dreams") return true;
    return false;
  }

  filterTopDreams() {
    console.log('filterTopDreams');
  }
  filterSharedDreams() {
    console.log('filterSharedDreams');
  }
  filterCalendar() {
    console.log('filterCalendar');
  }
  filterPublicDreams() {
    console.log('filterPublicDreams');
  }
  filterPrivateDreams() {
    console.log('filterPrivateDreams');
  }
  isCreatedByAdmin(idea: Idea) {
    if (idea.createdBy.role == UserRole.superAdmin || idea.createdBy.role == UserRole.admin) return true;
    return false;
  }

  async addToMyDream(payload: Idea) {
    console.log("added to my dreams")
    const data: CreateIdea = {
      title: payload.title,
      description: payload.description,
      cover: payload.cover,
      categories: payload.categories.map(x => x.id)
    }
    const idea = await this.ideaService.createIdea(data).toPromise();
    this.snackBar.open('One dream has been added to my dreams.', '', {
      duration: 3000
    });
    if (this.ideaService.getDreamType() == "My Dreams")
      this.ideaService.ideaCreated(idea);
  }

  async removeDream(idea: Idea) {
    // if (confirm('Are you sure to remove this idea?')) {
    //   const result = await this.ideaService.removeIdeaById(idea.id).toPromise();
    //   if (result) this.ideaService.ideaRemoved(idea);
    // }
    this.dialog.open(IdeaRemoveComponent, {
      autoFocus: false,
      data: { idea: idea },
    });
  }
}
