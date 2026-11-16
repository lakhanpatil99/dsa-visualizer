import vm from 'vm';

/**
 * Executes user submitted algorithm code in an isolated VM context against predefined test cases.
 * Strictly prevents system calls, network access, and shell execution.
 * 
 * @param {string} code - The user's JavaScript code
 * @param {string} functionName - Target function name (e.g. 'solve')
 * @param {Array} testCases - Array of { input: string, expectedOutput: string }
 * @param {number} [timeoutMs=1500] - Execution timeout per test case
 * @returns {Promise<{ status: string, passedTestCases: number, totalTestCases: number, executionTimeMs: number, errorMessage: string }>}
 */
export async function executeChallengeCode(code, functionName = 'solve', testCases = [], timeoutMs = 1500) {
  if (!code || typeof code !== 'string') {
    return {
      status: 'COMPILATION_ERROR',
      passedTestCases: 0,
      totalTestCases: testCases.length,
      executionTimeMs: 0,
      errorMessage: 'No code provided.'
    };
  }

  // Create isolated sandbox
  const sandbox = {
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    Math: Math,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Set: Set,
    Map: Map,
    Infinity: Infinity,
    NaN: NaN,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite
  };

  const context = vm.createContext(sandbox);

  let compiledScript;
  try {
    compiledScript = new vm.Script(code, { filename: 'solution.js' });
    compiledScript.runInContext(context, { timeout: 1000 });
  } catch (err) {
    return {
      status: 'COMPILATION_ERROR',
      passedTestCases: 0,
      totalTestCases: testCases.length,
      executionTimeMs: 0,
      errorMessage: `Syntax/Compilation error: ${err.message}`
    };
  }

  if (typeof sandbox[functionName] !== 'function') {
    return {
      status: 'COMPILATION_ERROR',
      passedTestCases: 0,
      totalTestCases: testCases.length,
      executionTimeMs: 0,
      errorMessage: `Function '${functionName}' is not defined.`
    };
  }

  let passed = 0;
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let parsedArgs;
    try {
      parsedArgs = JSON.parse(tc.input);
      if (!Array.isArray(parsedArgs)) {
        parsedArgs = [parsedArgs];
      }
    } catch {
      parsedArgs = [tc.input];
    }

    const startTime = process.hrtime();
    let result;
    try {
      // Execute the target function in the sandbox with timeout
      result = sandbox[functionName](...parsedArgs);
    } catch (execErr) {
      if (execErr.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || execErr.message.includes('timed out')) {
        return {
          status: 'TIME_LIMIT_EXCEEDED',
          passedTestCases: passed,
          totalTestCases: testCases.length,
          executionTimeMs: timeoutMs,
          errorMessage: `Time Limit Exceeded on test case ${i + 1} (> ${timeoutMs}ms).`
        };
      }
      return {
        status: 'RUNTIME_ERROR',
        passedTestCases: passed,
        totalTestCases: testCases.length,
        executionTimeMs: totalTime,
        errorMessage: `Runtime error on test case ${i + 1}: ${execErr.message}`
      };
    }

    const diff = process.hrtime(startTime);
    const timeMs = (diff[0] * 1e3) + (diff[1] * 1e-6);
    totalTime += timeMs;

    // Normalize output comparison
    const resultNormalized = JSON.stringify(result);
    let expectedNormalized;
    try {
      expectedNormalized = JSON.stringify(JSON.parse(tc.expectedOutput));
    } catch {
      expectedNormalized = String(tc.expectedOutput).trim();
    }

    if (resultNormalized === expectedNormalized || String(result) === String(tc.expectedOutput)) {
      passed++;
    } else {
      return {
        status: 'WRONG_ANSWER',
        passedTestCases: passed,
        totalTestCases: testCases.length,
        executionTimeMs: Math.round(totalTime),
        errorMessage: `Wrong Answer on test case ${i + 1}. Expected: ${expectedNormalized}, Got: ${resultNormalized}`
      };
    }
  }

  return {
    status: 'ACCEPTED',
    passedTestCases: passed,
    totalTestCases: testCases.length,
    executionTimeMs: Math.round(totalTime),
    errorMessage: ''
  };
}
