/**
 * AlgoMania Hash Table Model
 * High-precision Hash Table implementation supporting Separate Chaining
 * and Open Addressing (Linear Probing with Tombstones), dynamic resizing,
 * and comprehensive collision resolution step traces.
 */

export class HashTableModel {
  constructor(capacity = 10, collisionMode = 'separateChaining') {
    this.capacity = capacity;
    this.collisionMode = collisionMode; // 'separateChaining' | 'linearProbing'
    this.buckets = this.initBuckets(capacity, collisionMode);
    this.count = 0;
    this.collisionCount = 0;
    this.probeCount = 0;
    this.history = [];
  }

  initBuckets(cap, mode) {
    if (mode === 'separateChaining') {
      return Array.from({ length: cap }, () => []);
    } else {
      return new Array(cap).fill(null);
    }
  }

  setCollisionMode(mode) {
    if (this.collisionMode === mode) return;
    const allEntries = this.getAllEntries();
    this.collisionMode = mode;
    this.buckets = this.initBuckets(this.capacity, mode);
    this.count = 0;
    this.collisionCount = 0;
    allEntries.forEach(entry => this.set(entry.key, entry.value));
  }

  hash(key) {
    const str = String(key);
    let hashVal = 0;
    for (let i = 0; i < str.length; i++) {
      hashVal = (hashVal * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashVal);
  }

  getLoadFactor() {
    return this.count / this.capacity;
  }

  set(key, value) {
    if (key == null || String(key).trim() === '') {
      return { success: false, error: 'INVALID_KEY', message: 'Key cannot be blank.' };
    }

    const cleanKey = String(key).trim();
    const cleanVal = value !== undefined ? value : cleanKey;
    const computedIndex = this.hash(cleanKey);
    const trace = [];

    trace.push({
      step: 1,
      type: 'HASH_COMPUTED',
      key: cleanKey,
      index: computedIndex,
      desc: `Computed polynomial hash for key "${cleanKey}" → Bucket index [${computedIndex}].`
    });

    let result;
    if (this.collisionMode === 'separateChaining') {
      result = this.setChaining(cleanKey, cleanVal, computedIndex, trace);
    } else {
      result = this.setLinearProbing(cleanKey, cleanVal, computedIndex, trace);
    }

    // Auto-resize check if load factor exceeds threshold
    const threshold = this.collisionMode === 'separateChaining' ? 0.8 : 0.7;
    if (this.getLoadFactor() > threshold && this.capacity < 24) {
      this.resize(this.capacity * 2);
    }

    return result;
  }

  setChaining(key, value, index, trace) {
    const bucket = this.buckets[index];
    const existingIndex = bucket.findIndex(item => item.key === key);

    if (existingIndex !== -1) {
      trace.push({
        step: 2,
        type: 'KEY_UPDATE',
        key,
        index,
        oldValue: bucket[existingIndex].value,
        newValue: value,
        desc: `Key "${key}" already exists in bucket [${index}]. Updated value to "${value}".`
      });
      bucket[existingIndex].value = value;
      return { success: true, action: 'update', key, value, index, trace, message: `Updated key "${key}" to "${value}".` };
    }

    const hasCollision = bucket.length > 0;
    if (hasCollision) {
      this.collisionCount++;
      trace.push({
        step: 2,
        type: 'COLLISION',
        key,
        index,
        desc: `Collision detected: Bucket [${index}] already holds ${bucket.length} item(s). Appending to linked chain.`
      });
    }

    bucket.push({ key, value });
    this.count++;

    trace.push({
      step: hasCollision ? 3 : 2,
      type: 'INSERT_CHAIN',
      key,
      value,
      index,
      chainLength: bucket.length,
      desc: `Stored pair ("${key}", "${value}") in bucket [${index}].`
    });

    const opRecord = {
      type: 'INSERT',
      key,
      value,
      index,
      timestamp: Date.now(),
      message: `Inserted ("${key}", "${value}") into bucket [${index}] via Separate Chaining.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return { success: true, action: 'insert', key, value, index, hasCollision, trace, message: opRecord.message };
  }

  setLinearProbing(key, value, index, trace) {
    let currentIdx = index;
    let probes = 0;
    let firstTombstoneIdx = -1;

    while (probes < this.capacity) {
      this.probeCount++;
      const slot = this.buckets[currentIdx];

      if (slot === null) {
        // Found empty slot
        break;
      }

      if (slot.isDeleted && firstTombstoneIdx === -1) {
        firstTombstoneIdx = currentIdx;
      }

      if (!slot.isDeleted && slot.key === key) {
        // Key exists, update value
        slot.value = value;
        trace.push({
          step: 2,
          type: 'KEY_UPDATE',
          key,
          index: currentIdx,
          newValue: value,
          desc: `Key "${key}" found at probed slot [${currentIdx}]. Updated value.`
        });
        return { success: true, action: 'update', key, value, index: currentIdx, trace, message: `Updated key "${key}".` };
      }

      // Collision occurred; probe next slot
      this.collisionCount++;
      trace.push({
        step: probes + 2,
        type: 'PROBE_COLLISION',
        fromIndex: currentIdx,
        toIndex: (currentIdx + 1) % this.capacity,
        desc: `Slot [${currentIdx}] occupied by key "${slot.key}". Probing next linear slot.`
      });

      currentIdx = (currentIdx + 1) % this.capacity;
      probes++;
    }

    if (probes >= this.capacity && firstTombstoneIdx === -1) {
      return { success: false, error: 'TABLE_FULL', message: 'Hash table capacity full. Cannot insert.' };
    }

    const targetIdx = firstTombstoneIdx !== -1 ? firstTombstoneIdx : currentIdx;
    this.buckets[targetIdx] = { key, value, isDeleted: false };
    this.count++;

    trace.push({
      step: probes + 3,
      type: 'STORED',
      key,
      value,
      index: targetIdx,
      probes,
      desc: `Stored ("${key}", "${value}") in slot [${targetIdx}] after ${probes} probe step(s).`
    });

    const opRecord = {
      type: 'INSERT_PROBE',
      key,
      value,
      index: targetIdx,
      probes,
      timestamp: Date.now(),
      message: `Inserted ("${key}", "${value}") into slot [${targetIdx}] via Linear Probing (${probes} probes).`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return { success: true, action: 'insert', key, value, index: targetIdx, probes, trace, message: opRecord.message };
  }

  get(key) {
    const cleanKey = String(key).trim();
    const computedIndex = this.hash(cleanKey);

    if (this.collisionMode === 'separateChaining') {
      const bucket = this.buckets[computedIndex];
      const match = bucket.find(item => item.key === cleanKey);
      if (match) {
        return { success: true, found: true, key: cleanKey, value: match.value, index: computedIndex, message: `Found "${cleanKey}" = "${match.value}" in bucket [${computedIndex}].` };
      }
    } else {
      let currentIdx = computedIndex;
      let probes = 0;
      while (probes < this.capacity) {
        const slot = this.buckets[currentIdx];
        if (slot === null) break;
        if (!slot.isDeleted && slot.key === cleanKey) {
          return { success: true, found: true, key: cleanKey, value: slot.value, index: currentIdx, probes, message: `Found "${cleanKey}" = "${slot.value}" at slot [${currentIdx}].` };
        }
        currentIdx = (currentIdx + 1) % this.capacity;
        probes++;
      }
    }

    return { success: true, found: false, key: cleanKey, message: `Key "${cleanKey}" not found in hash table.` };
  }

  delete(key) {
    const cleanKey = String(key).trim();
    const computedIndex = this.hash(cleanKey);

    if (this.collisionMode === 'separateChaining') {
      const bucket = this.buckets[computedIndex];
      const idx = bucket.findIndex(item => item.key === cleanKey);
      if (idx !== -1) {
        const removed = bucket.splice(idx, 1)[0];
        this.count--;
        return { success: true, deleted: true, key: cleanKey, value: removed.value, index: computedIndex, message: `Deleted key "${cleanKey}" from bucket [${computedIndex}].` };
      }
    } else {
      let currentIdx = computedIndex;
      let probes = 0;
      while (probes < this.capacity) {
        const slot = this.buckets[currentIdx];
        if (slot === null) break;
        if (!slot.isDeleted && slot.key === cleanKey) {
          slot.isDeleted = true; // Set Tombstone
          this.count--;
          return { success: true, deleted: true, key: cleanKey, index: currentIdx, message: `Deleted key "${cleanKey}" from slot [${currentIdx}] (marked with tombstone).` };
        }
        currentIdx = (currentIdx + 1) % this.capacity;
        probes++;
      }
    }

    return { success: false, error: 'NOT_FOUND', message: `Cannot delete: key "${cleanKey}" not found.` };
  }

  resize(newCapacity) {
    const oldEntries = this.getAllEntries();
    this.capacity = newCapacity;
    this.buckets = this.initBuckets(newCapacity, this.collisionMode);
    this.count = 0;
    this.collisionCount = 0;
    oldEntries.forEach(item => this.set(item.key, item.value));
    return { success: true, newCapacity, message: `Resized and rehashed table to capacity ${newCapacity}.` };
  }

  getAllEntries() {
    const entries = [];
    if (this.collisionMode === 'separateChaining') {
      this.buckets.forEach(bucket => {
        bucket.forEach(item => entries.push({ ...item }));
      });
    } else {
      this.buckets.forEach(slot => {
        if (slot && !slot.isDeleted) {
          entries.push({ key: slot.key, value: slot.value });
        }
      });
    }
    return entries;
  }

  clear() {
    this.buckets = this.initBuckets(this.capacity, this.collisionMode);
    this.count = 0;
    this.collisionCount = 0;
    this.probeCount = 0;
    this.history = [];
    return { success: true, message: 'Hash table has been cleared.' };
  }

  toArray() {
    return this.getAllEntries();
  }

  getMetrics() {
    return {
      size: this.count,
      capacity: this.capacity,
      loadFactor: Number(this.getLoadFactor().toFixed(2)),
      collisionCount: this.collisionCount,
      probeCount: this.probeCount,
      collisionMode: this.collisionMode
    };
  }

  getHistory() {
    return [...this.history];
  }
}

export default HashTableModel;
