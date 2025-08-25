import React, { useState, useEffect, useCallback, useContext } from 'react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import { DarkModeContext } from '../App';
import { Stack, stackPseudocode, stackComplexity } from '../algorithms/dataStructures/stack';
import { Queue, queuePseudocode, queueComplexity } from '../algorithms/dataStructures/queue';
import { 
  LinkedList, 
  DoublyLinkedList, 
  CircularLinkedList,
  linkedListPseudocode, 
  doublyLinkedListPseudocode,
  circularLinkedListPseudocode,
  linkedListComplexity,
  doublyLinkedListComplexity,
  circularLinkedListComplexity
} from '../algorithms/dataStructures/linkedList';
import { MaxHeap, heapPseudocode, heapComplexity } from '../algorithms/dataStructures/heap';
import { HashTable, hashTablePseudocode, hashTableComplexity } from '../algorithms/dataStructures/hashTable';
import { SearchingAlgorithms, linearSearchPseudocode, binarySearchPseudocode, searchingComplexity } from '../algorithms/searching/searching';

const DataStructureVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedStructure, setSelectedStructure] = useState('stack');
  const [selectedLinkedListType, setSelectedLinkedListType] = useState('singly');
  const [selectedHashTableType, setSelectedHashTableType] = useState('separateChaining');
  const [selectedSearchType, setSelectedSearchType] = useState('linear');
  const [inputValue, setInputValue] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  
  // Data structures
  const [stack] = useState(new Stack());
  const [queue] = useState(new Queue());
  const [linkedList] = useState(new LinkedList());
  const [doublyLinkedList] = useState(new DoublyLinkedList());
  const [circularLinkedList] = useState(new CircularLinkedList());
  const [heap] = useState(new MaxHeap());
  const [hashTable] = useState(new HashTable(10, 'separateChaining'));
  const [searchingAlgorithms] = useState(new SearchingAlgorithms());
  
  // State for visualization
  const [stackItems, setStackItems] = useState([]);
  const [queueItems, setQueueItems] = useState([]);
  const [linkedListItems, setLinkedListItems] = useState([]);
  const [doublyLinkedListItems, setDoublyLinkedListItems] = useState([]);
  const [circularLinkedListItems, setCircularLinkedListItems] = useState([]);
  const [heapItems, setHeapItems] = useState([]);
  const [hashTableItems, setHashTableItems] = useState([]);
  const [searchArray, setSearchArray] = useState([]);
  const [searchSteps, setSearchSteps] = useState([]);
  const [currentSearchStep, setCurrentSearchStep] = useState(0);
  
  // Step-by-step execution mode
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [isAlgorithmCompleted, setIsAlgorithmCompleted] = useState(false);
  
  // Progress tracking
  const [exploredAlgorithms, setExploredAlgorithms] = useState(new Set());
  const [totalProgress, setTotalProgress] = useState(0);
  
  // Export functionality
  const [isExporting, setIsExporting] = useState(false);


  const updateDisplay = useCallback(() => {
    setStackItems(stack.getItems());
    setQueueItems(queue.getItems());
    setLinkedListItems(linkedList.toArray());
    setDoublyLinkedListItems(doublyLinkedList.toArray());
    setCircularLinkedListItems(circularLinkedList.toArray());
    setHeapItems(heap.toArray());
    setHashTableItems(hashTable.toArray());
    setSearchArray(searchingAlgorithms.getArray());
  }, [stack, queue, linkedList, doublyLinkedList, circularLinkedList, heap, hashTable, searchingAlgorithms]);

  useEffect(() => {
    updateDisplay();
  }, [updateDisplay]);

  // Initialize search array with some default values
  useEffect(() => {
    const defaultArray = [3, 7, 12, 15, 18, 22, 25, 30, 35, 40];
    searchingAlgorithms.setArray(defaultArray);
    setSearchArray(defaultArray);
  }, [searchingAlgorithms]);

  // Calculate progress
  useEffect(() => {
    const totalAlgorithms = 18; // 6 structures × 3 variations
    const progress = (exploredAlgorithms.size / totalAlgorithms) * 100;
    setTotalProgress(progress);
  }, [exploredAlgorithms]);

  const getCurrentLinkedList = () => {
    switch (selectedLinkedListType) {
      case 'singly':
        return linkedList;
      case 'doubly':
        return doublyLinkedList;
      case 'circular':
        return circularLinkedList;
      default:
        return linkedList;
    }
  };

  const getCurrentLinkedListItems = () => {
    switch (selectedLinkedListType) {
      case 'singly':
        return linkedListItems;
      case 'doubly':
        return doublyLinkedListItems;
      case 'circular':
        return circularLinkedListItems;
      default:
        return linkedListItems;
    }
  };

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    switch (selectedStructure) {
      case 'stack':
        stack.push(value);
        if (isStepMode) {
          generateAlgorithmSteps('push', value);
        }
        break;
      case 'queue':
        queue.enqueue(value);
        if (isStepMode) {
          generateAlgorithmSteps('enqueue', value);
        }
        break;
      case 'linkedList':
        const currentLL = getCurrentLinkedList();
        if (selectedLinkedListType === 'singly') {
          currentLL.insertAtEnd(value);
        } else {
          currentLL.insertAtTail(value);
        }
        if (isStepMode) {
          generateAlgorithmSteps('insertAtTail', value);
        }
        break;
      default:
        break;
    }
    
    setInputValue('');
    updateDisplay();
  };

  const handleAddAtHead = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    if (selectedStructure === 'linkedList') {
      const currentLL = getCurrentLinkedList();
      if (selectedLinkedListType === 'singly') {
        currentLL.insertAtBeginning(value);
      } else {
        currentLL.insertAtHead(value);
      }
      if (isStepMode) {
        generateAlgorithmSteps('insertAtHead', value);
      }
      setInputValue('');
      updateDisplay();
    }
  };

  const handleRemove = () => {
    switch (selectedStructure) {
      case 'stack':
        stack.pop();
        if (isStepMode) {
          generateAlgorithmSteps('pop', null);
        }
        break;
      case 'queue':
        queue.dequeue();
        if (isStepMode) {
          generateAlgorithmSteps('dequeue', null);
        }
        break;
      case 'linkedList':
        const currentLL = getCurrentLinkedList();
        const currentItems = getCurrentLinkedListItems();
        if (currentItems.length > 0) {
          currentLL.deleteNode(currentItems[0]);
          if (isStepMode) {
            generateAlgorithmSteps('delete', null);
          }
        }
        break;
      default:
        break;
    }
    
    updateDisplay();
  };

  const handlePeek = () => {
    let result;
    
    switch (selectedStructure) {
      case 'stack':
        result = stack.peek();
        break;
      case 'queue':
        result = queue.front();
        break;
      case 'linkedList':
        const currentItems = getCurrentLinkedListItems();
        result = currentItems.length > 0 ? currentItems[0] : 'List is empty';
        break;
      default:
        break;
    }
    
    alert(result);
  };

  const handleClear = () => {
    switch (selectedStructure) {
      case 'stack':
        stack.clear();
        break;
      case 'queue':
        queue.clear();
        break;
      case 'linkedList':
        const currentLL = getCurrentLinkedList();
        currentLL.clear();
        break;
      case 'heap':
        heap.clear();
        break;
      case 'hashTable':
        hashTable.clear();
        break;
      case 'searching':
        searchingAlgorithms.clear();
        setSearchArray([]);
        setSearchSteps([]);
        setCurrentSearchStep(0);
        break;
      default:
        break;
    }
    
    updateDisplay();
  };

  // Heap operations
  const handleHeapInsert = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    heap.insert(value);
    if (isStepMode) {
      generateAlgorithmSteps('insert', value);
    }
    setInputValue('');
    updateDisplay();
  };

  const handleHeapExtractMax = () => {
    const max = heap.extractMax();
    if (max !== null) {
      alert(`Extracted max value: ${max}`);
      if (isStepMode) {
        generateAlgorithmSteps('extractMax', max);
      }
    } else {
      alert('Heap is empty');
    }
    updateDisplay();
  };

  const handleBuildHeap = () => {
    const array = [3, 9, 2, 1, 4, 5];
    heap.buildHeap(array);
    updateDisplay();
  };

  const handleHeapSort = () => {
    const sorted = heap.heapSort();
    alert(`Heap Sort Result: [${sorted.join(', ')}]`);
    updateDisplay();
  };

  // Hash Table operations
  const handleHashTableInsert = () => {
    if (!inputValue.trim() || !keyValue.trim()) return;
    
    const key = parseInt(inputValue);
    const value = keyValue;
    
    if (isNaN(key)) return;
    
    hashTable.insert(key, value);
    if (isStepMode) {
      generateAlgorithmSteps('insert', { key, value });
    }
    setInputValue('');
    setKeyValue('');
    updateDisplay();
  };

  const handleHashTableSearch = () => {
    if (!inputValue.trim()) return;
    
    const key = parseInt(inputValue);
    if (isNaN(key)) return;
    
    const value = hashTable.search(key);
    if (value !== null) {
      alert(`Found: Key ${key} -> Value ${value}`);
    } else {
      alert(`Key ${key} not found`);
    }
    
    if (isStepMode) {
      generateAlgorithmSteps('search', key);
    }
  };

  const handleHashTableDelete = () => {
    if (!inputValue.trim()) return;
    
    const key = parseInt(inputValue);
    if (isNaN(key)) return;
    
    const deleted = hashTable.delete(key);
    if (deleted) {
      alert(`Deleted key ${key}`);
    } else {
      alert(`Key ${key} not found`);
    }
    setInputValue('');
    updateDisplay();
  };

  const handleHashTableResize = () => {
    const newSize = hashTable.getSize() === 10 ? 15 : 10;
    hashTable.resize(newSize);
    updateDisplay();
  };

  // Searching operations
  const handleSearch = () => {
    if (!searchTarget.trim()) return;
    
    const target = parseInt(searchTarget);
    if (isNaN(target)) return;
    
    let steps;
    if (selectedSearchType === 'linear') {
      steps = searchingAlgorithms.linearSearch(target);
    } else {
      steps = searchingAlgorithms.binarySearch(target);
    }
    
    setSearchSteps(steps);
    setCurrentSearchStep(0);
    setSearchTarget('');
    
    // If in step mode, also generate algorithm steps for visualization
    if (isStepMode) {
      generateAlgorithmSteps('search', target);
    }
  };

  const handleResetSearch = () => {
    setCurrentSearchStep(0);
  };



  // Step-by-step execution functions
  const handleNextStep = () => {
    if (selectedStructure === 'searching') {
      if (currentSearchStep < searchSteps.length - 1) {
        setCurrentSearchStep(currentSearchStep + 1);
      } else {
        completeAlgorithm();
      }
    } else {
      if (currentAlgorithmStep < algorithmSteps.length - 1) {
        setCurrentAlgorithmStep(currentAlgorithmStep + 1);
      } else {
        completeAlgorithm();
      }
    }
  };

  const handlePreviousStep = () => {
    if (selectedStructure === 'searching') {
      if (currentSearchStep > 0) {
        setCurrentSearchStep(currentSearchStep - 1);
      }
    } else {
      if (currentAlgorithmStep > 0) {
        setCurrentAlgorithmStep(currentAlgorithmStep - 1);
      }
    }
  };

  const handleResetAlgorithm = () => {
    if (selectedStructure === 'searching') {
      setCurrentSearchStep(0);
    } else {
      setCurrentAlgorithmStep(0);
    }
  };

  const completeAlgorithm = () => {
    setIsAlgorithmCompleted(true);
    const algorithmKey = `${selectedStructure}-${selectedStructure === 'linkedList' ? selectedLinkedListType : selectedStructure === 'hashTable' ? selectedHashTableType : selectedStructure === 'searching' ? selectedSearchType : ''}`;
    setExploredAlgorithms(prev => new Set([...prev, algorithmKey]));
    
    // Hide completion popup after 3 seconds
    setTimeout(() => {
      setIsAlgorithmCompleted(false);
    }, 3000);
  };

  const toggleStepMode = () => {
    setIsStepMode(!isStepMode);
    if (!isStepMode) {
      // Enter step mode - generate steps for current algorithm
      generateAlgorithmSteps('initialize', null);
    } else {
      // Exit step mode - reset steps
      setAlgorithmSteps([]);
      setCurrentAlgorithmStep(0);
    }
  };

  const generateAlgorithmSteps = (action, value) => {
    let steps = [];
    
    switch (selectedStructure) {
      case 'stack':
        steps = generateStackSteps(action, value);
        break;
      case 'queue':
        steps = generateQueueSteps(action, value);
        break;
      case 'linkedList':
        steps = generateLinkedListSteps(action, value);
        break;
      case 'heap':
        steps = generateHeapSteps(action, value);
        break;
      case 'hashTable':
        steps = generateHashTableSteps(action, value);
        break;
      case 'searching':
        // Search already has steps
        return;
      default:
        break;
    }
    
    setAlgorithmSteps(steps);
    setCurrentAlgorithmStep(0);
  };

  const generateStackSteps = (action, value) => {
    const steps = [];
    
    if (action === 'push') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Stack initialized with current elements', 
        data: [...stackItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Push', 
        description: `Pushing ${value} onto the stack`, 
        data: [...stackItems, value],
        pseudocodeLine: 2,
        highlightedIndex: stackItems.length
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Push operation completed', 
        data: [...stackItems, value],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'pop') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Stack initialized with current elements', 
        data: [...stackItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Pop', 
        description: 'Popping top element from stack', 
        data: stackItems.slice(0, -1),
        pseudocodeLine: 2,
        highlightedIndex: stackItems.length - 1
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Pop operation completed', 
        data: stackItems.slice(0, -1),
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'initialize') {
      // Default view
      steps.push({ 
        action: 'Initialize', 
        description: 'Stack initialized', 
        data: [...stackItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
    }
    
    return steps;
  };

  const generateQueueSteps = (action, value) => {
    const steps = [];
    
    if (action === 'enqueue') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Queue initialized with current elements', 
        data: [...queueItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Enqueue', 
        description: `Enqueuing ${value} to the queue`, 
        data: [...queueItems, value],
        pseudocodeLine: 2,
        highlightedIndex: queueItems.length
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Enqueue operation completed', 
        data: [...queueItems, value],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'dequeue') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Queue initialized with current elements', 
        data: [...queueItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Dequeue', 
        description: 'Dequeuing front element from queue', 
        data: queueItems.slice(1),
        pseudocodeLine: 2,
        highlightedIndex: 0
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Dequeue operation completed', 
        data: queueItems.slice(1),
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'initialize') {
      // Default view
      steps.push({ 
        action: 'Initialize', 
        description: 'Queue initialized', 
        data: [...queueItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
    }
    
    return steps;
  };

  const generateLinkedListSteps = (action, value) => {
    const steps = [];
    const currentItems = getCurrentLinkedListItems();
    
    if (action === 'insertAtHead') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Linked list initialized with current elements', 
        data: [...currentItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'InsertAtHead', 
        description: `Inserting ${value} at the head`, 
        data: [value, ...currentItems],
        pseudocodeLine: 2,
        highlightedIndex: 0
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Insert at head completed', 
        data: [value, ...currentItems],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'insertAtTail') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Linked list initialized with current elements', 
        data: [...currentItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'InsertAtTail', 
        description: `Inserting ${value} at the tail`, 
        data: [...currentItems, value],
        pseudocodeLine: 2,
        highlightedIndex: currentItems.length
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Insert at tail completed', 
        data: [...currentItems, value],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'delete') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Linked list initialized with current elements', 
        data: [...currentItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Delete', 
        description: 'Deleting element', 
        data: currentItems.slice(0, -1),
        pseudocodeLine: 2,
        highlightedIndex: currentItems.length - 1
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Delete operation completed', 
        data: currentItems.slice(0, -1),
        pseudocodeLine: 3,
        highlightedIndex: null
      });
    } else if (action === 'initialize') {
      // Default view
      steps.push({ 
        action: 'Initialize', 
        description: 'Linked list initialized', 
        data: [...currentItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
    }
    
    return steps;
  };

  const generateHeapSteps = (action, value) => {
    const steps = [];
    
    if (action === 'insert') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Heap initialized with current elements', 
        data: [...heapItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Insert', 
        description: `Inserting ${value} into the heap`, 
        data: [...heapItems, value],
        pseudocodeLine: 2,
        highlightedIndex: heapItems.length
      });
      steps.push({ 
        action: 'Heapify', 
        description: 'Performing heapify operation', 
        data: [...heapItems, value],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Insert operation completed', 
        data: [...heapItems, value],
        pseudocodeLine: 4,
        highlightedIndex: null
      });
    } else if (action === 'extractMax') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Heap initialized with current elements', 
        data: [...heapItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'ExtractMax', 
        description: 'Extracting maximum element', 
        data: heapItems.slice(1),
        pseudocodeLine: 2,
        highlightedIndex: 0
      });
      steps.push({ 
        action: 'Heapify', 
        description: 'Performing heapify operation', 
        data: heapItems.slice(1),
        pseudocodeLine: 3,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Extract max operation completed', 
        data: heapItems.slice(1),
        pseudocodeLine: 4,
        highlightedIndex: null
      });
    } else if (action === 'initialize') {
      // Default view
      steps.push({ 
        action: 'Initialize', 
        description: 'Heap initialized', 
        data: [...heapItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
    }
    
    return steps;
  };

  const generateHashTableSteps = (action, value) => {
    const steps = [];
    
    if (action === 'insert') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Hash table initialized with current elements', 
        data: [...hashTableItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Hash', 
        description: `Computing hash for key ${value.key}`, 
        data: [...hashTableItems],
        pseudocodeLine: 2,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Insert', 
        description: `Inserting key-value pair ${value.key}:${value.value}`, 
        data: [...hashTableItems, value],
        pseudocodeLine: 3,
        highlightedIndex: hashTableItems.length
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Insert operation completed', 
        data: [...hashTableItems, value],
        pseudocodeLine: 4,
        highlightedIndex: null
      });
    } else if (action === 'search') {
      steps.push({ 
        action: 'Initialize', 
        description: 'Hash table initialized with current elements', 
        data: [...hashTableItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Hash', 
        description: `Computing hash for search key ${value}`, 
        data: [...hashTableItems],
        pseudocodeLine: 2,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Search', 
        description: 'Searching for key in hash table', 
        data: [...hashTableItems],
        pseudocodeLine: 3,
        highlightedIndex: null
      });
      steps.push({ 
        action: 'Complete', 
        description: 'Search operation completed', 
        data: [...hashTableItems],
        pseudocodeLine: 4,
        highlightedIndex: null
      });
    } else if (action === 'initialize') {
      // Default view
      steps.push({ 
        action: 'Initialize', 
        description: 'Hash table initialized', 
        data: [...hashTableItems],
        pseudocodeLine: 1,
        highlightedIndex: null
      });
    }
    
    return steps;
  };

  // Export functionality
  const exportVisualization = async () => {
    setIsExporting(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Get the visualization container
      const visualizationContainer = document.querySelector('[data-visualization-container]');
      if (!visualizationContainer) {
        throw new Error('Visualization container not found');
      }
      
      // Set canvas size
      const rect = visualizationContainer.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      
      // Convert DOM to canvas using html2canvas-like approach
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${visualizationContainer.outerHTML}
          </div>
        </foreignObject>
      </svg>`;
      
      const img = new Image();
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedStructure}-visualization.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
        
        setIsExporting(false);
      };
      
      img.src = url;
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  const getCurrentPseudocode = () => {
    if (selectedStructure === 'linkedList') {
      switch (selectedLinkedListType) {
        case 'singly':
          return linkedListPseudocode;
        case 'doubly':
          return doublyLinkedListPseudocode;
        case 'circular':
          return circularLinkedListPseudocode;
        default:
          return linkedListPseudocode;
      }
    }
    
    if (selectedStructure === 'hashTable') {
      return hashTablePseudocode;
    }
    
    if (selectedStructure === 'searching') {
      switch (selectedSearchType) {
        case 'linear':
          return linearSearchPseudocode;
        case 'binary':
          return binarySearchPseudocode;
        default:
          return linearSearchPseudocode;
      }
    }
    
    switch (selectedStructure) {
      case 'stack':
        return stackPseudocode;
      case 'queue':
        return queuePseudocode;
      case 'heap':
        return heapPseudocode;
      default:
        return stackPseudocode;
    }
  };

  const getCurrentPseudocodeLine = () => {
    if (!isStepMode) return null;
    
    if (selectedStructure === 'searching') {
      const currentStep = searchSteps[currentSearchStep];
      if (!currentStep) return null;
      
      // Map search steps to pseudocode lines
      if (selectedSearchType === 'linear') {
        return currentStep.step + 1; // Linear search starts from line 2
      } else {
        return currentStep.step + 1; // Binary search starts from line 2
      }
    } else {
      const currentStep = algorithmSteps[currentAlgorithmStep];
      if (!currentStep) return null;
      
      // Return the pseudocode line from the step data
      return currentStep.pseudocodeLine || null;
    }
  };

  const getCurrentComplexity = () => {
    if (selectedStructure === 'linkedList') {
      switch (selectedLinkedListType) {
        case 'singly':
          return linkedListComplexity;
        case 'doubly':
          return doublyLinkedListComplexity;
        case 'circular':
          return circularLinkedListComplexity;
        default:
          return linkedListComplexity;
      }
    }
    
    if (selectedStructure === 'hashTable') {
      return hashTableComplexity;
    }
    
    if (selectedStructure === 'searching') {
      switch (selectedSearchType) {
        case 'linear':
          return searchingComplexity.linearSearch;
        case 'binary':
          return searchingComplexity.binarySearch;
        default:
          return searchingComplexity.linearSearch;
      }
    }
    
    switch (selectedStructure) {
      case 'stack':
        return stackComplexity;
      case 'queue':
        return queueComplexity;
      case 'heap':
        return heapComplexity;
      default:
        return stackComplexity;
    }
  };

  const renderStack = () => {
    // Use step data when in step mode
    const items = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].data 
      : stackItems;
    
    const highlightedIndex = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].highlightedIndex 
      : null;
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Stack (LIFO)
        </div>
        <div className={`w-32 h-64 border-2 rounded-lg flex flex-col-reverse items-center p-2 transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-800' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`w-20 h-12 text-white rounded-md flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 hover:bg-blue-600 ${
                highlightedIndex === index ? 'bg-yellow-500 scale-110' : 'bg-blue-500'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Size: {items.length} | Top: {items.length > 0 ? items[items.length - 1] : "Empty"}
        </div>
      </div>
    );
  };

  const renderQueue = () => {
    // Use step data when in step mode
    const items = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].data 
      : queueItems;
    
    const highlightedIndex = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].highlightedIndex 
      : null;
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Queue (FIFO)
        </div>
        <div className={`w-96 h-24 border-2 rounded-lg flex items-center justify-start p-2 space-x-2 transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-800' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-md flex items-center justify-center font-bold text-lg transition-all duration-300 text-white hover:scale-105 ${
                highlightedIndex === index ? 'bg-yellow-500 scale-110' : (index === 0 ? 'bg-green-500' : 'bg-blue-500')
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Size: {items.length} | Front: {items.length > 0 ? items[0] : "Empty"}
        </div>
      </div>
    );
  };

  const renderLinkedList = () => {
    // Use step data when in step mode
    const currentItems = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].data 
      : getCurrentLinkedListItems();
    
    const highlightedIndex = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].highlightedIndex 
      : null;
    
    const currentLL = getCurrentLinkedList();
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {selectedLinkedListType === 'singly' && 'Singly Linked List'}
          {selectedLinkedListType === 'doubly' && 'Doubly Linked List'}
          {selectedLinkedListType === 'circular' && 'Circular Linked List'}
        </div>
        
        {/* LinkedList Type Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedLinkedListType}
            onChange={(e) => setSelectedLinkedListType(e.target.value)}
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="singly">Singly</option>
            <option value="doubly">Doubly</option>
            <option value="circular">Circular</option>
          </select>
        </div>

        {/* Legend */}
        <div className={`text-xs space-y-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {selectedLinkedListType === 'doubly' && (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-500"></div>
                <span>Next Pointer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-red-500"></div>
                <span>Previous Pointer</span>
              </div>
            </div>
          )}
          {selectedLinkedListType === 'circular' && (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span>Circular Connection</span>
              </div>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex items-center space-x-2">
          {currentItems.map((item, index) => (
            <div key={index} className="flex items-center animate-fadeIn">
              {/* Node */}
              <div className="relative">
                <div className={`w-16 h-16 text-white rounded-md flex items-center justify-center font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 shadow-lg ${
                  highlightedIndex === index ? 'bg-yellow-500 scale-110' : 'bg-blue-500'
                }`}>
                  {item}
                </div>
                
                {/* Doubly Linked List Previous Pointer */}
                {selectedLinkedListType === 'doubly' && index > 0 && (
                  <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 animate-slideInLeft">
                    <div className={`w-6 h-1 bg-red-500 transform rotate-180 transition-all duration-300 ${
                      isDarkMode ? 'bg-red-400' : 'bg-red-500'
                    }`}></div>
                    <div className={`w-3 h-3 border-l-2 border-b-2 border-red-500 transform rotate-45 absolute -left-1 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'border-red-400' : 'border-red-500'
                    }`}></div>
                  </div>
                )}
                
                {/* Doubly Linked List Next Pointer */}
                {selectedLinkedListType === 'doubly' && index < currentItems.length - 1 && (
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 animate-slideInRight">
                    <div className={`w-6 h-1 bg-blue-500 transition-all duration-300 ${
                      isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                    }`}></div>
                    <div className={`w-3 h-3 border-r-2 border-t-2 border-blue-500 transform rotate-45 absolute -right-1 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'border-blue-400' : 'border-blue-500'
                    }`}></div>
                  </div>
                )}
              </div>
              
              {/* Next Pointer (for all types) */}
              {index < currentItems.length - 1 && (
                <div className="relative mx-2 animate-fadeIn">
                  <div className={`w-8 h-1 transition-colors duration-200 ${
                    selectedLinkedListType === 'doubly' ? 'bg-blue-500' : 
                    selectedLinkedListType === 'circular' ? 'bg-green-500' : 
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <div className={`w-3 h-3 border-r-2 border-t-2 absolute -right-1 top-1/2 -translate-y-1/2 transform rotate-45 ${
                    selectedLinkedListType === 'doubly' ? 'border-blue-500' : 
                    selectedLinkedListType === 'circular' ? 'border-green-500' : 
                    isDarkMode ? 'border-gray-500' : 'border-gray-400'
                  }`}></div>
                </div>
              )}
              
              {/* Circular Connection (last to first) */}
              {selectedLinkedListType === 'circular' && index === currentItems.length - 1 && currentItems.length > 1 && (
                <div className="relative animate-bounce">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className={`w-1 h-8 bg-green-500 transition-all duration-300 ${
                      isDarkMode ? 'bg-green-400' : 'bg-green-500'
                    }`}></div>
                    <div className={`w-3 h-3 border-l-2 border-b-2 border-green-500 transform rotate-45 absolute -left-1 top-0 ${
                      isDarkMode ? 'border-green-400' : 'border-green-500'
                    }`}></div>
                  </div>
                  <div className="absolute -top-8 -left-8">
                    <div className={`w-8 h-1 bg-green-500 transition-all duration-300 ${
                      isDarkMode ? 'bg-green-400' : 'bg-green-500'
                    }`}></div>
                    <div className={`w-3 h-3 border-r-2 border-t-2 border-green-500 transform rotate-45 absolute -right-1 top-0 ${
                      isDarkMode ? 'border-green-400' : 'border-green-500'
                    }`}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Size: {currentLL.getSize()} | Head: {currentItems.length > 0 ? currentItems[0] : "Empty"}
          {selectedLinkedListType === 'doubly' && currentItems.length > 0 && ` | Tail: ${currentItems[currentItems.length - 1]}`}
        </div>
      </div>
    );
  };

  const renderHeap = () => {
    // Use step data when in step mode
    const items = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].data 
      : heapItems;
    
    const highlightedIndex = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].highlightedIndex 
      : null;
    
    // Calculate positions for tree visualization
    const getNodePosition = (index, level, maxLevel) => {
      const levelWidth = Math.pow(2, level);
      const positionInLevel = index - Math.pow(2, level) + 1;
      const x = (positionInLevel / (levelWidth - 1)) * 400 - 200;
      const y = level * 80;
      return { x, y };
    };
    
    const getLevel = (index) => {
      return Math.floor(Math.log2(index + 1));
    };
    
    const maxLevel = items.length > 0 ? getLevel(items.length - 1) : 0;
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Max Heap
        </div>
        
        {/* Tree Visualization */}
        <div className="relative w-96 h-64 border-2 border-gray-300 rounded-lg bg-gray-50">
          {items.map((item, index) => {
            const level = getLevel(index);
            const { x, y } = getNodePosition(index, level, maxLevel);
            const parentIndex = Math.floor((index - 1) / 2);
            const hasParent = parentIndex >= 0;
            const parentLevel = hasParent ? getLevel(parentIndex) : 0;
            const parentPos = hasParent ? getNodePosition(parentIndex, parentLevel, maxLevel) : null;
            
            return (
              <div key={index} className="absolute transform -translate-x-1/2 -translate-y-1/2">
                {/* Connection line to parent */}
                {hasParent && parentPos && (
                  <svg
                    className="absolute w-full h-full pointer-events-none"
                    style={{
                      left: `${parentPos.x}px`,
                      top: `${parentPos.y}px`,
                      width: `${x - parentPos.x}px`,
                      height: `${y - parentPos.y}px`
                    }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2={x - parentPos.x}
                      y2={y - parentPos.y}
                      stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                      strokeWidth="2"
                    />
                  </svg>
                )}
                
                {/* Node */}
                <div 
                  className={`w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 hover:bg-blue-600 hover:scale-110 shadow-lg ${
                    highlightedIndex === index ? 'bg-yellow-500 scale-125' : 'bg-blue-500'
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Array Representation */}
        <div className="flex items-center space-x-2">
          {items.map((item, index) => (
            <div key={index} className={`w-12 h-12 text-white rounded-md flex items-center justify-center font-bold text-sm transition-all duration-300 hover:bg-green-600 ${
              highlightedIndex === index ? 'bg-yellow-500 scale-110' : 'bg-green-500'
            }`}>
              {item}
            </div>
          ))}
        </div>
        
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Size: {heap.getSize()} | Max: {heap.peek() || "Empty"} | Load Factor: {(heap.getSize() / Math.pow(2, maxLevel + 1) * 100).toFixed(1)}%
        </div>
      </div>
    );
  };

  const renderHashTable = () => {
    // Use step data when in step mode
    const items = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].data 
      : hashTableItems;
    
    const highlightedIndex = isStepMode && algorithmSteps[currentAlgorithmStep] 
      ? algorithmSteps[currentAlgorithmStep].highlightedIndex 
      : null;
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Hash Table - {selectedHashTableType === 'separateChaining' ? 'Separate Chaining' : 'Linear Probing'}
        </div>
        
        {/* Hash Table Type Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedHashTableType}
            onChange={(e) => {
              setSelectedHashTableType(e.target.value);
              hashTable.collisionResolution = e.target.value;
              hashTable.clear();
              updateDisplay();
            }}
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="separateChaining">Separate Chaining</option>
            <option value="linearProbing">Linear Probing</option>
          </select>
        </div>

        {/* Hash Table Visualization */}
        <div className="grid grid-cols-5 gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* Index */}
              <div className={`text-xs font-mono ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {index}
              </div>
              
              {/* Bucket */}
              <div className={`w-20 h-20 border-2 rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-300 ${
                highlightedIndex === index 
                  ? 'border-yellow-500 bg-yellow-100 scale-110' 
                  : item.isCollision 
                    ? 'border-red-500 bg-red-100' 
                    : 'border-gray-300 bg-gray-50'
              }`}>
                {selectedHashTableType === 'separateChaining' ? (
                  // Separate Chaining
                  Array.isArray(item.data) ? (
                    item.data.length > 0 ? (
                      <div className="space-y-1">
                        {item.data.map((entry, entryIndex) => (
                          <div key={entryIndex} className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded">
                            {entry.key}:{entry.value}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Empty</span>
                    )
                  ) : (
                    <span className="text-xs text-gray-400">Empty</span>
                  )
                ) : (
                  // Linear Probing
                  item.data ? (
                    <div className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded">
                      {item.data.key}:{item.data.value}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Empty</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Size: {hashTable.getSize()} | Elements: {hashTable.getCount()} | Load Factor: {(hashTable.getLoadFactor() * 100).toFixed(1)}% | Collisions: {hashTable.getCollisionCount()}
        </div>
      </div>
    );
  };

  const renderSearching = () => {
    const array = searchArray;
    const currentStep = searchSteps[currentSearchStep];
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {selectedSearchType === 'linear' ? 'Linear Search' : 'Binary Search'}
        </div>
        
        {/* Search Type Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedSearchType}
            onChange={(e) => setSelectedSearchType(e.target.value)}
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search</option>
          </select>
        </div>

        {/* Array Visualization */}
        <div className="flex items-center space-x-2">
          {array.map((item, index) => {
            let bgColor = 'bg-blue-500';
            let borderColor = 'border-2 border-transparent';
            
            if (currentStep) {
              if (selectedSearchType === 'linear') {
                if (currentStep.currentIndex === index) {
                  bgColor = 'bg-yellow-500';
                  borderColor = 'border-2 border-yellow-700';
                } else if (currentStep.currentIndex > index) {
                  bgColor = 'bg-green-500';
                }
              } else {
                // Binary Search
                if (currentStep.mid === index) {
                  bgColor = 'bg-yellow-500';
                  borderColor = 'border-2 border-yellow-700';
                } else if (index >= currentStep.left && index <= currentStep.right) {
                  bgColor = 'bg-blue-400';
                } else {
                  bgColor = 'bg-gray-400';
                }
              }
            }
            
            return (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className={`text-xs font-mono ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {index}
                </div>
                <div className={`w-12 h-12 ${bgColor} text-white rounded-md flex items-center justify-center font-bold text-sm transition-all duration-300 ${borderColor}`}>
                  {item}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Search Controls */}
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
            placeholder="Enter target value"
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium"
          >
            Search
          </button>
        </div>
        
        {/* Step Controls */}
        {searchSteps.length > 0 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousStep}
              disabled={currentSearchStep === 0}
              className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200"
            >
              Previous
            </button>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Step {currentSearchStep + 1} of {searchSteps.length}
            </span>
            <button
              onClick={handleNextStep}
              disabled={currentSearchStep === searchSteps.length - 1}
              className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200"
            >
              Next
            </button>
            <button
              onClick={handleResetSearch}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        )}
        
        {/* Current Step Info */}
        {currentStep && (
          <div className={`text-sm text-center max-w-md ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentStep.message}
          </div>
        )}
        
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Array Size: {array.length} | {selectedSearchType === 'binary' && 'Sorted Array Required'}
        </div>
      </div>
    );
  };

  // Left Sidebar Content
  const renderLeftSidebar = () => (
    <div className="space-y-6">
      {/* Structure Selection */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Select Data Structure
        </h3>
        <select
          value={selectedStructure}
          onChange={(e) => setSelectedStructure(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
          <option value="linkedList">Linked List</option>
          <option value="heap">Heap</option>
          <option value="hashTable">Hash Table</option>
          <option value="searching">Searching Algorithms</option>
        </select>
      </div>

      {/* Structure Info */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {selectedStructure === 'stack' && 'Stack (LIFO)'}
          {selectedStructure === 'queue' && 'Queue (FIFO)'}
          {selectedStructure === 'linkedList' && 'Linked List'}
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {selectedStructure === 'stack' && 'Last In, First Out - elements are added and removed from the top'}
          {selectedStructure === 'queue' && 'First In, First Out - elements are added at the rear and removed from the front'}
          {selectedStructure === 'linkedList' && (
            selectedLinkedListType === 'singly' ? 'Linear data structure with nodes connected by forward pointers only' :
            selectedLinkedListType === 'doubly' ? 'Linear data structure with nodes connected by both forward and backward pointers' :
            'Linear data structure with nodes connected in a circular pattern, last node points to first'
          )}
          {selectedStructure === 'heap' && 'Complete binary tree where parent is always greater than children (Max Heap)'}
          {selectedStructure === 'hashTable' && (
            selectedHashTableType === 'separateChaining' ? 'Data structure using hash function with linked lists for collision resolution' :
            'Data structure using hash function with linear probing for collision resolution'
          )}
          {selectedStructure === 'searching' && (
            selectedSearchType === 'linear' ? 'Sequential search through each element in the array' :
            'Divide and conquer search algorithm requiring sorted array'
          )}
        </p>
      </div>

      {/* Input Controls */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Input Controls
        </h3>
        <div className="space-y-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedStructure === 'hashTable' ? 'Enter key (number)' :
              selectedStructure === 'searching' ? 'Enter target value' :
              'Enter a number'
            }
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          {/* Key-value input for hash table */}
          {selectedStructure === 'hashTable' && (
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="Enter value (text)"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          )}

          {/* Main action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={
                selectedStructure === 'heap' ? handleHeapInsert :
                selectedStructure === 'hashTable' ? handleHashTableInsert :
                selectedStructure === 'searching' ? handleSearch :
                handleAdd
              }
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium"
            >
              {selectedStructure === 'linkedList' ? 'Add at Tail' : 
               selectedStructure === 'heap' ? 'Insert' :
               selectedStructure === 'hashTable' ? 'Insert' :
               selectedStructure === 'searching' ? 'Search' :
               'Add'}
            </button>
            <button
              onClick={
                selectedStructure === 'heap' ? handleHeapExtractMax :
                selectedStructure === 'hashTable' ? handleHashTableDelete :
                handleRemove
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
            >
              {selectedStructure === 'heap' ? 'Extract Max' :
               selectedStructure === 'hashTable' ? 'Delete' :
               'Remove'}
            </button>
          </div>
          
          {/* Additional buttons for linked list */}
          {selectedStructure === 'linkedList' && (
            <button
              onClick={handleAddAtHead}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
            >
              Add at Head
            </button>
          )}
          
          {/* Additional buttons for heap */}
          {selectedStructure === 'heap' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBuildHeap}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 font-medium"
              >
                Build Heap
              </button>
              <button
                onClick={handleHeapSort}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium"
              >
                Heap Sort
              </button>
            </div>
          )}
          
          {/* Additional buttons for hash table */}
          {selectedStructure === 'hashTable' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleHashTableSearch}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 font-medium"
              >
                Search
              </button>
              <button
                onClick={handleHashTableResize}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 font-medium"
              >
                Resize
              </button>
            </div>
          )}
          {/* Step-by-Step Controls */}
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Step-by-Step Mode
              </span>
              <button
                onClick={toggleStepMode}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  isStepMode 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {isStepMode ? 'ON' : 'OFF'}
              </button>
            </div>
            
            {isStepMode && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousStep}
                    disabled={
                      selectedStructure === 'searching' ? currentSearchStep === 0 : currentAlgorithmStep === 0
                    }
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all duration-200"
                  >
                    Previous
                  </button>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Step {
                      selectedStructure === 'searching' 
                        ? `${currentSearchStep + 1} of ${searchSteps.length}` 
                        : `${currentAlgorithmStep + 1} of ${algorithmSteps.length}`
                    }
                  </span>
                  <button
                    onClick={handleNextStep}
                    disabled={
                      selectedStructure === 'searching' 
                        ? currentSearchStep === searchSteps.length - 1 
                        : currentAlgorithmStep === algorithmSteps.length - 1
                    }
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
                <button
                  onClick={handleResetAlgorithm}
                  className="w-full px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePeek}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 font-medium"
            >
              Peek
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Structure Statistics */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Statistics
        </h3>
        <div className={`space-y-2 text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex justify-between">
            <span>Current Size:</span>
            <span className="font-mono">
              {selectedStructure === 'stack' && stack.size()}
              {selectedStructure === 'queue' && queue.size()}
              {selectedStructure === 'linkedList' && getCurrentLinkedList().getSize()}
              {selectedStructure === 'heap' && heap.getSize()}
              {selectedStructure === 'hashTable' && hashTable.getCount()}
              {selectedStructure === 'searching' && searchArray.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Top/Front/Head/Max:</span>
            <span className="font-mono">
              {selectedStructure === 'stack' && (stack.peek() !== "Stack is empty" ? stack.peek() : "Empty")}
              {selectedStructure === 'queue' && (queue.front() !== "Queue is empty" ? queue.front() : "Empty")}
              {selectedStructure === 'linkedList' && (getCurrentLinkedListItems().length > 0 ? getCurrentLinkedListItems()[0] : "Empty")}
              {selectedStructure === 'heap' && (heap.peek() || "Empty")}
              {selectedStructure === 'hashTable' && `${hashTable.getLoadFactor().toFixed(2)} load factor`}
              {selectedStructure === 'searching' && `${searchSteps.length} steps`}
            </span>
          </div>
          
          {/* Progress Tracker */}
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Learning Progress
              </span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {Math.round(totalProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
            <div className={`text-xs mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {exploredAlgorithms.size} of 18 algorithms explored
            </div>
          </div>
          
          {/* Export Button */}
          <div className="border-t pt-3 mt-3">
            <button
              onClick={exportVisualization}
              disabled={isExporting}
              className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                isExporting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105'
              }`}
            >
              {isExporting ? 'Exporting...' : '📷 Export Visualization'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Right Sidebar Content
  const renderRightSidebar = () => (
    <div className="space-y-6">
      {/* Complexity Box */}
      <ComplexityBox
        timeComplexity={getCurrentComplexity().insert || getCurrentComplexity().push || 'O(1)'}
        spaceComplexity={getCurrentComplexity().space}
        bestCase={getCurrentComplexity().bestCase}
        averageCase={getCurrentComplexity().averageCase}
        worstCase={getCurrentComplexity().worstCase}
      />

      {/* Pseudocode Panel */}
      <PseudocodePanel
        title={`${selectedStructure.charAt(0).toUpperCase() + selectedStructure.slice(1)} Implementation`}
        code={getCurrentPseudocode()}
        currentLine={getCurrentPseudocodeLine()}
      />
    </div>
  );

  // Bottom Controls
  const renderBottomControls = () => (
    <div className={`p-4 rounded-lg transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-700 border border-gray-600' 
        : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <strong>Status:</strong> Ready
          </span>
        </div>
        <div className="text-xs text-gray-500">
          © Lakhansing Reserved 2025 - AlgoMania
        </div>
      </div>
    </div>
  );

  return (
    <VisualizerLayout
      title="Data Structures - AlgoMania"
      subtitle="Explore and visualize fundamental data structures"
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
      bottomControls={renderBottomControls()}
    >
      {/* Center Visualization Area */}
      <div className="h-full flex flex-col">
        {/* Main Visualization */}
        <div className="flex-1 mb-6" data-visualization-container>
          <VisualizerCanvas 
            width="100%" 
            height="100%"
            title={`${selectedStructure.charAt(0).toUpperCase() + selectedStructure.slice(1)} Visualization`}
          >
            {selectedStructure === 'stack' && renderStack()}
            {selectedStructure === 'queue' && renderQueue()}
            {selectedStructure === 'linkedList' && renderLinkedList()}
            {selectedStructure === 'heap' && renderHeap()}
            {selectedStructure === 'hashTable' && renderHashTable()}
            {selectedStructure === 'searching' && renderSearching()}
          </VisualizerCanvas>
        </div>

        {/* Algorithm Completion Popup */}
        {isAlgorithmCompleted && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl transform transition-all duration-300 scale-100">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Algorithm Completed!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Great job! You've successfully explored this algorithm.
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(totalProgress)}% of algorithms explored
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Structure Status */}
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Structure:</strong> {selectedStructure === 'stack' && 'Stack (LIFO)'}
                {selectedStructure === 'queue' && 'Queue (FIFO)'}
                {selectedStructure === 'linkedList' && (
                  selectedLinkedListType === 'singly' ? 'Singly Linked List' :
                  selectedLinkedListType === 'doubly' ? 'Doubly Linked List' :
                  'Circular Linked List'
                )}
                {selectedStructure === 'heap' && 'Max Heap'}
                {selectedStructure === 'hashTable' && (
                  selectedHashTableType === 'separateChaining' ? 'Hash Table (Separate Chaining)' :
                  'Hash Table (Linear Probing)'
                )}
                {selectedStructure === 'searching' && (
                  selectedSearchType === 'linear' ? 'Linear Search' :
                  'Binary Search'
                )}
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Elements:</strong> {
                  selectedStructure === 'stack' ? stack.size() :
                  selectedStructure === 'queue' ? queue.size() :
                  selectedStructure === 'linkedList' ? getCurrentLinkedList().getSize() :
                  selectedStructure === 'heap' ? heap.getSize() :
                  selectedStructure === 'hashTable' ? hashTable.getCount() :
                  selectedStructure === 'searching' ? searchArray.length : 0
                }
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default DataStructureVisualizer;
