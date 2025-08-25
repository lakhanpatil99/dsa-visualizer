export class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export const inorderTraversal = (root, result = []) => {
  if (root !== null) {
    inorderTraversal(root.left, result);
    result.push(root.data);
    inorderTraversal(root.right, result);
  }
  return result;
};

export const preorderTraversal = (root, result = []) => {
  if (root !== null) {
    result.push(root.data);
    preorderTraversal(root.left, result);
    preorderTraversal(root.right, result);
  }
  return result;
};

export const postorderTraversal = (root, result = []) => {
  if (root !== null) {
    postorderTraversal(root.left, result);
    postorderTraversal(root.right, result);
    result.push(root.data);
  }
  return result;
};

export const levelOrderTraversal = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.data);
      
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    
    result.push(currentLevel);
  }
  
  return result;
};

export const depthFirstSearch = (root, target) => {
  if (!root) return false;
  
  if (root.data === target) return true;
  
  return depthFirstSearch(root.left, target) || depthFirstSearch(root.right, target);
};

export const breadthFirstSearch = (root, target) => {
  if (!root) return false;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (node.data === target) return true;
    
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }
  
  return false;
};

export const treeTraversalPseudocode = `# Inorder Traversal (Left -> Root -> Right)
def inorderTraversal(root, result=[]):
  if root is not None:
    inorderTraversal(root.left, result)
    result.append(root.data)
    inorderTraversal(root.right, result)
  return result

# Preorder Traversal (Root -> Left -> Right)
def preorderTraversal(root, result=[]):
  if root is not None:
    result.append(root.data)
    preorderTraversal(root.left, result)
    preorderTraversal(root.right, result)
  return result

# Postorder Traversal (Left -> Right -> Root)
def postorderTraversal(root, result=[]):
  if root is not None:
    postorderTraversal(root.left, result)
    postorderTraversal(root.right, result)
    result.append(root.data)
  return result

# Level Order Traversal (Breadth First)
def levelOrderTraversal(root):
  if not root:
    return []
  
  result = []
  queue = [root]
  
  while queue:
    levelSize = len(queue)
    currentLevel = []
    
    for i in range(levelSize):
      node = queue.pop(0)
      currentLevel.append(node.data)
      
      if node.left:
        queue.append(node.left)
      if node.right:
        queue.append(node.right)
    
    result.append(currentLevel)
  
  return result`;

export const traversalComplexity = {
  inorder: 'O(n)',
  preorder: 'O(n)',
  postorder: 'O(n)',
  levelOrder: 'O(n)',
  space: 'O(n)',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)'
};
