/**
 * Universal Deterministic Algorithm Trace Builder
 * Produces structured, inspectable trace steps for algorithm visualizations.
 */

export const STEP_TYPES = {
  COMPARE: 'compare',
  SWAP: 'swap',
  OVERWRITE: 'overwrite',
  MARK_SORTED: 'mark_sorted',
  VISIT_NODE: 'visit_node',
  EXAMINE_EDGE: 'examine_edge',
  RELAX_EDGE: 'relax_edge',
  UPDATE_DISTANCE: 'update_distance',
  CELL_LOOKUP: 'cell_lookup',
  CELL_UPDATE: 'cell_update',
  POINTER_MOVE: 'pointer_move',
  TREE_HIGHLIGHT: 'tree_highlight',
  TREE_ROTATE: 'tree_rotate',
  STACK_PUSH: 'stack_push',
  STACK_POP: 'stack_pop',
  QUEUE_ENQUEUE: 'queue_enqueue',
  QUEUE_DEQUEUE: 'queue_dequeue',
  BACKTRACK: 'backtrack',
  MATCH_FOUND: 'match_found',
  MISMATCH: 'mismatch',
  COMPLETE: 'complete',
  INFO: 'info'
};

export class TraceBuilder {
  constructor(initialState = {}) {
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.steps = [];
  }

  addStep(type, payload = {}, options = {}) {
    const step = {
      stepIndex: this.steps.length,
      type,
      line: options.line || 1,
      description: options.description || '',
      comparisons: options.comparisons ?? null,
      swaps: options.swaps ?? null,
      state: payload,
      timestamp: Date.now()
    };
    this.steps.push(step);
    return step;
  }

  compare(indices, line, description, metrics = {}) {
    return this.addStep(
      STEP_TYPES.COMPARE,
      { activeIndices: indices, comparison: true },
      { line, description, ...metrics }
    );
  }

  swap(indexA, indexB, arraySnapshot, line, description, metrics = {}) {
    return this.addStep(
      STEP_TYPES.SWAP,
      {
        activeIndices: [indexA, indexB],
        swappedIndices: [indexA, indexB],
        array: [...arraySnapshot]
      },
      { line, description, ...metrics }
    );
  }

  overwrite(index, value, arraySnapshot, line, description, metrics = {}) {
    return this.addStep(
      STEP_TYPES.OVERWRITE,
      {
        activeIndices: [index],
        overwrittenIndex: index,
        value,
        array: [...arraySnapshot]
      },
      { line, description, ...metrics }
    );
  }

  markSorted(indices, arraySnapshot, line, description) {
    return this.addStep(
      STEP_TYPES.MARK_SORTED,
      {
        sortedIndices: Array.isArray(indices) ? indices : [indices],
        array: [...arraySnapshot]
      },
      { line, description }
    );
  }

  complete(finalState, description = 'Algorithm completed successfully.') {
    return this.addStep(
      STEP_TYPES.COMPLETE,
      { ...finalState, isCompleted: true },
      { line: 0, description }
    );
  }

  getTrace() {
    return {
      initialState: this.initialState,
      totalSteps: this.steps.length,
      steps: this.steps
    };
  }
}

export default TraceBuilder;
