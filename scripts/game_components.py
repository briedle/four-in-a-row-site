import numpy as np 
import pandas as pd 

class GameHistory:

    def __init__(self):
        self.player_number_history = []
        self.row_history = []
        self.col_history = []


    def record_move(self, player_number, row, col):
        self.player_number_history.append(player_number)
        self.row_history.append(row)
        self.col_history.append(col)

    def finalize_history(self):
        self.history = pd.DataFrame({
            'player': self.player_number_history,
            'row': self.row_history,
            'col': self.col_history
        })


class ConnectFourGame():
    
    def __init__(self, board, player1, player2):
        self.board = board
        self.history = GameHistory()
        self.player1 = player1
        self.player2 = player2
        self.current_player = self.player1
        self.current_player_number = 1

    def __call__(self):
        if self.board.game_state == 'undecided':
            move = self.current_player.get_move()
            try:
                row, col = self.board.drop_piece(move, self.current_player_number)
            except ValueError:
                print('Illegal Move: try again')
                self.play()
            self.history.record_move(self.current_player_number, row, col)
            if self.current_player == self.player1:
                self.current_player = self.player2
                self.current_player_number = 2
            else:
                self.current_player = self.player1
                self.current_player_number = 1
            self.__call__()   
        else:
            self.history.finalize_history()


class ConnectFourBoard():

    def __init__(self, n_rows=6, n_cols=7):
        self.n_rows = n_rows
        self.n_cols = n_cols
        self.board = np.zeros((n_rows, n_cols))
        self.legal_moves = self.get_legal_moves()
        self.game_state = 'undecided'
        self.winning_indices = None
        self.winner = None


    def drop_piece(self, col, player_number):
        if col not in self.legal_moves:
            raise ValueError("Illegal move: column is full or does not exist")
        if self.game_state != 'undecided':
            raise ValueError("Illegal move: game is over")
        if player_number not in [1, 2]:
            raise ValueError("Illegal move: player must be 1 or 2")
        row = self._get_first_open_row(col)
        self.board[row][col] = player_number
        self.legal_moves = self.get_legal_moves()
        if winning_indices := self.check_win(row, col, player_number):
            self.game_state = 'win'
            self.winning_indices = winning_indices
            self.winner = player_number
        elif len(self.legal_moves) == 0:
            self.game_state = 'tie'
        return row, col
        
    def get_legal_moves(self):
        legal_moves = []
        for col in range(self.board.shape[1]):
            if self.board[0][col] == 0:
                legal_moves.append(col)
        return legal_moves
    
    def check_win(self, row, col, player):
        horizontal_indices = self._get_horizontal_indices(row, col)
        vertical_indices = self._get_vertical_indices(row, col)
        negative_slope_indices = self._get_negative_slope_indices(row, col)
        positive_slope_indices = self._get_positive_slope_indices(row, col)
        input_indices = [horizontal_indices, vertical_indices, negative_slope_indices, positive_slope_indices]
        for indices in input_indices:
            if winning_indices := self._check_single_win_condition(indices, player):
                return winning_indices
        return False

    def _get_first_open_row(self, col):
        for row in range(self.board.shape[0] - 1, -1, -1):
            if self.board[row][col] == 0:
                return row
            
    def _check_single_win_condition(self, input_indices, player_number):
        for i in range(len(input_indices) - 3):
            if (
                (self.board[input_indices[i][0], input_indices[i][1]] == player_number) and
                (self.board[input_indices[i+1][0], input_indices[i+1][1]] == player_number) and
                (self.board[input_indices[i+2][0], input_indices[i+2][1]] == player_number) and
                (self.board[input_indices[i+3][0], input_indices[i+3][1]] == player_number)
            ):
                return input_indices[i:i+4]
        return False
            
    def _get_horizontal_indices(self, row, col):
        indices = []
        for i in range(-3, 4):
            if (col+i < 0) or (col+i >= self.board.shape[1]):
                continue
            else:
                indices.append((row, col+i))
        return indices
    
    def _get_vertical_indices(self, row, col):
        indices = []
        for i in range(-3, 4):
            if (row+i < 0) or (row+i >= self.board.shape[0]):
                continue
            else:
                indices.append((row+i, col))
        return indices
    
    def _get_negative_slope_indices(self, row, col):
        indices = []
        for i in range(-3, 4):
            if (row+i < 0) or (col+i < 0) or (row+i >= self.board.shape[0]) or (col+i >= self.board.shape[1]):
                continue
            else:
                indices.append((row+i, col+i))
        return indices
    
    def _get_positive_slope_indices(self, row, col):
        indices = []
        for i in range(-3, 4):
            if (row-i < 0) or (col+i < 0) or (row-i >= self.board.shape[0]) or (col+i >= self.board.shape[1]):
                continue
            else:
                indices.append((row-i, col+i))
        return indices
    
    def __str__(self):
        return str(self.board)
    
    def __repr__(self):
        return str(self.board)
    

class ComputerPlayer():
    def __init__(self, board):
        self.board = board

    def get_move(self):
        return np.random.choice(self.board.legal_moves)