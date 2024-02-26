import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private _serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private _apiKey: string = 'KBc1wSArxc1ABqM5HZIRzrD5PvN8A99C';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this.tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    var tempHistory = JSON.parse(localStorage.getItem('history')!);
    if (tempHistory.length === 0) {
      return;
    }

    this._tagsHistory = tempHistory;
    this.searchTag(this._tagsHistory[0]);

  }

  searchTag(tag: string):void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('limit', 10)
      .set('q', tag);

    this.http.get<SearchResponse>(`${this._serviceUrl}/search`, {params})
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
