import { checkWinner, isBoardFull, getAvailableMoves, makeMove } from './gameLogic.js';

export const getRandomMove = (board) => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    return -1;
  }
  
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

export const getBestMove = (board, aiPlayer, saveTree = false) => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  let bestScore = -Infinity;
  let bestMove = -1;
  
  // Tree data for visualization and analysis
  let treeData = null;
  let startTime = null;
  
  if (saveTree) {
    startTime = performance.now();
    treeData = {
      nodes: [],
      edges: [],
      stats: {
        totalNodes: 0,
        leafNodes: 0,
        prunedNodes: 0,
        maxDepth: 0,
        durationMs: 0,
        cutoffs: {
          alphaCut: 0,
          betaCut: 0
        },
        evalsByDepth: {},
        branchingAtDepth: {}
      },
      pruneEvents: [],
      principalVariation: [],
      roots: [],
      orderingHints: [],
      bestMove: -1
    };
  }
  
  const availableMoves = getAvailableMoves(board);
  
  // Root level candidates
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, aiPlayer);
    const rootNodeId = treeData ? treeData.stats.totalNodes : null;
    
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
    
    if (saveTree) {
      treeData.roots.push({
        move,
        score,
        nodeId: rootNodeId
      });
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  if (saveTree) {
    const endTime = performance.now();
    treeData.stats.durationMs = +(endTime - startTime).toFixed(2);
    treeData.bestMove = bestMove;
    
    // Calculate branching factors
    const childrenCount = {};
    treeData.edges.forEach(edge => {
      if (!edge.pruned) {
        childrenCount[edge.from] = (childrenCount[edge.from] || 0) + 1;
      }
    });
    
    const depthBranching = {};
    treeData.nodes.forEach(node => {
      if (!node.isPruned && childrenCount[node.id]) {
        if (!depthBranching[node.depth]) {
          depthBranching[node.depth] = [];
        }
        depthBranching[node.depth].push(childrenCount[node.id]);
      }
    });
    
    Object.keys(depthBranching).forEach(depth => {
      const branches = depthBranching[depth];
      const avg = branches.reduce((a, b) => a + b, 0) / branches.length;
      treeData.stats.branchingAtDepth[depth] = +avg.toFixed(2);
    });
    
    // Extract principal variation (best path)
    treeData.principalVariation = extractPrincipalVariation(treeData, bestMove);
    
    return { move: bestMove, treeData };
  }
  
  return bestMove;
};

// Helper function to extract principal variation
const extractPrincipalVariation = (treeData, bestMove) => {
  const pv = [bestMove];
  
  // Find the root node with bestMove
  let currentNodeId = null;
  for (const root of treeData.roots) {
    if (root.move === bestMove) {
      currentNodeId = root.nodeId;
      break;
    }
  }
  
  if (currentNodeId === null) return pv;
  
  // Traverse down the tree following the best evaluation
  while (true) {
    const currentNode = treeData.nodes.find(n => n.id === currentNodeId);
    if (!currentNode || currentNode.isLeaf) break;
    
    // Find best child
    const childEdges = treeData.edges.filter(e => e.from === currentNodeId && !e.pruned);
    if (childEdges.length === 0) break;
    
    let bestChild = null;
    let bestValue = currentNode.type === 'max' ? -Infinity : Infinity;
    
    for (const edge of childEdges) {
      const childNode = treeData.nodes.find(n => n.id === edge.to);
      if (!childNode || childNode.isPruned) continue;
      
      const childValue = childNode.value;
      if (typeof childValue === 'number') {
        if (currentNode.type === 'max' && childValue > bestValue) {
          bestValue = childValue;
          bestChild = childNode;
        } else if (currentNode.type === 'min' && childValue < bestValue) {
          bestValue = childValue;
          bestChild = childNode;
        }
      }
    }
    
    if (!bestChild || bestChild.move === null || bestChild.move === undefined) break;
    
    pv.push(bestChild.move);
    currentNodeId = bestChild.id;
    
    // Safety: max PV length
    if (pv.length > 9) break;
  }
  
  return pv;
};

const minimaxWithTree = (board, depth, isMaximizing, aiPlayer, humanPlayer, alpha, beta, treeData, parentNodeId, move = null) => {
  const winner = checkWinner(board);
  
  let nodeId = null;
  if (treeData) {
    nodeId = treeData.stats.totalNodes++;
    
    // Track evaluations by depth
    if (!treeData.stats.evalsByDepth[depth]) {
      treeData.stats.evalsByDepth[depth] = 0;
    }
    treeData.stats.evalsByDepth[depth]++;
    
    const node = {
      id: nodeId,
      depth,
      type: isMaximizing ? 'max' : 'min',
      alpha,
      beta,
      board: [...board],
      value: undefined,
      move,
      isLeaf: false,
      childrenEvaluated: 0
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
        treeData.stats.leafNodes++;
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
        treeData.stats.leafNodes++;
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
        treeData.stats.leafNodes++;
      }
    }
    return 0;
  }
  
  const availableMoves = getAvailableMoves(board);
  
  // Store move ordering hint
  if (treeData) {
    treeData.orderingHints.push({
      nodeId,
      depth,
      movesOrder: [...availableMoves]
    });
  }
  
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
      
      if (treeData && nodeId !== null) {
        const node = treeData.nodes.find(n => n.id === nodeId);
        if (node) node.childrenEvaluated++;
      }
      
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Record pruning event
        if (treeData) {
          const prunedMoves = availableMoves.slice(i + 1);
          treeData.pruneEvents.push({
            atNode: nodeId,
            depth,
            cutoffType: 'alpha',
            bound: alpha,
            afterChildIndex: i,
            prunedMoves,
            beta,
            alpha
          });
          treeData.stats.cutoffs.alphaCut++;
          
          // Mark remaining moves as pruned
          for (let j = i + 1; j < availableMoves.length; j++) {
            treeData.stats.prunedNodes++;
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
      
      if (treeData && nodeId !== null) {
        const node = treeData.nodes.find(n => n.id === nodeId);
        if (node) node.childrenEvaluated++;
      }
      
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        // Record pruning event
        if (treeData) {
          const prunedMoves = availableMoves.slice(i + 1);
          treeData.pruneEvents.push({
            atNode: nodeId,
            depth,
            cutoffType: 'beta',
            bound: beta,
            afterChildIndex: i,
            prunedMoves,
            beta,
            alpha
          });
          treeData.stats.cutoffs.betaCut++;
          
          for (let j = i + 1; j < availableMoves.length; j++) {
            treeData.stats.prunedNodes++;
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

export const getAIMove = (board, aiPlayer, difficulty = 'hard', saveTree = false) => {
  if (difficulty === 'easy') {
    const move = getRandomMove(board);
    return saveTree ? { move, treeData: null } : move;
  } else {
    return getBestMove(board, aiPlayer, saveTree);
  }
};

export const isWinningMove = (board, move, player) => {
  const testBoard = makeMove(board, move, player);
  return checkWinner(testBoard) === player;
};

export const isBlockingMove = (board, move, player) => {
  const opponent = player === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);
  
  for (const opponentMove of availableMoves) {
    if (opponentMove !== move && isWinningMove(board, opponentMove, opponent)) {
      return true;
    }
  }
  return false;
};