import { Output, Input, Component, OnInit, SimpleChange, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params} from "@angular/router";
import { Session, Explorer } from "../explorer/types"
import { ExplorerService } from "../explorer/explorer.service";
import { TNode } from "./types";

@Component({
  selector: 'tnode',
  templateUrl: './tnode.component.html'
})
export class TNodeComponent implements OnInit {
  @Input() node: TNode;
  @Input() current: any;
  @Output() selected = new EventEmitter();

  constructor () {
  }
  ngOnInit():void  {
  }

  ngOnChanges(changes: SimpleChange) :void {
    if (this.node.expanded === undefined) {
      this.node.expanded = true;
    }
    if (this.node.checked === undefined) {
      this.node.checked = true;
    }
  }
  toggleExpand(n: any):void {
    n.expanded = !n.expanded;
    this.toggleExpandRecursive(n, n.expanded);
  }
  functionde(n) {
    if (this.current != n )  {
      this.selected.emit(n);
      this.current = n;
    }
  }

  hasChildren(n: any):boolean {
    if (this.node.children != null) {
      if (this.node.children.length > 0) {
        return true;
      }
    }
    return false;
  }

  toggleExpandRecursive(n:any, state:boolean):void {
    if (n.children != null) {
      n.children.forEach( c => {
        c.expanded = state;
        this.toggleExpandRecursive(c, state);
      });
    }
  }
  select(n: any):void {
    this.selected.emit(n);
  }
  getChecked(n: any):boolean {
    return n.checked;
  }
  printCurrent() {
    console.log(this.current);
  }
}

