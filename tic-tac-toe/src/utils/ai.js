// AI algorithms for Tic-Tac-Toe

import { checkWinner, isBoardFull, getAvailableMoves, makeMove } from './gameLogic.js';

/**
 * Easy AI - makes random moves
 * @param {Array} board - current board state
 * @returns {number} - chosen move index
 */
export const getRandomMove = (board) => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    return -1;
  }
  
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

/**
 * Hard AI - uses minimax algorithm with alpha-beta pruning
 * @param {Array} board - current board state
 * @param {string} aiPlayer - AI player symbol ('X' or 'O')
 * @param {boolean} saveTree - whether to save tree data for visualization
 * @returns {number|Object} - chosen move index or object with move and tree data
 */
export const getBestMove = (board, aiPlayer, saveTree = false) => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  let bestScore = -Infinity;
  let bestMove = -1;
  
  // Tree data for visualization
  let treeData = null;
  if (saveTree) {
    treeData = {
      nodes: [],
      edges: [],
      stats: {
        totalNodes: 0,
        prunedNodes: 0,
        maxDepth: 0
      },
      bestMove: -1
    };
  }
  
  const availableMoves = getAvailableMoves(board);
  
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, aiPlayer);
    const score = minimaxWithTree(
      newBoard, 
      0, 
      false, 
      aiPlayer, 
      humanPlayer, 
      -Infinity, 
      Infinity,
      treeData,
      null, // parentNodeId for root is null
      move
    );
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  if (saveTree) {
    treeData.bestMove = bestMove;
    return { move: bestMove, treeData };
  }
  
  return bestMove;
};

/**
 * Minimax algorithm with alpha-beta pruning and tree visualization
 * @param {Array} board - current board state
 * @param {number} depth - current depth in the search tree
 * @param {boolean} isMaximizing - whether current player is maximizing
 * @param {string} aiPlayer - AI player symbol
 * @param {string} humanPlayer - human player symbol
 * @param {number} alpha - alpha value for pruning
 * @param {number} beta - beta value for pruning
 * @param {Object} treeData - tree data for visualization
 * @param {number} parentNodeId - parent node ID for tree structure
 * @param {number} move - the move that led to this board state
 * @returns {number} - evaluation score
 */
const minimaxWithTree = (board, depth, isMaximizing, aiPlayer, humanPlayer, alpha, beta, treeData, parentNodeId, move = null) => {
  const winner = checkWinner(board);
  
  // Create node for tree visualization
  let nodeId = null;
  if (treeData) {
    nodeId = treeData.stats.totalNodes++;
    const node = {
      id: nodeId,
      depth,
      type: isMaximizing ? 'max' : 'min',
      alpha,
      beta,
      board: [...board],
      value: undefined,
      move,
      isLeaf: false
    };
    
    treeData.nodes.push(node);
    treeData.stats.maxDepth = Math.max(treeData.stats.maxDepth, depth);
    
    if (parentNodeId !== undefined && parentNodeId !== null) {
      treeData.edges.push({
        from: parentNodeId,
        to: nodeId,
        pruned: false,
        move
      });
    }
  }
  
  // Terminal states
  if (winner === aiPlayer) {
    if (treeData && nodeId !== null) {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.value = 10 - depth;
        node.isLeaf = true;
      }
    }
    return 10 - depth;
  }
  if (winner === humanPlayer) {
    if (treeData && nodeId !== null) {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.value = depth - 10;
        node.isLeaf = true;
      }
    }
    return depth - 10;
  }
  if (isBoardFull(board)) {
    if (treeData && nodeId !== null) {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.value = 0;
        node.isLeaf = true;
      }
    }
    return 0;
  }
  
  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const newBoard = makeMove(board, move, aiPlayer);
      const eval_ = minimaxWithTree(
        newBoard, 
        depth + 1, 
        false, 
        aiPlayer, 
        humanPlayer, 
        alpha, 
        beta, 
        treeData, 
        nodeId,
        move
      );
      
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Mark remaining moves as pruned
        if (treeData) {
          for (let j = i + 1; j < availableMoves.length; j++) {
            treeData.stats.prunedNodes++;
            // Optionally create pruned nodes for visualization
            const prunedNodeId = treeData.stats.totalNodes++;
            treeData.nodes.push({
              id: prunedNodeId,
              depth: depth + 1,
              type: 'min',
              alpha,
              beta,
              board: makeMove(board, availableMoves[j], aiPlayer),
              value: 'pruned',
              move: availableMoves[j],
              isLeaf: true,
              isPruned: true
            });
            
            treeData.edges.push({
              from: nodeId,
              to: prunedNodeId,
              pruned: true,
              move: availableMoves[j]
            });
          }
        }
        break;
      }
    }
    
    if (treeData && nodeId !== null) {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.value = maxEval;
        node.alpha = alpha;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const newBoard = makeMove(board, move, humanPlayer);
      const eval_ = minimaxWithTree(
        newBoard, 
        depth + 1, 
        true, 
        aiPlayer, 
        humanPlayer, 
        alpha, 
        beta, 
        treeData, 
        nodeId,
        move
      );
      
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Mark remaining moves as pruned
        if (treeData) {
          for (let j = i + 1; j < availableMoves.length; j++) {
            treeData.stats.prunedNodes++;
            // Optionally create pruned nodes for visualization
            const prunedNodeId = treeData.stats.totalNodes++;
            treeData.nodes.push({
              id: prunedNodeId,
              depth: depth + 1,
              type: 'max',
              alpha,
              beta,
              board: makeMove(board, availableMoves[j], humanPlayer),
              value: 'pruned',
              move: availableMoves[j],
              isLeaf: true,
              isPruned: true
            });
            
            treeData.edges.push({
              from: nodeId,
              to: prunedNodeId,
              pruned: true,
              move: availableMoves[j]
            });
          }
        }
        break;
      }
    }
    
    if (treeData && nodeId !== null) {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.value = minEval;
        node.beta = beta;
      }
    }
    return minEval;
  }
};

/**
 * Get AI move based on difficulty
 * @param {Array} board - current board state
 * @param {string} aiPlayer - AI player symbol
 * @param {string} difficulty - 'easy' or 'hard'
 * @param {boolean} saveTree - whether to save tree data for visualization
 * @returns {number|Object} - chosen move index or object with move and tree data
 */
export const getAIMove = (board, aiPlayer, difficulty = 'hard', saveTree = false) => {
  if (difficulty === 'easy') {
    const move = getRandomMove(board);
    return saveTree ? { move, treeData: null } : move;
  } else {
    return getBestMove(board, aiPlayer, saveTree);
  }
};

/**
 * Evaluates if a move is winning
 * @param {Array} board - current board state
 * @param {number} move - move to evaluate
 * @param {string} player - player making the move
 * @returns {boolean} - true if move is winning
 */
export const isWinningMove = (board, move, player) => {
  const testBoard = makeMove(board, move, player);
  return checkWinner(testBoard) === player;
};

/**
 * Evaluates if a move blocks opponent's win
 * @param {Array} board - current board state
 * @param {number} move - move to evaluate
 * @param {string} player - player making the move
 * @returns {boolean} - true if move blocks opponent's win
 */
export const isBlockingMove = (board, move, player) => {
  const opponent = player === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);
  
  // Check if opponent can win in the next move without this blocking move
  for (const opponentMove of availableMoves) {
    if (opponentMove !== move && isWinningMove(board, opponentMove, opponent)) {
      return true;
    }
  }
  return false;
};