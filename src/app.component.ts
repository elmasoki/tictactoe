import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

type Player = 'X' | 'O';
type Cell = Player | null;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  board = signal<Cell[]>(Array(9).fill(null));
  currentPlayer = signal<Player>('X');
  winner = signal<Player | 'Tie' | null>(null);
  isGameOver = computed(() => this.winner() !== null);

  makeMove(index: number): void {
    if (this.isGameOver() || this.board()[index]) {
      return;
    }

    this.board.update(currentBoard => {
      const newBoard = [...currentBoard];
      newBoard[index] = this.currentPlayer();
      return newBoard;
    });

    this.checkWinner();

    if (!this.isGameOver()) {
        this.currentPlayer.update(player => player === 'X' ? 'O' : 'X');
    }
  }

  checkWinner(): void {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const currentBoard = this.board();

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        this.winner.set(currentBoard[a] as Player);
        return;
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      this.winner.set('Tie');
    }
  }

  resetGame(): void {
    this.board.set(Array(9).fill(null));
    this.currentPlayer.set('X');
    this.winner.set(null);
  }
}
