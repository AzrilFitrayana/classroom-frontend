import { Subject } from "../types";

export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS301",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    description:
      "An in-depth study of fundamental data structures such as trees, graphs, heaps, and hash tables, along with algorithm design techniques including dynamic programming and greedy methods.",
    createdAt: "2024-01-10T08:00:00.000Z",
  },
  {
    id: 2,
    code: "MATH201",
    name: "Linear Algebra",
    department: "Mathematics",
    description:
      "Covers vector spaces, linear transformations, matrices, determinants, eigenvalues, and eigenvectors, with applications to systems of linear equations and real-world modelling.",
    createdAt: "2024-01-10T08:00:00.000Z",
  },
  {
    id: 3,
    code: "SE402",
    name: "Software Engineering Principles",
    department: "Software Engineering",
    description:
      "Introduces software development life cycles, agile methodologies, requirements engineering, system design patterns, testing strategies, and project management best practices.",
    createdAt: "2024-01-10T08:00:00.000Z",
  },
];