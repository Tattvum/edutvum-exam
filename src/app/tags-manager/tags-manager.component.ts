import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ExamResult } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { DataService, TagsDisplayContext } from '../model/data.service';
import { Question } from '../model/question';
import { Tag } from '../model/tag';

@Component({
  selector: 'app-tags-manager',
  templateUrl: './tags-manager.component.html',
  styleUrls: ['./tags-manager.component.scss']
})
export class TagsManagerComponent implements OnInit {

  @Input() id: number
  @Input() tags: Tag[]
  @Input() disabled: true
  @Input() context: TagsDisplayContext


  filteredTags$: Observable<Tag[]>;
  tagCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private generalContext: GeneralContext) {
    this.filteredTags$ = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((title: string | null) => title ? this._filter(title) : this.context.tags.slice()))
  }

  private _filter(title: string): Tag[] {
    const filterValue = title.toLowerCase();
    return this.context.tags.filter(tag => tag.title.toLowerCase().indexOf(filterValue) >= 0);
  }

  ngOnInit(): void {
    // console.log("qid", this.qid, "question-id:", this.question.id, "exam-id:", this.exam.id)
  }

  private async addTag(tid: string) {
    this.tags.push(this.context.getTag(tid));
    await this.context.editTagsAll(this.tags, this.id)
  }

  private async createAndAddTag(title: string) {
    try {
      title = Tag.clean(title)//Throws error if no colon
      let tag = await this.context.createTag(title)
      await this.addTag(tag.id)
      this.tagCtrl.setValue(null)
    } catch (error) {
      this.generalContext.alert(error)
    }
  }

  addTagSelected(event: MatAutocompleteSelectedEvent): void {
    let tid = event.option.value.trim()
    let title = event.option.viewValue
    if (!this.tags.map(t => t.id).includes(tid)) this.addTag(tid)
    else console.log("tag already added:", title)
    this.tagInput.nativeElement.value = ''
    this.tagCtrl.setValue(null)
  }

  addTagInput(event: MatChipInputEvent) {
    if (!this.context.isAdmin) return
    const input = event.input;
    const title = event.value.trim();
    if (title !== "") this.createAndAddTag(title)
    if (input) input.value = '';
    this.tagCtrl.setValue(null);
  }

  editTag(tid: string): void {
    if (!this.context.isAdmin) return
    const tag = this.tags.find(t => t.id === tid)
    let title = this.generalContext.prompt('Edit Tag:', tag.title)
    if (!title || title.length <= 0) return
    tag.title = title
    this.context.updateTag(tag)
  }

  removeTag(tid: string): void {
    const index = this.tags.map(t => t.id).indexOf(tid);
    if (index >= 0) this.tags.splice(index, 1);
    this.context.editTagsAll(this.tags, this.id)
  }

  onFocus() {
    this.context.disableHotkeys = true
  }
  onFocusOut() {
    this.context.disableHotkeys = false
  }

}
