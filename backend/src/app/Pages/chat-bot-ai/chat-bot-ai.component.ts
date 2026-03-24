// chatbot.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot-ai',
  standalone: true,
  templateUrl: './chat-bot-ai.component.html',
  styleUrl: './chat-bot-ai.component.css',
  imports: [CommonModule, FormsModule],
})
export class ChatBotAiComponent  implements OnInit, AfterViewChecked {
  @ViewChild('chatContent') private chatContent!: ElementRef;
  
  messages: Message[] = [];
  userInput = '';
  isLoading = false;
  isOpen = false;
  private apiUrl = environment.chatBotApiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.addMessage({
      content: 'Hello! I\'m your crypto assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  private addMessage(message: Message) {
    this.messages.push(message);
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.userInput.trim();
    this.addMessage({
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    });

    this.userInput = '';
    this.isLoading = true;

    try {
      const response = await this.getBotResponse(userMessage);
      this.addMessage({
        content: response,
        role: 'assistant',
        timestamp: new Date()
      });
    } catch (error) {
      this.addMessage({
        content: 'There was an error. Please try again later.',
        role: 'assistant',
        timestamp: new Date()
      });
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async getBotResponse(userMessage: string): Promise<string> {
    try {
      const response = await this.http.post<any>(this.apiUrl, {
        prompt: userMessage
      }).toPromise();

      if (response.status === 'success') {
        return response.text;
      }
      throw new Error('API response was not successful');
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch (err) {}
  }
}