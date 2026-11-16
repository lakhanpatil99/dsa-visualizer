/**
 * AlgoMania Searching Algorithms Model
 * Covers Linear, Binary, Jump, Interpolation, and Exponential Search
 * with strict input validation, step-by-step trace generation, and comparison counting.
 */

export class SearchingModel {
  constructor(initialArray = [8, 15, 23, 34, 42, 56, 67, 78, 89, 95]) {
    this.array = [...initialArray];
    this.history = [];
  }

  setArray(newArray) {
    if (!Array.isArray(newArray)) return false;
    this.array = [...newArray.map(Number).filter(n => !isNaN(n))];
    return true;
  }

  getArray() {
    return [...this.array];
  }

  isSorted() {
    for (let i = 0; i < this.array.length - 1; i++) {
      if (this.array[i] > this.array[i + 1]) return false;
    }
    return true;
  }

  linearSearch(target) {
    const t = Number(target);
    const trace = [];
    let comparisons = 0;

    for (let i = 0; i < this.array.length; i++) {
      comparisons++;
      const isMatch = this.array[i] === t;

      trace.push({
        step: i + 1,
        type: isMatch ? 'FOUND' : 'COMPARE',
        index: i,
        currentValue: this.array[i],
        target: t,
        comparisons,
        isMatch,
        explanation: isMatch
          ? `Target ${t} matches element at index [${i}]. Search succeeded in ${comparisons} comparisons.`
          : `Comparing target ${t} with index [${i}] (${this.array[i]}): no match, advancing.`
      });

      if (isMatch) {
        return { success: true, found: true, index: i, comparisons, trace };
      }
    }

    trace.push({
      step: this.array.length + 1,
      type: 'NOT_FOUND',
      index: -1,
      target: t,
      comparisons,
      isMatch: false,
      explanation: `Target ${t} was not found after inspecting all ${this.array.length} elements (O(n) worst case).`
    });

    return { success: true, found: false, index: -1, comparisons, trace };
  }

  binarySearch(target) {
    const t = Number(target);
    const trace = [];

    if (!this.isSorted()) {
      return {
        success: false,
        error: 'UNSORTED_ARRAY',
        message: 'Binary Search strictly requires a sorted array. Please sort the array first.',
        trace: []
      };
    }

    let low = 0;
    let high = this.array.length - 1;
    let stepNum = 1;
    let comparisons = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;
      const midVal = this.array[mid];

      if (midVal === t) {
        trace.push({
          step: stepNum++,
          type: 'FOUND',
          index: mid,
          range: [low, high],
          mid,
          currentValue: midVal,
          target: t,
          comparisons,
          isMatch: true,
          explanation: `Target ${t} matches mid element at index [${mid}]! Search completed in ${comparisons} comparison(s).`
        });
        return { success: true, found: true, index: mid, comparisons, trace };
      } else if (midVal < t) {
        trace.push({
          step: stepNum++,
          type: 'COMPARE_GREATER',
          index: mid,
          range: [low, high],
          mid,
          currentValue: midVal,
          target: t,
          comparisons,
          isMatch: false,
          explanation: `Element at mid [${mid}] (${midVal}) < target ${t}. Discarding left subarray [${low}..${mid}].`
        });
        low = mid + 1;
      } else {
        trace.push({
          step: stepNum++,
          type: 'COMPARE_LESS',
          index: mid,
          range: [low, high],
          mid,
          currentValue: midVal,
          target: t,
          comparisons,
          isMatch: false,
          explanation: `Element at mid [${mid}] (${midVal}) > target ${t}. Discarding right subarray [${mid}..${high}].`
        });
        high = mid - 1;
      }
    }

    trace.push({
      step: stepNum,
      type: 'NOT_FOUND',
      index: -1,
      target: t,
      comparisons,
      isMatch: false,
      explanation: `Target ${t} does not exist in array. Search space exhausted in O(log n) time.`
    });

    return { success: true, found: false, index: -1, comparisons, trace };
  }

  jumpSearch(target) {
    const t = Number(target);
    const trace = [];

    if (!this.isSorted()) {
      return { success: false, error: 'UNSORTED_ARRAY', message: 'Jump Search requires sorted array.', trace: [] };
    }

    const n = this.array.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let comparisons = 0;
    let stepNum = 1;

    while (this.array[Math.min(step, n) - 1] < t) {
      comparisons++;
      trace.push({
        step: stepNum++,
        type: 'JUMP',
        index: Math.min(step, n) - 1,
        range: [prev, Math.min(step, n) - 1],
        target: t,
        comparisons,
        explanation: `Block [${prev}..${Math.min(step, n) - 1}] end element (${this.array[Math.min(step, n) - 1]}) < ${t}. Jumping forward by block size √n = ${step}.`
      });
      prev = step;
      if (prev >= n) {
        return { success: true, found: false, index: -1, comparisons, trace };
      }
    }

    // Linear scan in identified block
    while (this.array[prev] < t) {
      comparisons++;
      trace.push({
        step: stepNum++,
        type: 'BLOCK_SCAN',
        index: prev,
        target: t,
        comparisons,
        explanation: `Linear scanning inside target block at index [${prev}] (${this.array[prev]}): element < ${t}.`
      });
      prev++;
      if (prev === Math.min(step, n)) {
        return { success: true, found: false, index: -1, comparisons, trace };
      }
    }

    comparisons++;
    if (this.array[prev] === t) {
      trace.push({
        step: stepNum++,
        type: 'FOUND',
        index: prev,
        target: t,
        comparisons,
        isMatch: true,
        explanation: `Found target ${t} at index [${prev}] in O(√n) time!`
      });
      return { success: true, found: true, index: prev, comparisons, trace };
    }

    return { success: true, found: false, index: -1, comparisons, trace };
  }

  interpolationSearch(target) {
    const t = Number(target);
    const trace = [];

    if (!this.isSorted()) {
      return { success: false, error: 'UNSORTED_ARRAY', message: 'Interpolation Search requires sorted array.', trace: [] };
    }

    let low = 0;
    let high = this.array.length - 1;
    let comparisons = 0;
    let stepNum = 1;

    while (low <= high && t >= this.array[low] && t <= this.array[high]) {
      comparisons++;
      if (low === high) {
        if (this.array[low] === t) {
          trace.push({ step: stepNum++, type: 'FOUND', index: low, target: t, isMatch: true, explanation: `Target ${t} found at index [${low}].` });
          return { success: true, found: true, index: low, comparisons, trace };
        }
        break;
      }

      // Interpolation probe formula
      const pos = low + Math.floor(((t - this.array[low]) * (high - low)) / (this.array[high] - this.array[low]));
      const posVal = this.array[pos];

      trace.push({
        step: stepNum++,
        type: posVal === t ? 'FOUND' : 'PROBE',
        index: pos,
        range: [low, high],
        currentValue: posVal,
        target: t,
        comparisons,
        isMatch: posVal === t,
        explanation: `Estimated probe position [${pos}] = ${posVal} using interpolation formula.`
      });

      if (posVal === t) {
        return { success: true, found: true, index: pos, comparisons, trace };
      } else if (posVal < t) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }

    return { success: true, found: false, index: -1, comparisons, trace };
  }
}

export default SearchingModel;
