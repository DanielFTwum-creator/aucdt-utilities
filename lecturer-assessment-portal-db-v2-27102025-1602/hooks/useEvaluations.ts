import React, { useState, useMemo, useCallback } from 'react';
import { LecturerEvaluation, Statistics, Programme, ProgrammeAnalytics, LecturerSummary, Lecturer, Course } from '../types';

export const useEvaluations = (
  evaluations: LecturerEvaluation[],
  programmes: Programme[],
  lecturers: Lecturer[],
  courses: Course[]
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBySemester, setFilterBySemester] = useState<number | null>(null);
  const [filterByProgramme, setFilterByProgramme] = useState<string | null>(null);

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(evaluation => {
      const searchLower = searchTerm.toLowerCase();
      const lecturerName = lecturers.find(l => l.id === evaluation.lecturerId)?.name || '';
      const courseName = courses.find(c => c.id === evaluation.courseId)?.name || '';

      const matchesSearch =
        evaluation.lecturerId.toLowerCase().includes(searchLower) ||
        evaluation.courseId.toLowerCase().includes(searchLower) ||
        lecturerName.toLowerCase().includes(searchLower) ||
        courseName.toLowerCase().includes(searchLower);
      
      const matchesSemester = filterBySemester === null || evaluation.semester === filterBySemester;
      const matchesProgramme = filterByProgramme === null || evaluation.programmeId === filterByProgramme;

      return matchesSearch && matchesSemester && matchesProgramme;
    });
  }, [evaluations, searchTerm, filterBySemester, filterByProgramme, lecturers, courses]);

  const statistics: Statistics = useMemo(() => {
    const totalEvaluations = evaluations.length;
    if (totalEvaluations === 0) {
      return {
        totalEvaluations: 0,
        averageOverallRating: '0.0',
        recommendationRate: '0.0',
      };
    }

    const totalRatingSum = evaluations.reduce((sum: number, evalItem) => {
      const ratings = Object.values(evalItem.ratings);
      const evalAvg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
      return sum + evalAvg;
    }, 0);
    const averageOverallRating = totalRatingSum / totalEvaluations;

    const recommendationCount = evaluations.filter(
      evalItem => evalItem.recommend === 'Recommend'
    ).length;
    const recommendationRate = (recommendationCount / totalEvaluations) * 100;

    return {
      totalEvaluations,
      averageOverallRating: averageOverallRating.toFixed(1),
      recommendationRate: recommendationRate.toFixed(1),
    };
  }, [evaluations]);

  const programmeAnalytics = useMemo<ProgrammeAnalytics[]>(() => {
    return programmes.map(prog => {
      const progEvals = evaluations.filter(e => e.programmeId === prog.id);
      const evalCount = progEvals.length;
      
      const progCourses = courses.filter(c => c.programmeId === prog.id);
      const lecturerIdsInProg = new Set<string>();
      progCourses.forEach(c => {
          c.lecturerIds.forEach(lId => lecturerIdsInProg.add(lId));
      });

      const lecturerCount = lecturerIdsInProg.size;
      const courseCount = progCourses.length;

      if (evalCount === 0) {
        return {
          id: prog.id,
          name: prog.name,
          lecturerCount,
          courseCount,
          evaluationCount: 0,
          avgRating: '0.0',
          recommendationRate: '0.0',
        };
      }
      
      const totalRating = progEvals.reduce((sum: number, e) => {
        const ratings = Object.values(e.ratings);
        const avg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
        return sum + avg;
      }, 0);
      const recommendCount = progEvals.filter(e => e.recommend === 'Recommend').length;

      return {
        id: prog.id,
        name: prog.name,
        lecturerCount,
        courseCount,
        evaluationCount: evalCount,
        avgRating: (totalRating / evalCount).toFixed(1),
        recommendationRate: ((recommendCount / evalCount) * 100).toFixed(1),
      };
    });
  }, [evaluations, programmes, lecturers, courses]);
  
  const lecturerSummary = useMemo<LecturerSummary[]>(() => {
    // Ensure all lecturers from the curriculum are included, even with zero evaluations
    return lecturers.map(lecturer => {
        const evals = evaluations.filter(e => e.lecturerId === lecturer.id);
        const evalCount = evals.length;

        const totalRating = evals.reduce((sum: number, e) => {
            const ratings = Object.values(e.ratings);
            const avg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
            return sum + avg;
        }, 0);
        
        const recommendCount = evals.filter(e => e.recommend === 'Recommend').length;
        
        // Find all unique courses this lecturer has evaluations for
        const taughtCourseIds = new Set(evals.map(e => e.courseId));
        // Also include courses they are assigned to but might not have evals for yet
        courses.forEach(c => {
            if (c.lecturerIds.includes(lecturer.id)) {
                taughtCourseIds.add(c.id);
            }
        });
        
        const coursesTaught = courses.filter(c => taughtCourseIds.has(c.id));
        
        // Find all unique programmes this lecturer is involved in based on their courses.
        // This ensures that if a lecturer teaches multiple courses in the same programme, the programme is only listed once.
        const programmeLookup = new Map(programmes.map(p => [p.id, p]));
        const uniqueProgrammeIds = new Set(coursesTaught.map(c => c.programmeId));
        const programmesTaught = Array.from(uniqueProgrammeIds)
            .map(id => programmeLookup.get(id))
            .filter((p): p is Programme => Boolean(p));

        return {
            id: lecturer.id,
            name: lecturer.name,
            programmesTaught: programmesTaught,
            coursesTaught: coursesTaught,
            evaluationCount: evalCount,
            avgRating: evalCount > 0 ? (totalRating / evalCount).toFixed(1) : '0.0',
            recommendationRate: evalCount > 0 ? ((recommendCount / evalCount) * 100).toFixed(1) : '0.0',
        };
    }).sort((a, b) => b.evaluationCount - a.evaluationCount);
  }, [evaluations, lecturers, courses, programmes]);


  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSemesterFilter = useCallback((semester: number | null) => {
    setFilterBySemester(semester);
  }, []);

  const handleProgrammeFilter = useCallback((programmeId: string | null) => {
    setFilterByProgramme(programmeId);
  }, []);
  
  return {
      filteredEvaluations,
      statistics,
      searchTerm,
      filterBySemester,
      filterByProgramme,
      handleSearchChange,
      handleSemesterFilter,
      handleProgrammeFilter,
      programmeAnalytics,
      lecturerSummary,
  };
};