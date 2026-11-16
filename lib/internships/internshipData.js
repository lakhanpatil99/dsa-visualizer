/**
 * Authoritative program definitions for AlgoMania Internships.
 * Domains: Java Development, Python Development, C++ Systems & Algorithms.
 */
export const DEFAULT_INTERNSHIP_PROGRAMS = [
  {
    programId: 'java-dev',
    domain: 'Java',
    title: 'Java Enterprise & Algorithm Engineering Internship',
    shortDescription: 'Master object-oriented architecture, concurrent programming, high-performance data structures, and Spring Boot microservices.',
    description: 'This rigorous internship program immerses engineers in high-performance enterprise Java. You will build distributed systems, implement complex algorithmic pipelines, master multithreading & memory models, and design modular microservices with production-grade test coverage.',
    technologies: ['Java 21', 'Spring Boot 3', 'JPA / Hibernate', 'Multithreading & Concurrency', 'JUnit 5', 'PostgreSQL', 'Docker'],
    learningObjectives: [
      'Design clean, maintainable enterprise services using SOLID principles and Design Patterns.',
      'Implement concurrent task pipelines using virtual threads (Project Loom) and synchronized memory locks.',
      'Develop custom high-throughput caching and queuing structures.',
      'Deploy containerized RESTful API architectures with full automated integration testing.'
    ],
    durationOptions: ['1_month', '2_months', '3_months'],
    programFormat: 'Remote / Mentored Project Lab',
    certificateEligibility: 'Granted upon completion of all sprint deliverables, mentor code review, and successful architecture defense.',
    status: 'active'
  },
  {
    programId: 'python-dev',
    domain: 'Python',
    title: 'Python Backend & Computational Systems Internship',
    shortDescription: 'Build scalable asynchronous backend systems, algorithmic optimization workflows, and data processing engines.',
    description: 'A deep-dive engineering program focusing on advanced Python. Participants build asynchronous HTTP/WebSocket services, profile and optimize algorithmic bottlenecks, interface with relational and vector stores, and architect robust data processing workflows.',
    technologies: ['Python 3.12', 'FastAPI', 'AsyncIO', 'SQLAlchemy', 'PyTest', 'Redis', 'NumPy'],
    learningObjectives: [
      'Master asynchronous non-blocking I/O programming with Python AsyncIO and FastAPI.',
      'Profile CPU and memory performance to eliminate computational algorithmic bottlenecks.',
      'Design event-driven data streaming pipelines with Redis pub/sub.',
      'Write exhaustive unit and property-based test suites with PyTest and GitHub Actions.'
    ],
    durationOptions: ['1_month', '2_months', '3_months'],
    programFormat: 'Remote / Mentored Project Lab',
    certificateEligibility: 'Granted upon completion of sprint deliverables, peer-reviewed pull requests, and final project evaluation.',
    status: 'active'
  },
  {
    programId: 'cpp-dev',
    domain: 'C++',
    title: 'C++ Systems, Memory & Algorithm Engineering Internship',
    shortDescription: 'Engineered for systems enthusiasts: low-level memory control, modern C++20 paradigms, cache-friendly data structures, and algorithmic efficiency.',
    description: 'This elite track trains candidates in modern C++ systems engineering. You will master manual memory management, RAII, pointer arithmetic, cache-friendly data structures, custom memory allocators, and deterministic algorithm implementations.',
    technologies: ['Modern C++20', 'CMake', 'Valgrind / AddressSanitizer', 'Google Test', 'STL Custom Allocators', 'Linux Systems'],
    learningObjectives: [
      'Master modern C++ memory models, smart pointers, move semantics, and RAII.',
      'Design and benchmark cache-oblivious and contiguous data structures.',
      'Debug memory leaks, race conditions, and segmentation faults with Valgrind and sanitizers.',
      'Build performant modular C++ libraries with automated CMake build systems.'
    ],
    durationOptions: ['1_month', '2_months', '3_months'],
    programFormat: 'Remote / Mentored Project Lab',
    certificateEligibility: 'Granted upon verification of codebase stability, memory cleanliness benchmarks, and technical mentor review.',
    status: 'active'
  }
];

export function getProgramByDomain(domain) {
  if (!domain) return null;
  const normalized = domain.toLowerCase().trim();
  return DEFAULT_INTERNSHIP_PROGRAMS.find(p => p.domain.toLowerCase() === normalized || p.programId === normalized) || null;
}
