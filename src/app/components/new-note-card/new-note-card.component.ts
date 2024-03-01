import { Component } from '@angular/core';

@Component({
  selector: 'app-new-note-card',
  templateUrl: './new-note-card.component.html',
  styleUrls: ['./new-note-card.component.css']
})
export class NewNoteCardComponent {
  isRecording: boolean = false;
  content: string = '';
  timerValue: number = 120; // 2 minutos em segundos
  timer: any; // Referência ao temporizador
  recognition: any; // Referência ao reconhecimento de fala
  savedContents: string[] = []; // Array para armazenar o conteúdo salvo
  selectedLanguage: string = 'fr-FR'; // Idioma padrão para gravação

  toggleRecording() {
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.isRecording = true;

    // Iniciar temporizador apenas se não estiver gravando
    if (!this.timer) {
      this.startTimer();
    }

    // Iniciar o reconhecimento de fala com o idioma selecionado
    this.recognition = new (<any>window).webkitSpeechRecognition();
    this.recognition.lang = this.selectedLanguage;

    this.recognition.onresult = (event: any) => {
      // Adicionar o resultado ao conteúdo enquanto a gravação está ocorrendo
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.content += event.results[i][0].transcript + ' ';
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') { // Ignorar erros devido a silêncio
        console.error('Erro ao gravar:', event.error);
        alert('Erro ao gravar. Por favor, tente novamente.');
        this.stopRecording();
      }
    };

    this.recognition.onend = () => {
      // Reiniciar a gravação quando termina, apenas se o botão "Parar Gravação" não tiver sido clicado
      if (this.isRecording) {
        this.startRecording();
      }
    };

    this.recognition.start();
  }

  stopRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      // Parar o reconhecimento de fala
      this.recognition.stop();
      // Parar o temporizador
      clearInterval(this.timer);
      // Reiniciar o temporizador para 2 minutos
      this.timerValue = 120;
      // Definir o temporizador como null para indicar que não está em execução
      this.timer = null;
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
        // Mudar a cor do temporizador para vermelho quando passar de 60 segundos
        if (this.timerValue <= 60) {
          const timerElement = document.getElementById('timer');
          if (timerElement) {
            timerElement.style.color = 'red';
          }
        }
      } else {
        clearInterval(this.timer); // Parar o temporizador quando o tempo acabar
        alert('O tempo acabou.');
        this.reset(); // Reiniciar a aplicação
      }
    }, 1000); // Atualizar a cada segundo
  }

  saveContent() {
    if (this.content.trim() !== '') {
      this.savedContents.push(this.content.trim());
      this.content = '';
    }
  }

  deleteContent(content: string) {
    const index = this.savedContents.indexOf(content);
    if (index !== -1) {
      this.savedContents.splice(index, 1);
    }
  }

  clearContent() {
    this.content = '';
  }

  reset() {
    this.stopRecording();
    this.content = '';
    this.timerValue = 120;
    this.timer = null;
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    const minutesStr: string = minutes < 10 ? '0' + minutes : String(minutes);
    const secondsStr: string = remainingSeconds < 10 ? '0' + remainingSeconds : String(remainingSeconds);
    return `${minutesStr}:${secondsStr}`;
  }
}

