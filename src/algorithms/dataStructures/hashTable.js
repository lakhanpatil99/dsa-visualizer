export class HashTable {
  constructor(size = 10, collisionResolution = 'separateChaining') {
    this.size = size;
    this.collisionResolution = collisionResolution;
    this.table = new Array(size);
    this.count = 0;
    
    // Initialize table based on collision resolution method
    if (collisionResolution === 'separateChaining') {
      for (let i = 0; i < size; i++) {
        this.table[i] = [];
      }
    } else {
      for (let i = 0; i < size; i++) {
        this.table[i] = null;
      }
    }
  }

  // Hash function
  hash(key) {
    if (typeof key === 'number') {
      return key % this.size;
    }
    
    if (typeof key === 'string') {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % this.size;
      }
      return hash;
    }
    
    return 0;
  }

  // Insert key-value pair
  insert(key, value) {
    const hashIndex = this.hash(key);
    
    if (this.collisionResolution === 'separateChaining') {
      // Check if key already exists
      const existingIndex = this.table[hashIndex].findIndex(item => item.key === key);
      if (existingIndex !== -1) {
        this.table[hashIndex][existingIndex].value = value;
      } else {
        this.table[hashIndex].push({ key, value });
        this.count++;
      }
    } else {
      // Linear probing
      let currentIndex = hashIndex;
      let attempts = 0;
      
      while (this.table[currentIndex] !== null && this.table[currentIndex].key !== key && attempts < this.size) {
        currentIndex = (currentIndex + 1) % this.size;
        attempts++;
      }
      
      if (this.table[currentIndex] === null || this.table[currentIndex].key === key) {
        if (this.table[currentIndex] === null) {
          this.count++;
        }
        this.table[currentIndex] = { key, value };
      }
    }
  }

  // Search for a key
  search(key) {
    const hashIndex = this.hash(key);
    
    if (this.collisionResolution === 'separateChaining') {
      const item = this.table[hashIndex].find(item => item.key === key);
      return item ? item.value : null;
    } else {
      // Linear probing
      let currentIndex = hashIndex;
      let attempts = 0;
      
      while (this.table[currentIndex] !== null && this.table[currentIndex].key !== key && attempts < this.size) {
        currentIndex = (currentIndex + 1) % this.size;
        attempts++;
      }
      
      return this.table[currentIndex] && this.table[currentIndex].key === key ? this.table[currentIndex].value : null;
    }
  }

  // Delete a key-value pair
  delete(key) {
    const hashIndex = this.hash(key);
    
    if (this.collisionResolution === 'separateChaining') {
      const index = this.table[hashIndex].findIndex(item => item.key === key);
      if (index !== -1) {
        this.table[hashIndex].splice(index, 1);
        this.count--;
        return true;
      }
    } else {
      // Linear probing
      let currentIndex = hashIndex;
      let attempts = 0;
      
      while (this.table[currentIndex] !== null && this.table[currentIndex].key !== key && attempts < this.size) {
        currentIndex = (currentIndex + 1) % this.size;
        attempts++;
      }
      
      if (this.table[currentIndex] && this.table[currentIndex].key === key) {
        this.table[currentIndex] = null;
        this.count--;
        return true;
      }
    }
    
    return false;
  }

  // Get load factor
  getLoadFactor() {
    return this.count / this.size;
  }

  // Get collision count
  getCollisionCount() {
    let collisions = 0;
    
    if (this.collisionResolution === 'separateChaining') {
      for (let i = 0; i < this.size; i++) {
        if (this.table[i].length > 1) {
          collisions += this.table[i].length - 1;
        }
      }
    } else {
      // For linear probing, count entries that are not at their original hash index
      for (let i = 0; i < this.size; i++) {
        if (this.table[i] !== null) {
          const originalHash = this.hash(this.table[i].key);
          if (i !== originalHash) {
            collisions++;
          }
        }
      }
    }
    
    return collisions;
  }

  // Get table as array for visualization
  toArray() {
    return this.table.map((item, index) => ({
      index,
      hash: index,
      data: item,
      isCollision: this.collisionResolution === 'separateChaining' ? 
        (Array.isArray(item) && item.length > 1) : 
        (item !== null && this.hash(item.key) !== index)
    }));
  }

  // Get size
  getSize() {
    return this.size;
  }

  // Get count
  getCount() {
    return this.count;
  }

  // Check if empty
  isEmpty() {
    return this.count === 0;
  }

  // Clear table
  clear() {
    if (this.collisionResolution === 'separateChaining') {
      for (let i = 0; i < this.size; i++) {
        this.table[i] = [];
      }
    } else {
      for (let i = 0; i < this.size; i++) {
        this.table[i] = null;
      }
    }
    this.count = 0;
  }

  // Resize table
  resize(newSize) {
    const oldTable = this.table;
    const oldSize = this.size;
    
    this.size = newSize;
    this.table = new Array(newSize);
    this.count = 0;
    
    if (this.collisionResolution === 'separateChaining') {
      for (let i = 0; i < newSize; i++) {
        this.table[i] = [];
      }
    } else {
      for (let i = 0; i < newSize; i++) {
        this.table[i] = null;
      }
    }
    
    // Rehash all existing elements
    for (let i = 0; i < oldSize; i++) {
      if (this.collisionResolution === 'separateChaining') {
        for (const item of oldTable[i]) {
          this.insert(item.key, item.value);
        }
      } else {
        if (oldTable[i] !== null) {
          this.insert(oldTable[i].key, oldTable[i].value);
        }
      }
    }
  }
}

export const hashTablePseudocode = `class HashTable:
  def __init__(self, size=10, collision_resolution='separate_chaining'):
    self.size = size
    self.collision_resolution = collision_resolution
    self.table = [None] * size
    self.count = 0
    
    if collision_resolution == 'separate_chaining':
      for i in range(size):
        self.table[i] = []
  
  def hash(self, key):
    if isinstance(key, int):
      return key % self.size
    
    if isinstance(key, str):
      hash_val = 0
      for char in key:
        hash_val = (hash_val * 31 + ord(char)) % self.size
      return hash_val
    
    return 0
  
  def insert(self, key, value):
    hash_index = self.hash(key)
    
    if self.collision_resolution == 'separate_chaining':
      # Check if key exists
      for item in self.table[hash_index]:
        if item['key'] == key:
          item['value'] = value
          return
      
      self.table[hash_index].append({'key': key, 'value': value})
      self.count += 1
    else:
      # Linear probing
      current_index = hash_index
      while self.table[current_index] is not None:
        if self.table[current_index]['key'] == key:
          self.table[current_index]['value'] = value
          return
        current_index = (current_index + 1) % self.size
      
      self.table[current_index] = {'key': key, 'value': value}
      self.count += 1`;

export const hashTableComplexity = {
  insert: 'O(1) average, O(n) worst',
  search: 'O(1) average, O(n) worst',
  delete: 'O(1) average, O(n) worst',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(1)',
  worstCase: 'O(n)'
};
