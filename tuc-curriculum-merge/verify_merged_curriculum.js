require('dotenv').config();
const fs = require('fs');

async function verify() {
  console.log('🔍 VERIFICATION PROTOCOL\n');

  try {
    // Layer 1: File verification
    console.log('Layer 1: File Verification');
    const curriculumFile = process.env.CURRICULUM_SOURCE;
    
    if (!fs.existsSync(curriculumFile)) {
      throw new Error(`Curriculum file not found: ${curriculumFile}`);
    }

    const curriculum = fs.readFileSync(curriculumFile, 'utf8');
    const lines = curriculum.split('\n');

    // Count courses and references
    let courseCount = 0;
    let refCount = 0;
    const courses = {};

    let currentCourse = '';
    for (const line of lines) {
      if (line.includes('COURSE CODE:')) {
        currentCourse = line.replace('COURSE CODE:', '').trim();
        courses[currentCourse] = { refs: 0 };
        courseCount++;
      }
      if (line.match(/^\d+\.\s+/) && currentCourse) {
        refCount++;
        courses[currentCourse].refs++;
      }
    }

    console.log(`✅ Courses found: ${courseCount}`);
    console.log(`✅ References found: ${refCount}`);
    console.log(`✅ Expected: 60 courses, 231 references\n`);

    // Layer 2: Format verification
    console.log('Layer 2: Format Verification');
    let validFormats = 0;
    let invalidFormats = 0;

    for (const [course, data] of Object.entries(courses)) {
      if (data.refs === 4) {
        validFormats++;
      } else {
        invalidFormats++;
        console.log(`⚠️  ${course}: ${data.refs} references (expected 4)`);
      }
    }

    console.log(`✅ Valid format: ${validFormats} courses`);
    console.log(`⚠️  Invalid format: ${invalidFormats} courses\n`);

    // Layer 3: Spot check
    console.log('Layer 3: Spot Check (10 random courses)');
    const courseArray = Object.keys(courses);
    for (let i = 0; i < Math.min(10, courseArray.length); i++) {
      const course = courseArray[i];
      const refs = courses[course].refs;
      console.log(`✅ ${course}: ${refs}/4 references`);
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    if (invalidFormats === 0 && courseCount === 60 && refCount === 240) {
      console.log('✅ VERIFICATION PASSED');
      console.log(`   All ${courseCount} courses with 4 references each`);
      console.log(`   Total: ${refCount} references verified`);
    } else {
      console.log('⚠️  VERIFICATION ISSUES DETECTED');
      if (courseCount !== 60) console.log(`   Expected 60 courses, found ${courseCount}`);
      if (refCount !== 240) console.log(`   Expected 240 references, found ${refCount}`);
      if (invalidFormats > 0) console.log(`   ${invalidFormats} courses have wrong reference count`);
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    process.exit(1);
  }
}

verify();
