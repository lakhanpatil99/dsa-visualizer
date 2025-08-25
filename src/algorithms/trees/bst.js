export class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(data) {
    const newNode = new Node(data);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    this.insertNode(this.root, newNode);
  }

  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(data) {
    return this.searchNode(this.root, data);
  }

  searchNode(node, data) {
    if (node === null) {
      return false;
    }
    
    if (data < node.data) {
      return this.searchNode(node.left, data);
    } else if (data > node.data) {
      return this.searchNode(node.right, data);
    } else {
      return true;
    }
  }

  remove(data) {
    this.root = this.removeNode(this.root, data);
  }

  removeNode(node, data) {
    if (node === null) {
      return null;
    }
    
    if (data < node.data) {
      node.left = this.removeNode(node.left, data);
      return node;
    } else if (data > node.data) {
      node.right = this.removeNode(node.right, data);
      return node;
    } else {
      // Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      
      // Node with two children
      const temp = this.findMinNode(node.right);
      node.data = temp.data;
      node.right = this.removeNode(node.right, temp.data);
      return node;
    }
  }

  findMinNode(node) {
    if (node.left === null) {
      return node;
    } else {
      return this.findMinNode(node.left);
    }
  }

  inorder() {
    const result = [];
    this.inorderTraversal(this.root, result);
    return result;
  }

  inorderTraversal(node, result) {
    if (node !== null) {
      this.inorderTraversal(node.left, result);
      result.push(node.data);
      this.inorderTraversal(node.right, result);
    }
  }

  getHeight() {
    return this.calculateHeight(this.root);
  }

  calculateHeight(node) {
    if (node === null) {
      return -1;
    }
    
    const leftHeight = this.calculateHeight(node.left);
    const rightHeight = this.calculateHeight(node.right);
    
    return Math.max(leftHeight, rightHeight) + 1;
  }
}

export const bstPseudocode = `class Node:
  def __init__(self, data):
    self.data = data
    self.left = None
    self.right = None

class BinarySearchTree:
  def __init__(self):
    self.root = None
  
  def insert(self, data):
    newNode = Node(data)
    if not self.root:
      self.root = newNode
    else:
      self.insertNode(self.root, newNode)
  
  def insertNode(self, node, newNode):
    if newNode.data < node.data:
      if node.left is None:
        node.left = newNode
      else:
        self.insertNode(node.left, newNode)
    else:
      if node.right is None:
        node.right = newNode
      else:
        self.insertNode(node.right, newNode)`;

export const bstComplexity = {
  insert: 'O(h)',
  search: 'O(h)',
  delete: 'O(h)',
  space: 'O(n)',
  height: 'h = log(n) for balanced tree',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(n)'
};
