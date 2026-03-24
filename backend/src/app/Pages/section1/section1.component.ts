import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatBotAiComponent } from "../chat-bot-ai/chat-bot-ai.component";

@Component({
  selector: 'app-section1',
  standalone: true,
  imports: [RouterLink, ChatBotAiComponent],
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.css'
})
export class Section1Component {

}
