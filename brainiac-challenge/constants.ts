import { AcademicLevel, Difficulty } from './types';

export const ACADEMIC_LEVELS: AcademicLevel[] = [
    AcademicLevel.PRIMARY,
    AcademicLevel.MIDDLE,
    AcademicLevel.HIGH,
    AcademicLevel.UNIVERSITY,
];

export const DIFFICULTY_LEVELS: Difficulty[] = [
    Difficulty.EASY,
    Difficulty.MEDIUM,
    Difficulty.HARD,
    Difficulty.EXPERT,
];

export const TIME_LIMITS: string[] = [
    "5 Minutes",
    "10 Minutes",
    "15 Minutes",
    "30 Minutes",
    "No Limit"
];

export const TOPICS: string[] = [
    "World History",
    "Algebra",
    "Physics",
    "Biology",
    "Chemistry",
    "Literature",
    "Geography",
    "Computer Science",
    "Art History",
    "Economics",
    "Custom"
];