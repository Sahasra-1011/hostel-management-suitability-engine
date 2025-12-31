function calculateSuitabilityScore(user, hostel) {
  let score = 0;
  const reasons = [];

  const prefs = user?.preferences || {};

  // 1️⃣ City match
  if (prefs.cities?.get(hostel.city)) {
    score += 30;
    reasons.push("Preferred city");
  }

  // 2️⃣ Budget match
  if (prefs.budget?.min && prefs.budget?.max) {
    if (
      hostel.price >= prefs.budget.min &&
      hostel.price <= prefs.budget.max
    ) {
      score += 25;
      reasons.push("Matches your budget");
    }
  }

  // 3️⃣ Gender match
  if (prefs.gender && prefs.gender === hostel.gender) {
    score += 20;
    reasons.push("Preferred hostel type");
  }

  // 4️⃣ Facilities match
  if (prefs.facilities && hostel.facilities?.length) {
    let matchCount = 0;

    hostel.facilities.forEach((facility) => {
      if (prefs.facilities.get(facility)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      score += 15;
      reasons.push(`${matchCount} preferred facilities`);
    }
  }

  // 5️⃣ Availability
  if (hostel.availableBeds > 0) {
    score += 10;
    reasons.push("Beds available");
  }

  return {
    score,
    reasons,
  };
}

module.exports = calculateSuitabilityScore;
