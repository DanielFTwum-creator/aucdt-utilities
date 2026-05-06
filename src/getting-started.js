fixture("Getting Started").page("https://portal.aucdt.edu.gh/checker/");

test("My first test", async (t) => {
  await t.typeText("#englishScore", "D7");
});
