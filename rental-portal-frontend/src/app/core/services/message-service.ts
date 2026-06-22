import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../global/api-service';
import { ChatMessage } from '../models/message-model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiPath = '/messages';
  private api = inject(ApiService);

  getChatHistory(user1: string, user2: string): Observable<ChatMessage[]> {
    return this.api.get<ChatMessage[]>(`${this.apiPath}?user1=${user1}&user2=${user2}`);
  }

  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    return this.api.post<ChatMessage>(this.apiPath, message);
  }

  getReceivedMessages(receiverId: string): Observable<ChatMessage[]> {
    return this.api.get<ChatMessage[]>(`${this.apiPath}/received/${receiverId}`);
  }
}
