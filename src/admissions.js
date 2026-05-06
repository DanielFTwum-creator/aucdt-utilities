function toUpperCase(input) {
  input.value = input.value.toUpperCase();
}

function calculateResults() {
  const selectElement = document.getElementById("exams");
  let selectedValue = selectElement.value;
  let aucdt = "TUC Admissions Checker ";

  // Define an object to store the exam types and their names
  var examNames = {
    wassce: "WASSCE",
    sssce: "SSSCE",
    abce: "ABCE",
    gbce: "GBCE",
    gceolevel: "GCE O'level",
    gcealevel: "GCE A'level",
    hnd: "HND",
    diploma: "Diploma",
  };

  // Get the selected value
  selectedValue = document.getElementById("exams").value;

  // Get the exam name based on the selected value
  var examName = examNames[selectedValue];

  // Set the page header with the exam name
  document.getElementById("page-header").innerHTML =
    aucdt + "(" + examName + ")";

  // Define the lookup table for scores
  let lookup = {
    A1: {
      wassce: "A1",
      score: 1,
      interpretation: "Excellent",
      percentage: "75 - 100",
    },
    B2: {
      wassce: "B2",
      score: 2,
      interpretation: "Very Good",
      percentage: "70 - 74",
    },
    B3: {
      wassce: "B3",
      score: 3,
      interpretation: "Good",
      percentage: "65 - 69",
    },
    C4: {
      wassce: "C4",
      score: 4,
      interpretation: "Credit",
      percentage: "60 - 64",
    },
    C5: {
      wassce: "C5",
      score: 5,
      interpretation: "Credit",
      percentage: "55 - 59",
    },
    C6: {
      wassce: "C6",
      score: 6,
      interpretation: "Credit",
      percentage: "50 - 54",
    },
    D7: {
      wassce: "D7",
      score: 7,
      interpretation: "Pass",
      percentage: "45 - 49",
    },
    E8: {
      wassce: "E8",
      score: 8,
      interpretation: "Pass",
      percentage: "40 - 44",
    },
    F9: {
      wassce: "F9",
      score: 9,
      interpretation: "Fail",
      percentage: "0 - 39",
    },
  };

  let lookup_sssce = {
    A1: {
      wassce: "A",
      score: 1,
      interpretation: "Excellent",
      percentage: "75 - 100",
    },
    B2: {
      wassce: "B",
      score: 2,
      interpretation: "Very Good",
      percentage: "70 - 74",
    },
    B3: {
      wassce: "B3",
      score: 3,
      interpretation: "Good",
      percentage: "65 - 69",
    },
    C4: {
      wassce: "C4",
      score: 4,
      interpretation: "Credit",
      percentage: "60 - 64",
    },
    C5: {
      wassce: "C5",
      score: 5,
      interpretation: "Credit",
      percentage: "55 - 59",
    },
    C6: {
      wassce: "C6",
      score: 6,
      interpretation: "Credit",
      percentage: "50 - 54",
    },
    D7: {
      wassce: "D7",
      score: 7,
      interpretation: "Pass",
      percentage: "45 - 49",
    },
    E8: {
      wassce: "E8",
      score: 8,
      interpretation: "Pass",
      percentage: "40 - 44",
    },
    F9: {
      wassce: "F9",
      score: 9,
      interpretation: "Fail",
      percentage: "0 - 39",
    },
  };
  // Get the input values from the form
  let eng = document.getElementById("englishScore").value.toUpperCase();
  let math = document.getElementById("mathsScore").value.toUpperCase();
  let soc = document.getElementById("socialScore").value.toUpperCase();
  let sci = document.getElementById("scienceScore").value.toUpperCase();
  let elec1 = document.getElementById("elective1Score").value.toUpperCase();
  let elec2 = document.getElementById("elective2Score").value.toUpperCase();
  let elec3 = document.getElementById("elective3Score").value.toUpperCase();
  let elec4 = document.getElementById("elective4Score").value.toUpperCase();

  // Calculate the total score for the core subjects
  let total = 0;
  let electivesTotal = 0;
  let coreTotal = 0;
  if (eng) {
    coreTotal += lookup[eng].score;
  }

  if (math) {
    coreTotal += lookup[math].score;
  }

  // Determine the two lowest scores from the core subjects
  let core = [soc, sci];
  if (soc && sci) {
    core.sort(function (a, b) {
      return lookup[a].score - lookup[b].score;
    });
    coreTotal += lookup[core[0]].score;
  }

  // Determine the two best scores from the elective subjects
  let electives = [elec1, elec2, elec3, elec4];
  if (elec1 && elec2 && elec3 && elec4) {
    electives.sort(function (a, b) {
      return lookup[a].score - lookup[b].score;
    });

    // Calculate the total score for the two highest elective subjects

    electivesTotal += lookup[electives[0]].score;
    electivesTotal += lookup[electives[1]].score;
    electivesTotal += lookup[electives[2]].score;

    // Calculate the total score
    total = coreTotal + electivesTotal;
  }

  // Determine if the scores qualify for admission
  let admissionStatus = "";
  let CUTOFF = 36;
  let PASS = "7";
  let englishScore = lookup[eng].score;

  if (eng && math && soc && sci && elec1 && elec2 && elec3 && elec4) {
    if (total > CUTOFF) {
      if (englishScore >= PASS) {
        admissionStatus =
          "You do not qualify for a degree programme since your Total Score exceeds the cutoff.<p> Since your English grade was " +
          lookup[eng].wassce +
          " you may consider applying for a diploma programme.";
      } else {
        admissionStatus =
          "Sorry, you do not qualify for a degree programme. <p>You may consider applying for a diploma programme.<p/>";
      }
    } else {
      admissionStatus = "Congratulations, you qualify for admission!";
    }
  } else {
    admissionStatus = "Please enter all your grades first.";
  }

  // Output the results
  document.getElementById("coreTotal").innerHTML = coreTotal;
  document.getElementById("electivesTotal").innerHTML = electivesTotal;
  document.getElementById("totalScore").innerHTML = total;
  document.getElementById("qualificationStatus").innerHTML = admissionStatus;
}

function validate(score) {
  // Validate score
  if (!validateScore(score)) {
    alert("Score format is invalid! Please enter a valid score.");
    scoreInput.focus();
    return false;
  }
}

function validateScore(scoreField) {
  var score = document.getElementById(scoreField).value;
  const selectElement = document.getElementById("exams");
  const selectedValue = selectElement.value;
  // Define an object to store the exam patterns
  var examPatterns = {
    wassce: /^(A1|B2|B3|C4|C5|C6|D7|E8|F9)$/,
    sssce: /^(A|B|C|D|E|F)$/,
    abce: /^(A|B|C|D|E|F)$/,
    gbce: /^(A|B|C|D|E|F)$/,
    gceolevel: /^(1|2|3|4|5|6|7|8|9)$/,
    gcealevel: /^(A|B|C|D|E)$/,
  };

  // Get the pattern based on the selected value
  var pattern = examPatterns[selectedValue];
  var isValid = pattern.test(score);
  var validationMessage = document.getElementById(
    scoreField + "ValidationMessage"
  );
  if (isValid) {
    validationMessage.innerHTML =
      '<span style="color:green">Valid score</span>';
  } else {
    validationMessage.innerHTML =
      '<span style="color:red">Invalid score</span>';
  }
}
